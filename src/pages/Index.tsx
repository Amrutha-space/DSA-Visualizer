import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, GitBranch, Network, Repeat, ArrowRight } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Sorting Algorithms",
    description: "Visualize Bubble, Selection, Insertion, Merge, and Quick Sort with step-by-step animations.",
    path: "/sorting",
    color: "bg-primary",
  },
  {
    icon: GitBranch,
    title: "Tree Traversals",
    description: "Explore In-Order, Pre-Order, Post-Order, and Level-Order traversals on binary trees.",
    path: "/trees",
    color: "bg-secondary",
  },
  {
    icon: Network,
    title: "Graph Algorithms",
    description: "Watch BFS, DFS, and Dijkstra's algorithm find paths through weighted graphs.",
    path: "/graphs",
    color: "bg-accent",
  },
  {
    icon: Repeat,
    title: "Recursion Visualizer",
    description: "See how recursive calls stack and resolve for Fibonacci, Factorial, and Tower of Hanoi.",
    path: "/recursion",
    color: "bg-muted",
  },
];

const Index = () => {
  return (
    <Layout>
      <div className="space-y-12 animate-fade-in">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-algo-sorted animate-pulse" />
            Interactive Learning
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="text-foreground">DSA</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Visualizer
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Master Data Structures and Algorithms through interactive visualizations.
            Watch algorithms come to life with beautiful animations.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/sorting"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl 
                       bg-primary text-primary-foreground font-medium
                       hover-lift hover-glow"
            >
              Start Exploring
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.path}
                to={feature.path}
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="glass-card h-full hover-lift border-0 overflow-hidden
                               group-hover:border-primary/20 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center
                                  group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm font-medium text-primary
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Explore
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </section>

        {/* Stats Section */}
        <section className="glass-card rounded-3xl p-8 md:p-12">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">12+</div>
              <div className="text-muted-foreground">Algorithms</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">4</div>
              <div className="text-muted-foreground">Categories</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">∞</div>
              <div className="text-muted-foreground">Learning Potential</div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-muted-foreground">
          <p>Built with React, TypeScript & Tailwind CSS</p>
          <p className="mt-1">Perfect for students learning DSA concepts</p>
        </footer>
      </div>
    </Layout>
  );
};

export default Index;
