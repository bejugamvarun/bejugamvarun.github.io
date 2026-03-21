import { createContext, useContext, ReactNode } from 'react';

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => (
  <ThemeContext.Provider value={{ theme: 'dark', toggleTheme: () => {} }}>
    {children}
  </ThemeContext.Provider>
);

export const useTheme = (): ThemeContextType => useContext(ThemeContext);
