import { Link, useLocation } from "react-router-dom";
import { Brain } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="gradient-btn flex h-9 w-9 items-center justify-center rounded-lg">
            <Brain className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            FounderVerse <span className="gradient-text">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {!isHome && (
            <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Home
            </Link>
          )}
          <Link
            to="/simulate"
            className="gradient-btn rounded-lg px-5 py-2 text-sm"
          >
            Run Simulation
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
