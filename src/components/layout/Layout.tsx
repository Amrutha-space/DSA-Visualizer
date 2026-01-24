import { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen mesh-gradient relative overflow-hidden">
      {/* Abstract background blobs */}
      <div className="abstract-blob w-96 h-96 bg-primary/20 -top-48 -left-48" />
      <div className="abstract-blob w-80 h-80 bg-secondary/30 top-1/4 -right-40" />
      <div className="abstract-blob w-72 h-72 bg-accent/25 bottom-1/4 -left-36" />
      <div className="abstract-blob w-64 h-64 bg-muted/40 -bottom-32 right-1/4" />
      
      <Navbar />
      
      <main className="relative z-10 pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
