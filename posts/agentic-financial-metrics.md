---
title: "Building Agentic Workflows for Financial Metric Analysis: Google ADK, Snowflake, and AWS AgentCore"
date: "2026-03-21"
excerpt: "How I designed a multi-agent system to automate raw financial data review and metric analysis — using Google ADK for orchestration, Snowflake as the data backbone, and AWS AgentCore for production deployment."
tags: ["Multi-Agent", "Google ADK", "Snowflake", "AWS AgentCore", "FinTech", "LLMs"]
---

## The Problem with Raw Financial Data

Anyone who has worked in financial services knows the drill: enormous Snowflake tables, dozens of metric dimensions, and a team of analysts spending hours each week running the same SQL queries, cross-checking numbers against thresholds, and writing the same commentary in slightly different words.

At Goldman Sachs, I work on Liquidity Risk Applications. A meaningful chunk of our operational load is reviewing raw position data, computing regulatory metrics (FR2052a, for instance), flagging anomalies, and surfacing narratives for the risk team. The data is there. The logic is known. The threshold rules are documented. So why is a human still doing this every morning?

That question is what pushed me to start building an agentic workflow — one that could ingest raw Snowflake data, run structured analysis, surface anomalies, and generate a reviewable report with zero manual SQL.

This post is the architecture writeup I wish existed when I started.

---

## Why Multi-Agent, Not a Single Prompt

The instinct when you first encounter LLMs is to make one very large prompt and ask it to do everything. In my experience, this works fine in demos and fails in production for three reasons:

**Context rot.** A single agent accumulates everything — raw query results, intermediate reasoning, tool outputs — into one growing context window. Performance measurably degrades past 50k–100k tokens regardless of what the model's theoretical limit is. With large Snowflake result sets, you hit this faster than you expect.

**No separation of concerns.** A monolithic agent that pulls data, analyses it, formats it, and writes the report is impossible to debug when the report is wrong. You don't know if the SQL was bad, the threshold logic was wrong, or the narrative generation hallucinated.

**Can't parallelize.** Regulatory metric analysis has natural parallel branches — liquidity metrics, counterparty exposure, FX delta, intraday cash flows. Each is independent. Running them sequentially in a single agent is leaving compute on the table.

The solution is a multi-agent architecture that mirrors how an actual analyst team works: a lead coordinator that delegates, specialist agents that focus, and a synthesis layer that assembles the final output.

---

## Architecture Overview

```
                        ┌─────────────────────────┐
                        │   Orchestrator Agent    │
                        │   (LlmAgent / ADK)      │
                        └────────────┬────────────┘
                                     │ delegates
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
   ┌──────────▼──────────┐  ┌───────▼────────┐  ┌─────────▼─────────┐
   │  Data Retrieval     │  │  Metric        │  │  Anomaly          │
   │  Agent              │  │  Analysis      │  │  Detection        │
   │  (SequentialAgent)  │  │  Agent         │  │  Agent            │
   └──────────┬──────────┘  └───────┬────────┘  └─────────┬─────────┘
              │                      │                      │
   ┌──────────▼──────────────────────▼──────────────────────▼─────────┐
   │                    Snowflake Tool Layer                           │
   │   (SQL execution · schema introspection · result pagination)      │
   └───────────────────────────────────────────────────────────────────┘
              │
   ┌──────────▼──────────┐
   │  Report Synthesis   │
   │  Agent              │
   │  (LlmAgent)         │
   └──────────┬──────────┘
              │
   ┌──────────▼──────────┐
   │  AWS AgentCore      │
   │  Runtime            │
   │  (deployment +      │
   │  observability)     │
   └─────────────────────┘
```

Each agent has a single responsibility. The orchestrator never touches Snowflake directly — it only reads agent outputs. The Snowflake tools are shared across agents but each agent sees only the tool subset it needs.

---

## Google ADK as the Orchestration Layer

I chose Google ADK because it gives you deterministic orchestration primitives (`SequentialAgent`, `ParallelAgent`, `LoopAgent`) alongside LLM-driven agents (`LlmAgent`) in the same framework. That combination is exactly what financial workflows need: structured, auditable pipelines with LLM intelligence only where it adds value.

### Defining the Agent Hierarchy

```python
from google.adk.agents import LlmAgent, SequentialAgent, ParallelAgent
from google.adk.tools import FunctionTool

# --- Snowflake tools ---
def query_positions(sql: str, limit: int = 5000) -> dict:
    """Execute a SQL query against the positions table and return results."""
    conn = get_snowflake_connection()
    cursor = conn.cursor(DictCursor)
    cursor.execute(sql)
    rows = cursor.fetchmany(limit)
    return {"rows": rows, "count": len(rows)}

def get_metric_thresholds(metric_name: str, reporting_date: str) -> dict:
    """Fetch regulatory threshold configuration for a given metric and date."""
    conn = get_snowflake_connection()
    cursor = conn.cursor(DictCursor)
    cursor.execute(
        "SELECT * FROM risk.metric_thresholds WHERE metric = %s AND effective_date <= %s ORDER BY effective_date DESC LIMIT 1",
        (metric_name, reporting_date)
    )
    return cursor.fetchone() or {}

# --- Data retrieval agent (deterministic) ---
data_agent = SequentialAgent(
    name="data_retrieval_agent",
    description="Pulls raw position data and metric thresholds from Snowflake for a given reporting date.",
    sub_agents=[
        LlmAgent(
            name="sql_planner",
            model="gemini-2.0-flash",
            instruction="""You are a financial data engineer. Given a reporting date and metric list,
            generate the exact SQL queries needed to retrieve positions, exposures, and thresholds.
            Use only the approved table list provided. Always include a date filter.""",
            tools=[FunctionTool(query_positions), FunctionTool(get_metric_thresholds)],
        )
    ]
)

# --- Metric analysis agent (LLM-driven) ---
metric_agent = LlmAgent(
    name="metric_analysis_agent",
    model="gemini-2.0-flash",
    instruction="""You are a liquidity risk analyst. Given raw position data and threshold configurations,
    compute each metric value, compare against thresholds, and classify each as PASS, WARN, or BREACH.
    For each BREACH or WARN, provide a one-sentence root cause hypothesis.
    Return structured JSON only — no prose.""",
    output_schema=MetricAnalysisOutput,  # Pydantic model
)

# --- Parallel analysis tier ---
analysis_tier = ParallelAgent(
    name="analysis_tier",
    description="Runs metric analysis and anomaly detection concurrently.",
    sub_agents=[metric_agent, anomaly_agent]
)

# --- Root orchestrator ---
orchestrator = LlmAgent(
    name="financial_metrics_orchestrator",
    model="gemini-2.0-flash",
    instruction="""You are the lead risk analyst. Coordinate the analysis workflow:
    1. Delegate data retrieval to the data agent
    2. Once data is ready, trigger parallel metric analysis and anomaly detection
    3. Once both complete, synthesize findings into an executive summary
    Focus only on material findings. Suppress PASS metrics from the final report.""",
    sub_agents=[data_agent, analysis_tier, report_agent],
)
```

### Why `SequentialAgent` for Data Retrieval

The data layer is not a place for LLM creativity. You want a fixed, auditable sequence: validate the reporting date → pull positions → pull thresholds → validate row counts. `SequentialAgent` gives you exactly that guarantee while still allowing each step to use a `LlmAgent` for SQL generation (which benefits from natural language flexibility).

### Why `ParallelAgent` for Analysis

Metric analysis and anomaly detection are independent — they read from the same data but write to separate outputs. Running them concurrently cuts wall-clock time roughly in half on large datasets. ADK's `ParallelAgent` handles the fan-out and fan-in automatically.

---

## Snowflake as the Data Backbone

The key insight for connecting Snowflake to agents is **tool design**. A bad tool gives the agent an entire table. A good tool gives the agent a queryable interface with guardrails.

### Tool Design Principles for Financial Data

**1. Parameterize by reporting date, not raw SQL.**

Don't give the agent a general `execute_sql` tool. Give it `get_liquidity_positions(reporting_date, currency, counterparty_type)`. This prevents prompt injection, limits surface area, and keeps queries predictable for auditing.

```python
def get_liquidity_positions(
    reporting_date: str,
    currency: str = "USD",
    counterparty_type: str = "ALL",
    maturity_bucket: str = "ALL"
) -> dict:
    """
    Retrieve intraday liquidity positions from Snowflake.

    Args:
        reporting_date: ISO format date string (YYYY-MM-DD)
        currency: 3-letter ISO currency code, or 'ALL' for all currencies
        counterparty_type: 'BANK', 'CORP', 'GOVT', or 'ALL'
        maturity_bucket: 'O/N', '1W', '1M', '3M', or 'ALL'

    Returns:
        dict with 'positions' list and 'total_count'
    """
    filters = ["reporting_date = %(date)s"]
    params = {"date": reporting_date}

    if currency != "ALL":
        filters.append("currency = %(currency)s")
        params["currency"] = currency
    if counterparty_type != "ALL":
        filters.append("counterparty_type = %(ctype)s")
        params["ctype"] = counterparty_type

    sql = f"""
        SELECT position_id, product_type, currency, notional_usd,
               maturity_date, counterparty_id, risk_category
        FROM risk.intraday_positions
        WHERE {' AND '.join(filters)}
        ORDER BY notional_usd DESC
        LIMIT 10000
    """
    # ... execute and return
```

**2. Return structured dicts, not raw cursors.**

Agents consume JSON. Return clean dicts with metadata (row count, query time, any truncation warnings) alongside the data.

**3. Use Snowflake Semantic Views for natural language queries.**

Snowflake's semantic layer lets you define business-level metric definitions once, then query them in plain English. If your orchestrator agent needs to answer "what is today's LCR ratio" without knowing the underlying joins, a semantic view query tool is the right abstraction:

```python
def query_semantic_layer(question: str, reporting_date: str) -> dict:
    """
    Query the Snowflake semantic layer using natural language.
    The semantic layer handles metric definitions and joins automatically.
    """
    conn = get_snowflake_connection()
    result = conn.cursor().execute(
        "SELECT SNOWFLAKE.CORTEX.ANALYST(%(question)s, %(context)s)",
        {
            "question": question,
            "context": f"reporting_date={reporting_date}, domain=liquidity_risk"
        }
    ).fetchone()
    return json.loads(result[0])
```

---

## AWS AgentCore for Production Deployment

Local ADK agents are great for development. For production — with real-time regulatory data, SLA requirements, and audit trail needs — you need managed infrastructure. AWS AgentCore Runtime provides exactly this.

### Why AgentCore Over Self-Managed ECS

I already run services on AWS ECS/Fargate at Goldman Sachs. The question for agentic workloads is whether you manage your own container infrastructure or use AgentCore's managed runtime.

AgentCore wins on three dimensions for agentic workloads specifically:

- **Serverless scaling**: Financial metric analysis jobs are bursty — end-of-day is intense, overnight is quiet. AgentCore scales to zero between runs.
- **Built-in observability**: Step-by-step workflow visualization and OpenTelemetry-compatible telemetry, which is non-negotiable for audit trails in finance.
- **MCP Gateway**: Automatically exposes your Snowflake tools as MCP-compatible endpoints, which means your ADK agents can call them without custom HTTP wiring.

### Minimal Deployment Pattern

```python
from bedrock_agentcore import BedrockAgentCoreApp
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService

app = BedrockAgentCoreApp()

@app.entrypoint
def run_metrics_analysis(request: dict) -> dict:
    """
    Entry point for AgentCore Runtime.
    Expects: { "reporting_date": "YYYY-MM-DD", "metrics": ["LCR", "NSFR", "FR2052a"] }
    Returns: structured metric analysis report
    """
    session_service = InMemorySessionService()
    runner = Runner(
        agent=orchestrator,
        app_name="financial-metrics-agent",
        session_service=session_service,
    )

    session = session_service.create_session(
        app_name="financial-metrics-agent",
        user_id="system",
    )

    result = runner.run(
        user_id="system",
        session_id=session.id,
        new_message=Content(
            role="user",
            parts=[Part(text=f"Analyze metrics {request['metrics']} for {request['reporting_date']}")]
        )
    )

    return {"report": result, "status": "completed"}
```

Deploy with a single CLI command:

```bash
agentcore deploy \
  --agent-name financial-metrics-agent \
  --region us-east-1 \
  --memory 2048 \
  --timeout 900
```

### AgentCore Observability for Audit Trails

In regulated environments, every agent decision needs a traceable audit log. AgentCore's observability dashboard gives you:

- Exact tool inputs/outputs per step
- Token usage per agent turn
- Latency breakdown across the pipeline
- Failure classification (tool error vs. model refusal vs. timeout)

This is the difference between an agentic system that compliance will approve and one they won't.

---

## Production Lessons: What Goes Wrong

### 1. Infinite Loop Detection is Not Optional

Two agents in my early prototype were configured to help each other: the metric agent would call the data agent when it lacked data, and the data agent would call the metric agent to understand what was needed. This created a recursive help-seeking loop that burned through tokens exponentially.

Add hard circuit breakers:

```python
MAX_TOOL_CALLS_PER_RUN = 50
MAX_AGENT_TURNS = 20

class CircuitBreakerRunner(Runner):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._tool_call_count = 0
        self._turn_count = 0

    def _on_tool_call(self, tool_name: str, inputs: dict):
        self._tool_call_count += 1
        if self._tool_call_count > MAX_TOOL_CALLS_PER_RUN:
            raise RuntimeError(f"Circuit breaker: exceeded {MAX_TOOL_CALLS_PER_RUN} tool calls")
```

### 2. Shadow Mode Before Live Deployment

Before enabling any automated action (filing a report, triggering an alert, updating a system), run the agent in shadow mode for at least two weeks:

```python
SHADOW_MODE = os.getenv("AGENT_SHADOW_MODE", "true") == "true"

def file_regulatory_report(report_data: dict) -> dict:
    """Submit a regulatory metric report."""
    if SHADOW_MODE:
        logger.info(f"SHADOW MODE — would have filed report: {report_data['report_id']}")
        return {"status": "shadow_logged", "report_id": report_data["report_id"]}

    # actual filing logic
    return submit_to_regulatory_system(report_data)
```

During shadow mode, pipe agent outputs through an LLM-as-judge that compares them to human analyst decisions from the same day. Only promote to production when agreement rate exceeds your threshold (for us, that was 94%).

### 3. Limit Tool Surface Area Per Agent

The ZenML production study found that exposing too many tools causes "choice entropy" — the model spends tokens deciding which tool to call rather than calling one.

Rule of thumb: each specialist agent should have at most 5-7 tools. The orchestrator should have zero data tools — it only calls sub-agents.

### 4. Structured Output Schemas Everywhere

Every agent that produces data another agent consumes should return a validated Pydantic schema, not freeform text. This eliminates an entire class of downstream parsing failures:

```python
from pydantic import BaseModel
from typing import Literal

class MetricResult(BaseModel):
    metric_name: str
    computed_value: float
    threshold: float
    status: Literal["PASS", "WARN", "BREACH"]
    root_cause_hypothesis: str | None = None

class MetricAnalysisOutput(BaseModel):
    reporting_date: str
    results: list[MetricResult]
    total_breach_count: int
    total_warn_count: int
    analysis_timestamp: str
```

ADK's `LlmAgent` accepts an `output_schema` parameter that enforces this at the framework level.

---

## The Stack in One View

| Layer | Technology | Role |
|---|---|---|
| Orchestration | Google ADK (LlmAgent, SequentialAgent, ParallelAgent) | Agent lifecycle, routing, delegation |
| Data | Snowflake + Semantic Views | Position data, metric history, threshold config |
| Models | Gemini 2.0 Flash | Reasoning, SQL planning, narrative generation |
| Tool Layer | Python function tools + ADK FunctionTool | Typed, parameterized Snowflake interfaces |
| Deployment | AWS AgentCore Runtime | Serverless execution, scaling, audit logs |
| Observability | AgentCore Dashboard + OpenTelemetry | Step traces, token usage, failure classification |
| Validation | Pydantic schemas + LLM-as-judge | Output correctness, shadow mode comparison |

---

## What's Next

The current version handles read-only analysis — it retrieves, computes, and reports. The next iteration adds write-back: automatically creating tickets in our incident management system for BREACH events, and pre-filling the narrative sections of regulatory filings.

That requires progressive autonomy: the agent suggests actions, a human approves them, and over time (as confidence scores improve) the human approval gate raises its threshold until routine breaches are handled fully autonomously.

The technical infrastructure is ready. The harder problem, as always, is building the institutional trust that lets you raise that threshold.

If you're building something similar — or if you've found better patterns for agentic financial workflows — I'm always up for a conversation. Links in the footer.
