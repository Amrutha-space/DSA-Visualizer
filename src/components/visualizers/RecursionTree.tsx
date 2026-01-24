import { cn } from "@/lib/utils";
import type { RecursionNode } from "@/hooks/useRecursionVisualizer";

interface RecursionTreeProps {
  nodes: RecursionNode[];
}

const getNodeColor = (state: RecursionNode["state"]): string => {
  switch (state) {
    case "computing":
      return "fill-algo-compare stroke-algo-compare";
    case "computed":
      return "fill-algo-sorted stroke-algo-sorted";
    case "returning":
      return "fill-algo-path stroke-algo-path";
    default:
      return "fill-primary stroke-primary";
  }
};

const RecursionTree = ({ nodes }: RecursionTreeProps) => {
  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Click play to start the visualization
      </div>
    );
  }

  // Calculate SVG bounds
  const minX = Math.min(...nodes.map((n) => n.x)) - 60;
  const maxX = Math.max(...nodes.map((n) => n.x)) + 60;
  const maxY = Math.max(...nodes.map((n) => n.y)) + 50;
  const width = Math.max(maxX - minX, 400);
  const height = Math.max(maxY + 20, 300);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width={width}
        height={height}
        viewBox={`${minX} 0 ${width} ${height}`}
        className="mx-auto"
        style={{ minWidth: "400px" }}
      >
        {/* Edges */}
        {nodes.map((node) =>
          node.children.map((childId) => {
            const child = nodes.find((n) => n.id === childId);
            if (!child) return null;
            return (
              <line
                key={`${node.id}-${childId}`}
                x1={node.x}
                y1={node.y + 20}
                x2={child.x}
                y2={child.y - 20}
                className="stroke-border"
                strokeWidth={2}
              />
            );
          })
        )}

        {/* Nodes */}
        {nodes.map((node) => (
          <g
            key={node.id}
            transform={`translate(${node.x}, ${node.y})`}
            className={cn(
              "transition-all duration-300",
              node.state === "computing" && "animate-pulse"
            )}
          >
            <rect
              x={-45}
              y={-18}
              width={90}
              height={36}
              rx={12}
              className={cn(
                "transition-all duration-300",
                getNodeColor(node.state)
              )}
              strokeWidth={2}
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              y={-4}
              className="fill-primary-foreground font-medium text-xs select-none"
            >
              {node.label}
            </text>
            {node.result !== undefined && (
              <text
                textAnchor="middle"
                dominantBaseline="central"
                y={10}
                className="fill-primary-foreground/80 font-mono text-xs select-none"
              >
                = {node.result}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default RecursionTree;
