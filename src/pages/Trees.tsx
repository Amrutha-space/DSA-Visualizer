import Layout from "@/components/layout/Layout";
import VisualizerCard from "@/components/ui/VisualizerCard";
import ControlPanel from "@/components/ui/ControlPanel";
import AlgorithmSelector from "@/components/ui/AlgorithmSelector";
import TreeVisualizer from "@/components/visualizers/TreeVisualizer";
import { useTreeVisualizer, TreeAlgorithm } from "@/hooks/useTreeVisualizer";
import { Badge } from "@/components/ui/badge";

const treeAlgorithms = [
  { id: "inorder", name: "In-Order", description: "Left → Root → Right" },
  { id: "preorder", name: "Pre-Order", description: "Root → Left → Right" },
  { id: "postorder", name: "Post-Order", description: "Left → Right → Root" },
  { id: "levelorder", name: "Level-Order", description: "BFS traversal" },
];

const TreesPage = () => {
  const {
    tree,
    isPlaying,
    speed,
    algorithm,
    visitedOrder,
    setSpeed,
    setAlgorithm,
    reset,
    regenerateTree,
    togglePlayPause,
  } = useTreeVisualizer();

  const currentAlgo = treeAlgorithms.find((a) => a.id === algorithm);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Binary Tree Traversals</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore different ways to traverse a binary search tree.
            Watch the algorithms visit each node in their unique order.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <AlgorithmSelector
            algorithms={treeAlgorithms}
            selected={algorithm}
            onSelect={(id) => setAlgorithm(id as TreeAlgorithm)}
            disabled={isPlaying}
          />
        </div>

        <VisualizerCard
          title={currentAlgo?.name || "Tree Traversal"}
          description={currentAlgo?.description}
          controls={
            <ControlPanel
              isPlaying={isPlaying}
              speed={speed}
              onPlayPause={togglePlayPause}
              onReset={reset}
              onShuffle={regenerateTree}
              onSpeedChange={setSpeed}
            />
          }
        >
          <TreeVisualizer tree={tree} />

          {visitedOrder.length > 0 && (
            <div className="mt-6 p-4 bg-muted/50 rounded-xl">
              <p className="text-sm text-muted-foreground mb-2">Visited Order:</p>
              <div className="flex flex-wrap gap-2">
                {visitedOrder.map((value, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="rounded-lg animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {value}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </VisualizerCard>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold mb-3">Color Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Unvisited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-algo-compare" />
              <span className="text-sm text-muted-foreground">Visiting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-algo-sorted" />
              <span className="text-sm text-muted-foreground">Visited</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TreesPage;
