import { FlickeringGrid } from "@workspace/ui/components/flickering-grid"


export function FlickerBackground() {
  return (
    <div className="bg-background relative z-0 min-h-svh w-full overflow-hidden rounded-lg border">
      <FlickeringGrid
        className="absolute inset-0 z-0 size-full"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        flickerChance={0.1}
      />
    </div>
  )
}
