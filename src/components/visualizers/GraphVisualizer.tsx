import { cn } from "@/lib/utils";
import type { GraphNode, GraphEdge } from "@/hooks/useGraphVisualizer";

interface GraphVisualizerProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const getNodeColor = (state: GraphNode["state"]): string => {
  switch (state) {
    case "visiting":
      return "fill-algo-compare stroke-algo-compare";
    case "visited":
      return "fill-algo-visited stroke-algo-visited";
    case "path":
      return "fill-algo-path stroke-algo-path";
    case "start":
      return "fill-algo-active stroke-algo-active";
    case "end":
      return "fill-algo-swap stroke-algo-swap";
    default:
      return "fill-primary stroke-primary";
  }
};

const getEdgeColor = (state: GraphEdge["state"]): string => {
  switch (state) {
    case "exploring":
      return "stroke-algo-compare";
    case "path":
      return "stroke-algo-path";
    default:
      return "stroke-border";
  }
};

const GraphVisualizerComponent = ({ nodes, edges }: GraphVisualizerProps) => {
  const getNodePosition = (id: string) => {
    const node = nodes.find((n) => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width="500"
        height="360"
        viewBox="0 0 500 360"
        className="mx-auto"
        style={{ minWidth: "400px" }}
      >
        {/* Edges */}
        {edges.map((edge, index) => {
          const from = getNodePosition(edge.from);
          const to = getNodePosition(edge.to);
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;

          return (
            <g key={index}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className={cn(
                  "transition-all duration-300",
                  getEdgeColor(edge.state)
                )}
                strokeWidth={edge.state === "path" ? 4 : 2}
              />
              <circle
                cx={midX}
                cy={midY}
                r={12}
                className="fill-card stroke-border"
                strokeWidth={1}
              />
              <text
                x={midX}
                y={midY}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-muted-foreground text-xs font-mono select-none"
              >
                {edge.weight}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            <circle
              r={26}
              className={cn(
                "transition-all duration-300",
                node.state === "visiting" && "animate-pulse",
                getNodeColor(node.state)
              )}
              strokeWidth={3}
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-primary-foreground font-bold text-base select-none"
            >
              {node.id}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default GraphVisualizerComponent;
