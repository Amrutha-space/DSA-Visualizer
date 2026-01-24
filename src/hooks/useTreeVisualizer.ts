import { useState, useCallback, useRef } from "react";

export type TreeAlgorithm = "inorder" | "preorder" | "postorder" | "levelorder" | "insert" | "search";

export interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x: number;
  y: number;
  state: "default" | "visiting" | "visited" | "found" | "path";
}

const createNode = (value: number, x: number, y: number): TreeNode => ({
  value,
  left: null,
  right: null,
  x,
  y,
  state: "default",
});

const insertNode = (root: TreeNode | null, value: number, x: number, y: number, spread: number): TreeNode => {
  if (!root) {
    return createNode(value, x, y);
  }

  if (value < root.value) {
    root.left = insertNode(root.left, value, x - spread, y + 60, spread * 0.6);
  } else {
    root.right = insertNode(root.right, value, x + spread, y + 60, spread * 0.6);
  }

  return root;
};

const buildDefaultTree = (): TreeNode => {
  const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45, 55, 65, 75, 90];
  let root: TreeNode | null = null;
  const startX = 400;
  const startY = 40;
  const spread = 160;

  for (const value of values) {
    root = insertNode(root, value, startX, startY, spread);
  }

  return root!;
};

export const useTreeVisualizer = () => {
  const [tree, setTree] = useState<TreeNode | null>(() => buildDefaultTree());
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState<TreeAlgorithm>("inorder");
  const [visitedOrder, setVisitedOrder] = useState<number[]>([]);
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

  const cloneTree = (node: TreeNode | null): TreeNode | null => {
    if (!node) return null;
    return {
      ...node,
      left: cloneTree(node.left),
      right: cloneTree(node.right),
    };
  };

  const resetTreeStates = useCallback(() => {
    const resetNode = (node: TreeNode | null): TreeNode | null => {
      if (!node) return null;
      return {
        ...node,
        state: "default",
        left: resetNode(node.left),
        right: resetNode(node.right),
      };
    };
    setTree((prev) => resetNode(prev));
    setVisitedOrder([]);
  }, []);

  const reset = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    isSortingRef.current = false;
    setIsPlaying(false);
    resetTreeStates();
  }, [resetTreeStates]);

  const regenerateTree = useCallback(() => {
    if (isSortingRef.current) return;
    setTree(buildDefaultTree());
    setVisitedOrder([]);
  }, []);

  const updateNodeState = (
    node: TreeNode | null,
    targetValue: number,
    newState: TreeNode["state"]
  ): TreeNode | null => {
    if (!node) return null;
    if (node.value === targetValue) {
      return { ...node, state: newState, left: node.left, right: node.right };
    }
    return {
      ...node,
      left: updateNodeState(node.left, targetValue, newState),
      right: updateNodeState(node.right, targetValue, newState),
    };
  };

  const inorderTraversal = useCallback(async () => {
    const order: number[] = [];
    
    const traverse = async (node: TreeNode | null) => {
      if (!node || !isSortingRef.current) return;

      await traverse(node.left);
      
      if (!isSortingRef.current) return;
      
      setTree((prev) => updateNodeState(prev, node.value, "visiting"));
      await delay(getDelay());
      
      order.push(node.value);
      setVisitedOrder([...order]);
      
      setTree((prev) => updateNodeState(prev, node.value, "visited"));
      await delay(getDelay() / 2);

      await traverse(node.right);
    };

    await traverse(tree);
  }, [tree, delay, getDelay]);

  const preorderTraversal = useCallback(async () => {
    const order: number[] = [];
    
    const traverse = async (node: TreeNode | null) => {
      if (!node || !isSortingRef.current) return;

      setTree((prev) => updateNodeState(prev, node.value, "visiting"));
      await delay(getDelay());
      
      order.push(node.value);
      setVisitedOrder([...order]);
      
      setTree((prev) => updateNodeState(prev, node.value, "visited"));
      await delay(getDelay() / 2);

      await traverse(node.left);
      await traverse(node.right);
    };

    await traverse(tree);
  }, [tree, delay, getDelay]);

  const postorderTraversal = useCallback(async () => {
    const order: number[] = [];
    
    const traverse = async (node: TreeNode | null) => {
      if (!node || !isSortingRef.current) return;

      await traverse(node.left);
      await traverse(node.right);
      
      if (!isSortingRef.current) return;

      setTree((prev) => updateNodeState(prev, node.value, "visiting"));
      await delay(getDelay());
      
      order.push(node.value);
      setVisitedOrder([...order]);
      
      setTree((prev) => updateNodeState(prev, node.value, "visited"));
      await delay(getDelay() / 2);
    };

    await traverse(tree);
  }, [tree, delay, getDelay]);

  const levelOrderTraversal = useCallback(async () => {
    if (!tree) return;
    
    const order: number[] = [];
    const queue: TreeNode[] = [tree];

    while (queue.length > 0 && isSortingRef.current) {
      const node = queue.shift()!;

      setTree((prev) => updateNodeState(prev, node.value, "visiting"));
      await delay(getDelay());

      order.push(node.value);
      setVisitedOrder([...order]);

      setTree((prev) => updateNodeState(prev, node.value, "visited"));
      await delay(getDelay() / 2);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }, [tree, delay, getDelay]);

  const startVisualization = useCallback(async () => {
    if (isSortingRef.current) return;
    
    isSortingRef.current = true;
    setIsPlaying(true);
    resetTreeStates();
    await delay(100);

    switch (algorithm) {
      case "inorder":
        await inorderTraversal();
        break;
      case "preorder":
        await preorderTraversal();
        break;
      case "postorder":
        await postorderTraversal();
        break;
      case "levelorder":
        await levelOrderTraversal();
        break;
    }

    isSortingRef.current = false;
    setIsPlaying(false);
  }, [algorithm, inorderTraversal, preorderTraversal, postorderTraversal, levelOrderTraversal, delay, resetTreeStates]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      reset();
    } else {
      startVisualization();
    }
  }, [isPlaying, reset, startVisualization]);

  return {
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
  };
};
