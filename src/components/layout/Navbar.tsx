import { Link, useLocation } from "react-router-dom";
import { BarChart3, GitBranch, Network, Repeat, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/sorting", label: "Sorting", icon: BarChart3 },
  { path: "/trees", label: "Trees", icon: GitBranch },
  { path: "/graphs", label: "Graphs", icon: Network },
  { path: "/recursion", label: "Recursion", icon: Repeat },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card rounded-2xl px-6 py-3 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center
                          group-hover:scale-110 transition-transform duration-300">
              <span className="text-primary-foreground font-bold text-lg">DS</span>
            </div>
            <span className="font-semibold text-lg hidden sm:block">DSA Visualizer</span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm",
                    "transition-all duration-300 ease-out",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:block">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
