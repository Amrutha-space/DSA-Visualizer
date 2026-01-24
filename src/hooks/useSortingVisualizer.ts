// TODO (Phase 2.2): Integrate Step Debugger (sortingSteps.ts) with UI controls (Next/Prev)
// Current engine: async animation with delay

import { bubbleSortSteps, Step } from "@/lib/sortingSteps";
import { useState, useEffect, useCallback, useRef } from "react";

export type SortingAlgorithm = "bubble" | "selection" | "insertion" | "merge" | "quick";

export interface ArrayBar {
  value: number;
  state: "default" | "comparing" | "swapping" | "sorted" | "pivot";
  pointer?: "i" | "j" | "pivot";
}

const generateRandomArray = (size: number): ArrayBar[] => {
  return Array.from({ length: size }, () => ({
    value: Math.floor(Math.random() * 100) + 5,
    state: "default" as const,
  }));
};

export const useSortingVisualizer = (initialSize: number = 30) => {
  const [array, setArray] = useState<ArrayBar[]>(() => generateRandomArray(initialSize));
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>("bubble");
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const animationRef = useRef<number | null>(null);

  const getDelay = useCallback(() => {
    return Math.max(5, 505 - speed * 5);
  }, [speed]);

  const shuffle = useCallback(() => {
    if (isPlaying) return;
    setArray(generateRandomArray(array.length));
    setComparisons(0);
    setSwaps(0);
  }, [array.length, isPlaying]);

  const reset = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setIsPlaying(false);
    setSteps([]);
    setCurrentStep(0);
    setArray((prev) => prev.map((bar) => ({ ...bar, state: "default", pointer: undefined })));
    setComparisons(0);
    setSwaps(0);
  }, []);

  const applyStep = useCallback((step: Step) => {
    setArray((prev) => {
      const newArr = prev.map((b) => ({
        ...b,
        state: "default",
        pointer: undefined,
      }));

      if (step.type === "compare") {
        newArr[step.i].state = "comparing";
        newArr[step.j].state = "comparing";
        newArr[step.i].pointer = "i";
        newArr[step.j].pointer = "j";
        setComparisons((c) => c + 1);
      }

      if (step.type === "swap") {
        newArr[step.i].state = "swapping";
        newArr[step.j].state = "swapping";
        [newArr[step.i], newArr[step.j]] = [newArr[step.j], newArr[step.i]];
        setSwaps((s) => s + 1);
      }

      if (step.type === "sorted") {
        newArr[step.index].state = "sorted";
      }

      if (step.type === "pivot") {
        newArr[step.index].state = "pivot";
        newArr[step.index].pointer = "pivot";
      }

      return newArr;
    });
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length) {
      applyStep(steps[currentStep]);
      setCurrentStep(s => s + 1);
    }
  }, [currentStep, steps, applyStep]);
  
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    }
  }, [currentStep]);
  

  const startSorting = useCallback(() => {
    const values = array.map((b) => b.value);
    let generatedSteps: Step[] = [];

    switch (algorithm) {
      case "bubble":
        generatedSteps = bubbleSortSteps(values);
        break;
      // later: selectionSortSteps, insertionSortSteps, quickSortSteps, mergeSortSteps
    }
    
    setComparisons(0);
    setSwaps(0);
    setSteps(generatedSteps);
    setCurrentStep(0);
    setIsPlaying(true);
  }, [array, algorithm]);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= steps.length) {
      setIsPlaying(false);
      return;
    }

    const timer = window.setTimeout(() => {
      applyStep(steps[currentStep]);
      setCurrentStep((s) => s + 1);
    }, getDelay());

    animationRef.current = timer;

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps, applyStep, getDelay]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      reset();
    } else {
      startSorting();
    }
  }, [isPlaying, reset, startSorting]);

  return {
    array,
    isPlaying,
    speed,
    algorithm,
    comparisons,
    swaps,
    setSpeed,
    setAlgorithm,
    shuffle,
    reset,
    togglePlayPause,
    nextStep,
    prevStep,
  };
};
