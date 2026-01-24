import { cn } from "@/lib/utils";
import type { TreeNode } from "@/hooks/useTreeVisualizer";

interface TreeVisualizerProps {
  tree: TreeNode | null;
}

const getNodeColor = (state: TreeNode["state"]): string => {
  switch (state) {
    case "visiting":
      return "bg-algo-compare border-algo-compare";
    case "visited":
      return "bg-algo-sorted border-algo-sorted";
    case "found":
      return "bg-algo-active border-algo-active";
    case "path":
      return "bg-algo-path border-algo-path";
    default:
      return "bg-primary border-primary";
  }
};

const TreeNodeComponent = ({ node }: { node: TreeNode }) => {
  return (
    <>
      {/* Lines to children */}
      {node.left && (
        <line
          x1={node.x}
          y1={node.y + 20}
          x2={node.left.x}
          y2={node.left.y - 20}
          className="stroke-border"
          strokeWidth={2}
        />
      )}
      {node.right && (
        <line
          x1={node.x}
          y1={node.y + 20}
          x2={node.right.x}
          y2={node.right.y - 20}
          className="stroke-border"
          strokeWidth={2}
        />
      )}

      {/* Node circle */}
      <g transform={`translate(${node.x}, ${node.y})`}>
        <circle
          r={22}
          className={cn(
            "transition-all duration-300",
            node.state === "visiting" && "animate-pulse",
            getNodeColor(node.state).includes("bg-algo-compare") 
              ? "fill-algo-compare stroke-algo-compare" 
              : node.state === "visited"
              ? "fill-algo-sorted stroke-algo-sorted"
              : node.state === "found"
              ? "fill-algo-active stroke-algo-active"
              : "fill-primary stroke-primary"
          )}
          strokeWidth={3}
        />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-primary-foreground font-semibold text-sm select-none"
        >
          {node.value}
        </text>
      </g>

      {/* Render children */}
      {node.left && <TreeNodeComponent node={node.left} />}
      {node.right && <TreeNodeComponent node={node.right} />}
    </>
  );
};

const TreeVisualizer = ({ tree }: TreeVisualizerProps) => {
  if (!tree) {
    return (
      <div className="flex items-center justify-center h-80 text-muted-foreground">
        No tree to display
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width="800"
        height="320"
        viewBox="0 0 800 320"
        className="mx-auto"
        style={{ minWidth: "600px" }}
      >
        <TreeNodeComponent node={tree} />
      </svg>
    </div>
  );
};

export default TreeVisualizer;
