import Layout from "@/components/layout/Layout";
import VisualizerCard from "@/components/ui/VisualizerCard";
import ControlPanel from "@/components/ui/ControlPanel";
import AlgorithmSelector from "@/components/ui/AlgorithmSelector";
import RecursionTree from "@/components/visualizers/RecursionTree";
import { useRecursionVisualizer, RecursionAlgorithm } from "@/hooks/useRecursionVisualizer";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const recursionAlgorithms = [
  { id: "fibonacci", name: "Fibonacci", description: "fib(n) = fib(n-1) + fib(n-2)" },
  { id: "factorial", name: "Factorial", description: "n! = n × (n-1)!" },
  { id: "hanoi", name: "Tower of Hanoi", description: "Move n disks between pegs" },
];

const RecursionPage = () => {
  const {
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
  } = useRecursionVisualizer();

  const currentAlgo = recursionAlgorithms.find((a) => a.id === algorithm);

  const maxInput = algorithm === "hanoi" ? 4 : algorithm === "fibonacci" ? 7 : 8;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Recursion Visualizer</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch recursive algorithms unfold step by step.
            See how function calls stack and resolve.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <AlgorithmSelector
            algorithms={recursionAlgorithms}
            selected={algorithm}
            onSelect={(id) => {
              setAlgorithm(id as RecursionAlgorithm);
              reset();
            }}
            disabled={isPlaying}
          />
        </div>

        <VisualizerCard
          title={currentAlgo?.name || "Recursion"}
          description={currentAlgo?.description}
          controls={
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">n =</span>
                <Input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(Math.max(1, Math.min(maxInput, parseInt(e.target.value) || 1)))}
                  disabled={isPlaying}
                  className="w-16 rounded-xl"
                  min={1}
                  max={maxInput}
                />
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
          <RecursionTree nodes={nodes} />
        </VisualizerCard>

        {callStack.length > 0 && (
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-semibold mb-3">Call Stack</h3>
            <div className="flex flex-col-reverse gap-2 max-h-40 overflow-y-auto">
              {callStack.map((call, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={cn(
                    "rounded-lg font-mono text-sm justify-start",
                    index === callStack.length - 1 && "bg-algo-compare text-foreground"
                  )}
                >
                  {call}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold mb-3">Color Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary" />
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-algo-compare" />
              <span className="text-sm text-muted-foreground">Computing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-algo-sorted" />
              <span className="text-sm text-muted-foreground">Computed</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecursionPage;
