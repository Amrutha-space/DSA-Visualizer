import { useState, useCallback, useRef } from "react";

export type RecursionAlgorithm = "fibonacci" | "factorial" | "hanoi";

export interface RecursionNode {
  id: string;
  label: string;
  result?: number;
  x: number;
  y: number;
  state: "default" | "computing" | "computed" | "returning";
  children: string[];
  parentId: string | null;
}

export const useRecursionVisualizer = () => {
  const [nodes, setNodes] = useState<RecursionNode[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState<RecursionAlgorithm>("fibonacci");
  const [inputValue, setInputValue] = useState(5);
  const [callStack, setCallStack] = useState<string[]>([]);
  const animationRef = useRef<number | null>(null);
  const isSortingRef = useRef(false);
  const nodeIdCounter = useRef(0);

  const delay = useCallback((ms: number) => {
    return new Promise<void>((resolve) => {
      animationRef.current = window.setTimeout(resolve, ms);
    });
  }, []);

  const getDelay = useCallback(() => {
    return Math.max(100, 800 - speed * 7);
  }, [speed]);

  const reset = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    isSortingRef.current = false;
    setIsPlaying(false);
    setNodes([]);
    setCallStack([]);
    nodeIdCounter.current = 0;
  }, []);

  const addNode = (label: string, x: number, y: number, parentId: string | null): string => {
    const id = `node-${nodeIdCounter.current++}`;
    const newNode: RecursionNode = {
      id,
      label,
      x,
      y,
      state: "default",
      children: [],
      parentId,
    };
    
    setNodes((prev) => {
      const updated = [...prev, newNode];
      if (parentId) {
        return updated.map((n) =>
          n.id === parentId ? { ...n, children: [...n.children, id] } : n
        );
      }
      return updated;
    });
    
    return id;
  };

  const updateNodeState = (nodeId: string, state: RecursionNode["state"], result?: number) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId ? { ...n, state, result: result ?? n.result } : n
      )
    );
  };

  const fibonacciVisualization = useCallback(async () => {
    const memo: Map<number, number> = new Map();
    let xOffset = 0;

    const fib = async (n: number, x: number, y: number, parentId: string | null): Promise<number> => {
      if (!isSortingRef.current) return 0;

      const nodeId = addNode(`fib(${n})`, x, y, parentId);
      setCallStack((prev) => [...prev, `fib(${n})`]);
      updateNodeState(nodeId, "computing");
      await delay(getDelay());

      if (n <= 1) {
        updateNodeState(nodeId, "computed", n);
        setCallStack((prev) => prev.slice(0, -1));
        await delay(getDelay() / 2);
        return n;
      }

      if (memo.has(n)) {
        const result = memo.get(n)!;
        updateNodeState(nodeId, "computed", result);
        setCallStack((prev) => prev.slice(0, -1));
        await delay(getDelay() / 2);
        return result;
      }

      const leftX = x - 60 / (y / 60);
      const rightX = x + 60 / (y / 60);

      const left = await fib(n - 1, leftX, y + 70, nodeId);
      if (!isSortingRef.current) return 0;
      
      const right = await fib(n - 2, rightX, y + 70, nodeId);
      if (!isSortingRef.current) return 0;

      const result = left + right;
      memo.set(n, result);

      updateNodeState(nodeId, "computed", result);
      setCallStack((prev) => prev.slice(0, -1));
      await delay(getDelay() / 2);

      return result;
    };

    const n = Math.min(inputValue, 7); // Limit for visualization
    await fib(n, 400, 40, null);
  }, [inputValue, delay, getDelay]);

  const factorialVisualization = useCallback(async () => {
    const fact = async (n: number, x: number, y: number, parentId: string | null): Promise<number> => {
      if (!isSortingRef.current) return 1;

      const nodeId = addNode(`${n}!`, x, y, parentId);
      setCallStack((prev) => [...prev, `factorial(${n})`]);
      updateNodeState(nodeId, "computing");
      await delay(getDelay());

      if (n <= 1) {
        updateNodeState(nodeId, "computed", 1);
        setCallStack((prev) => prev.slice(0, -1));
        await delay(getDelay() / 2);
        return 1;
      }

      const subResult = await fact(n - 1, x, y + 80, nodeId);
      if (!isSortingRef.current) return 1;

      const result = n * subResult;
      updateNodeState(nodeId, "computed", result);
      setCallStack((prev) => prev.slice(0, -1));
      await delay(getDelay() / 2);

      return result;
    };

    const n = Math.min(inputValue, 8);
    await fact(n, 400, 40, null);
  }, [inputValue, delay, getDelay]);

  const hanoiVisualization = useCallback(async () => {
    let moveCount = 0;

    const hanoi = async (
      n: number,
      from: string,
      to: string,
      aux: string,
      x: number,
      y: number,
      parentId: string | null
    ): Promise<void> => {
      if (!isSortingRef.current) return;

      const nodeId = addNode(`H(${n}, ${from}→${to})`, x, y, parentId);
      setCallStack((prev) => [...prev, `hanoi(${n}, ${from}, ${to})`]);
      updateNodeState(nodeId, "computing");
      await delay(getDelay());

      if (n === 1) {
        moveCount++;
        updateNodeState(nodeId, "computed", moveCount);
        setCallStack((prev) => prev.slice(0, -1));
        await delay(getDelay() / 2);
        return;
      }

      const spread = 100 / (y / 50 + 1);

      await hanoi(n - 1, from, aux, to, x - spread, y + 70, nodeId);
      if (!isSortingRef.current) return;

      moveCount++;
      
      await hanoi(n - 1, aux, to, from, x + spread, y + 70, nodeId);
      if (!isSortingRef.current) return;

      updateNodeState(nodeId, "computed", moveCount);
      setCallStack((prev) => prev.slice(0, -1));
      await delay(getDelay() / 2);
    };

    const n = Math.min(inputValue, 4);
    await hanoi(n, "A", "C", "B", 400, 40, null);
  }, [inputValue, delay, getDelay]);

  const startVisualization = useCallback(async () => {
    if (isSortingRef.current) return;
    
    isSortingRef.current = true;
    setIsPlaying(true);
    setNodes([]);
    setCallStack([]);
    nodeIdCounter.current = 0;
    await delay(100);

    switch (algorithm) {
      case "fibonacci":
        await fibonacciVisualization();
        break;
      case "factorial":
        await factorialVisualization();
        break;
      case "hanoi":
        await hanoiVisualization();
        break;
    }

    isSortingRef.current = false;
    setIsPlaying(false);
  }, [algorithm, fibonacciVisualization, factorialVisualization, hanoiVisualization, delay]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      reset();
    } else {
      startVisualization();
    }
  }, [isPlaying, reset, startVisualization]);

  return {
    nodes,
    isPlaying,
    speed,
    algorithm,
    inputValue,
    callStack,
    setSpeed,
    setAlgorithm,
    setInputValue,
    reset,
    togglePlayPause,
  };
};
