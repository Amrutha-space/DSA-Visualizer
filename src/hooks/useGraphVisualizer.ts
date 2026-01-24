import { useState, useCallback, useRef } from "react";

export type GraphAlgorithm = "bfs" | "dfs" | "dijkstra";

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  state: "default" | "visiting" | "visited" | "path" | "start" | "end";
}

export interface GraphEdge {
  from: string;
  to: string;
  weight: number;
  state: "default" | "exploring" | "path";
}

const createDefaultGraph = (): { nodes: GraphNode[]; edges: GraphEdge[] } => {
  const nodes: GraphNode[] = [
    { id: "A", x: 100, y: 80, state: "default" },
    { id: "B", x: 250, y: 50, state: "default" },
    { id: "C", x: 400, y: 80, state: "default" },
    { id: "D", x: 100, y: 200, state: "default" },
    { id: "E", x: 250, y: 170, state: "default" },
    { id: "F", x: 400, y: 200, state: "default" },
    { id: "G", x: 175, y: 300, state: "default" },
    { id: "H", x: 325, y: 300, state: "default" },
  ];

  const edges: GraphEdge[] = [
    { from: "A", to: "B", weight: 4, state: "default" },
    { from: "A", to: "D", weight: 2, state: "default" },
    { from: "B", to: "C", weight: 3, state: "default" },
    { from: "B", to: "E", weight: 1, state: "default" },
    { from: "C", to: "F", weight: 5, state: "default" },
    { from: "D", to: "E", weight: 3, state: "default" },
    { from: "D", to: "G", weight: 6, state: "default" },
    { from: "E", to: "F", weight: 2, state: "default" },
    { from: "E", to: "H", weight: 4, state: "default" },
    { from: "F", to: "H", weight: 1, state: "default" },
    { from: "G", to: "H", weight: 2, state: "default" },
  ];

  return { nodes, edges };
};

export const useGraphVisualizer = () => {
  const defaultGraph = createDefaultGraph();
  const [nodes, setNodes] = useState<GraphNode[]>(defaultGraph.nodes);
  const [edges, setEdges] = useState<GraphEdge[]>(defaultGraph.edges);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState<GraphAlgorithm>("bfs");
  const [startNode, setStartNode] = useState("A");
  const [endNode, setEndNode] = useState("H");
  const [visitedOrder, setVisitedOrder] = useState<string[]>([]);
  const animationRef = useRef<number | null>(null);
  const isSortingRef = useRef(false);

  const delay = useCallback((ms: number) => {
    return new Promise<void>((resolve) => {
      animationRef.current = window.setTimeout(resolve, ms);
    });
  }, []);

  const getDelay = useCallback(() => {
    return Math.max(100, 1000 - speed * 9);
  }, [speed]);

  const getAdjacencyList = useCallback((): Map<string, { node: string; weight: number }[]> => {
    const adj = new Map<string, { node: string; weight: number }[]>();
    
    nodes.forEach((node) => {
      adj.set(node.id, []);
    });

    edges.forEach((edge) => {
      adj.get(edge.from)?.push({ node: edge.to, weight: edge.weight });
      adj.get(edge.to)?.push({ node: edge.from, weight: edge.weight });
    });

    return adj;
  }, [nodes, edges]);

  const resetStates = useCallback(() => {
    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        state: node.id === startNode ? "start" : node.id === endNode ? "end" : "default",
      }))
    );
    setEdges((prev) => prev.map((edge) => ({ ...edge, state: "default" })));
    setVisitedOrder([]);
  }, [startNode, endNode]);

  const reset = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    isSortingRef.current = false;
    setIsPlaying(false);
    resetStates();
  }, [resetStates]);

  const updateNodeState = (nodeId: string, state: GraphNode["state"]) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === nodeId ? { ...node, state } : node))
    );
  };

  const updateEdgeState = (from: string, to: string, state: GraphEdge["state"]) => {
    setEdges((prev) =>
      prev.map((edge) =>
        (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from)
          ? { ...edge, state }
          : edge
      )
    );
  };

  const bfs = useCallback(async () => {
    const adj = getAdjacencyList();
    const visited = new Set<string>();
    const queue: string[] = [startNode];
    const parent = new Map<string, string>();
    const order: string[] = [];

    visited.add(startNode);
    updateNodeState(startNode, "visiting");

    while (queue.length > 0 && isSortingRef.current) {
      const current = queue.shift()!;
      
      order.push(current);
      setVisitedOrder([...order]);
      
      updateNodeState(current, "visited");
      await delay(getDelay());

      if (current === endNode) break;

      const neighbors = adj.get(current) || [];
      for (const { node: neighbor } of neighbors) {
        if (!visited.has(neighbor) && isSortingRef.current) {
          visited.add(neighbor);
          parent.set(neighbor, current);
          queue.push(neighbor);
          
          updateEdgeState(current, neighbor, "exploring");
          updateNodeState(neighbor, "visiting");
          await delay(getDelay() / 2);
        }
      }
    }

    // Highlight path
    if (parent.has(endNode) && isSortingRef.current) {
      let current = endNode;
      while (current !== startNode) {
        const prev = parent.get(current)!;
        updateEdgeState(prev, current, "path");
        updateNodeState(current, "path");
        current = prev;
        await delay(getDelay() / 2);
      }
      updateNodeState(startNode, "path");
    }
  }, [getAdjacencyList, startNode, endNode, delay, getDelay]);

  const dfs = useCallback(async () => {
    const adj = getAdjacencyList();
    const visited = new Set<string>();
    const parent = new Map<string, string>();
    const order: string[] = [];
    let found = false;

    const dfsRecursive = async (node: string) => {
      if (!isSortingRef.current || found) return;
      
      visited.add(node);
      order.push(node);
      setVisitedOrder([...order]);
      
      updateNodeState(node, "visiting");
      await delay(getDelay());

      if (node === endNode) {
        found = true;
        return;
      }

      updateNodeState(node, "visited");

      const neighbors = adj.get(node) || [];
      for (const { node: neighbor } of neighbors) {
        if (!visited.has(neighbor) && !found && isSortingRef.current) {
          parent.set(neighbor, node);
          updateEdgeState(node, neighbor, "exploring");
          await dfsRecursive(neighbor);
        }
      }
    };

    await dfsRecursive(startNode);

    // Highlight path
    if (found && isSortingRef.current) {
      let current = endNode;
      while (current !== startNode) {
        const prev = parent.get(current)!;
        updateEdgeState(prev, current, "path");
        updateNodeState(current, "path");
        current = prev;
        await delay(getDelay() / 2);
      }
      updateNodeState(startNode, "path");
    }
  }, [getAdjacencyList, startNode, endNode, delay, getDelay]);

  const dijkstra = useCallback(async () => {
    const adj = getAdjacencyList();
    const distances = new Map<string, number>();
    const parent = new Map<string, string>();
    const visited = new Set<string>();
    const order: string[] = [];

    nodes.forEach((node) => {
      distances.set(node.id, Infinity);
    });
    distances.set(startNode, 0);

    while (isSortingRef.current) {
      let minDist = Infinity;
      let minNode: string | null = null;

      for (const [node, dist] of distances) {
        if (!visited.has(node) && dist < minDist) {
          minDist = dist;
          minNode = node;
        }
      }

      if (minNode === null || minNode === endNode) break;

      visited.add(minNode);
      order.push(minNode);
      setVisitedOrder([...order]);
      
      updateNodeState(minNode, "visited");
      await delay(getDelay());

      const neighbors = adj.get(minNode) || [];
      for (const { node: neighbor, weight } of neighbors) {
        if (!visited.has(neighbor) && isSortingRef.current) {
          const newDist = distances.get(minNode)! + weight;
          if (newDist < distances.get(neighbor)!) {
            distances.set(neighbor, newDist);
            parent.set(neighbor, minNode);
            updateEdgeState(minNode, neighbor, "exploring");
            updateNodeState(neighbor, "visiting");
            await delay(getDelay() / 2);
          }
        }
      }
    }

    // Highlight path
    if (parent.has(endNode) && isSortingRef.current) {
      order.push(endNode);
      setVisitedOrder([...order]);
      
      let current = endNode;
      while (current !== startNode) {
        const prev = parent.get(current)!;
        updateEdgeState(prev, current, "path");
        updateNodeState(current, "path");
        current = prev;
        await delay(getDelay() / 2);
      }
      updateNodeState(startNode, "path");
    }
  }, [nodes, getAdjacencyList, startNode, endNode, delay, getDelay]);

  const startVisualization = useCallback(async () => {
    if (isSortingRef.current) return;
    
    isSortingRef.current = true;
    setIsPlaying(true);
    resetStates();
    await delay(100);

    switch (algorithm) {
      case "bfs":
        await bfs();
        break;
      case "dfs":
        await dfs();
        break;
      case "dijkstra":
        await dijkstra();
        break;
    }

    isSortingRef.current = false;
    setIsPlaying(false);
  }, [algorithm, bfs, dfs, dijkstra, delay, resetStates]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      reset();
    } else {
      startVisualization();
    }
  }, [isPlaying, reset, startVisualization]);

  return {
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
  };
};
