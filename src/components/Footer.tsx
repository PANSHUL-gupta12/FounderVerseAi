import { Brain } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card/50 py-12">
    <div className="container mx-auto px-6">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <span className="font-display text-sm font-semibold text-foreground">
            FounderVerse AI
          </span>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <span>About</span>
          <span>Privacy Policy</span>
          <span>Contact</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Powered by AI & n8n · © 2026
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
