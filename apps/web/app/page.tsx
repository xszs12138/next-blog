import { PageContainer } from "@/lib/ui/PageWigets"
import { HeroCloud, HeroText } from "@/lib/ui/HeroWigets"
// import { DotPatternDemo } from "@/lib/ui/DotBackground"
import { FlickeringGrid } from "@workspace/ui/components/flickering-grid"
export default function Page() {
  return (
    <PageContainer className="absolute">
      <div className="relative z-0 min-h-svh w-full overflow-hidden">
        <HeroCloud />
        {/* <DotPatternDemo /> */}
        <FlickeringGrid
          className="absolute inset-0 z-0 size-full"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          flickerChance={0.1}
        />
        <HeroText />
      </div>
    </PageContainer>
  )
}
