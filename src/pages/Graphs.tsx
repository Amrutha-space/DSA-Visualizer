import Layout from "@/components/layout/Layout";
import VisualizerCard from "@/components/ui/VisualizerCard";
import ControlPanel from "@/components/ui/ControlPanel";
import AlgorithmSelector from "@/components/ui/AlgorithmSelector";
import GraphVisualizerComponent from "@/components/visualizers/GraphVisualizer";
import { useGraphVisualizer, GraphAlgorithm } from "@/hooks/useGraphVisualizer";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const graphAlgorithms = [
  { id: "bfs", name: "BFS", description: "Breadth-First Search" },
  { id: "dfs", name: "DFS", description: "Depth-First Search" },
  { id: "dijkstra", name: "Dijkstra", description: "Shortest Path" },
];

const GraphsPage = () => {
  const {
    nodes,
    edges,
    isPlaying,
    speed,
    algorithm,
    startNode,
    endNode,
    visitedOrder,
    setSpeed,
    setAlgorithm,
    setStartNode,
    setEndNode,
    reset,
    togglePlayPause,
  } = useGraphVisualizer();

  const currentAlgo = graphAlgorithms.find((a) => a.id === algorithm);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Graph Algorithms</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Visualize pathfinding algorithms on weighted graphs.
            Watch how BFS, DFS, and Dijkstra explore nodes to find paths.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <AlgorithmSelector
            algorithms={graphAlgorithms}
            selected={algorithm}
            onSelect={(id) => setAlgorithm(id as GraphAlgorithm)}
            disabled={isPlaying}
          />
        </div>

        <VisualizerCard
          title={currentAlgo?.name || "Graph Algorithm"}
          description={currentAlgo?.description}
          controls={
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Start:</span>
                <Select
                  value={startNode}
                  onValueChange={setStartNode}
                  disabled={isPlaying}
                >
                  <SelectTrigger className="w-20 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {nodes.map((node) => (
                      <SelectItem key={node.id} value={node.id}>
                        {node.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">End:</span>
                <Select
                  value={endNode}
                  onValueChange={setEndNode}
                  disabled={isPlaying}
                >
                  <SelectTrigger className="w-20 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {nodes.map((node) => (
                      <SelectItem key={node.id} value={node.id}>
                        {node.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ControlPanel
                isPlaying={isPlaying}
                speed={speed}
                onPlayPause={togglePlayPause}
                onReset={reset}
                onSpeedChange={setSpeed}
              />
            </div>
          }
        >
          <GraphVisualizerComponent nodes={nodes} edges={edges} />

          {visitedOrder.length > 0 && (
            <div className="mt-6 p-4 bg-muted/50 rounded-xl">
              <p className="text-sm text-muted-foreground mb-2">Visited Order:</p>
              <div className="flex flex-wrap gap-2">
                {visitedOrder.map((nodeId, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="rounded-lg animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {nodeId}
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
              <div className="w-4 h-4 rounded-full bg-algo-active" />
              <span className="text-sm text-muted-foreground">Start Node</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-algo-swap" />
              <span className="text-sm text-muted-foreground">End Node</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-algo-compare" />
              <span className="text-sm text-muted-foreground">Visiting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-algo-visited" />
              <span className="text-sm text-muted-foreground">Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-algo-path" />
              <span className="text-sm text-muted-foreground">Path</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GraphsPage;
