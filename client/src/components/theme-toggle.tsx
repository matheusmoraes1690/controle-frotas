import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative h-10 w-10 rounded-full flex items-center justify-center",
        "transition-all duration-200",
        "hover:bg-muted/80 active:scale-95"
      )}
      data-testid="button-theme-toggle"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-foreground" />
      ) : (
        <Sun className="h-5 w-5 text-foreground" />
      )}
      <span className="sr-only">Alternar tema</span>
    </button>
  );
}
