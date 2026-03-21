---
title: "Why I'm Betting on LangChain for Production AI"
date: "2025-03-10"
excerpt: "After building a financial AI agent at Goldman Sachs, here's what I've learned about LangChain in production — the good, the bad, and the unexpected."
tags: ["LangChain", "LLMs", "Python", "Production AI"]
---

## The Honest Take

When I started building the Smart Financial Advisor, I was skeptical of LangChain. The internet is full of "LangChain is overcomplicated" takes. After six months of building with it in a production environment at Goldman Sachs, I have a more nuanced view.

**The short version:** LangChain is worth it if you know what you're signing up for.

## What Actually Works Well

### Agent orchestration at scale

The `AgentExecutor` abstraction saved me weeks. When you're building a system that needs to decide whether to fetch live market data, query a vector store, or run a financial calculation — having a framework that handles that routing logic is genuinely valuable.

```python
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain.tools import tool

@tool
def get_market_data(ticker: str) -> str:
    """Fetch real-time market data for a given ticker symbol."""
    return fetch_from_api(ticker)

agent = create_openai_tools_agent(llm, [get_market_data], prompt)
executor = AgentExecutor(agent=agent, tools=[get_market_data])
```

This is clean. It's readable. It works.

### Memory and context management

LCEL (LangChain Expression Language) with `ConversationBufferWindowMemory` handles the stateful conversation problem elegantly. For financial advisory, where context matters — knowing a user asked about NVIDIA three messages ago — this was critical.

## What Doesn't Work Well

### Debugging is painful

When a chain fails, the error messages are often cryptic. You need to add verbose logging to every chain just to understand what's happening. This is a real cost in production.

### Version instability

I've hit breaking changes between minor versions more than once. For anything serious, pin your LangChain version and be deliberate about upgrades.

## The Conclusion

LangChain is a power tool. It makes complex things possible quickly, but it adds abstraction cost. If you're building a simple LLM app, you might not need it. If you're building something with multiple tools, memory, and retrieval — it earns its keep.

The framework has matured significantly. For AI in finance, where you're integrating data from multiple sources and need reliable agent behavior, it's currently the best option I've found.

---

*Building something with LangChain? I'd love to hear what you're working on — reach out on [LinkedIn](https://linkedin.com/in/bejugamvarun).*
