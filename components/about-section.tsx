import Image from "next/image"
import { Card } from "@/components/ui/card"
import type { MatchFixture } from "@/lib/types"

interface AboutSectionProps {
  matches: MatchFixture[]
}

export default function AboutSection({ matches }: AboutSectionProps) {
  return (
    <section className="relative w-full mb-12">
      {/* Container */}
      {/* FIX 1: Reduced height significantly on mobile (h-[auto] initially, min-h-[500px]), taller on md+ */}
      <div className="relative w-full min-h-[500px] h-auto md:h-[510px] rounded-2xl overflow-hidden">

        {/* Background Image - Always visible now */}
        <Image
            src="/images/team-celebration.jpg"
            alt="ლელო რაგბის კლუბი ფონი"
            fill
            className="object-cover"
            priority
        />

        {/* Dark Overlay - Always visible */}
        <div className="absolute inset-0 bg-black/80" />

        {/* Content Container - Absolute position restored, adjust padding */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 md:p-10 lg:p-12 text-white">

            {/* Title and Intro */}
            {/* Adjusted margins */}
            <div className="w-full max-w-4xl mx-auto text-center mb-6 md:mb-8">
                {/* Responsive title size */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 animate-text-glow">
                    <span>ჩვენს შესახებ</span>
                </h1>
                {/* Responsive paragraph size */}
                <p className="text-sm sm:text-base md:text-xl text-white/90">
                    <span>{'რაგბის კლუბი "ლელო", დაარსებული 1980 წელს თბილისში, წარმოადგენს ერთ-ერთ ყველაზე წარმატებულ და ტრადიციულ კლუბს ქართულ რაგბიში.'}</span>
                </p>
            </div>

            {/* Cards Grid */}
            {/* Stacks vertically on mobile (default), 2 columns on md+ */}
            {/* Adjusted gap and margin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto w-full mt-6 md:mt-8 px-0">
                {/* History Card */}
                {/* Adjusted padding and text size */}
                <Card className="p-4 md:p-6 bg-black/60 backdrop-blur-sm border border-white/20 text-white">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-white">
                        <span>ისტორია</span>
                    </h2>
                    {/* Using text-xs on mobile */}
                    <p className="text-xs sm:text-sm text-white/80">
                        <span>{"1985 წელს ბათუ კევლიშვილის თაოსნობით მესამე მასივში საფუძველი ჩაეყარა რაგბის სპეციალიზებული სკოლის მშენებლობას, რომელიც დასრულდა 1989 წელს. ამავე პერიოდში, სკოლის ბაზაზე ჩამოყალიბდა რაგბის კლუბი ლელო."}</span>
                    </p>
                </Card>
                {/* Infrastructure Card */}
                {/* Adjusted padding and text size */}
                <Card className="p-4 md:p-6 bg-black/60 backdrop-blur-sm border border-white/20 text-white">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-white">
                        <span>ინფრასტრუქტურა და აკადემია</span>
                    </h2>
                    {/* Using text-xs on mobile */}
                    <p className="text-xs sm:text-sm md:text-base text-white/80">
                        <span>{"აკადემიაში 6-დან 18 წლამდე ასაკის დაახლოებით 1000 ახალგაზრდა მორაგბე ვარჯიშობს..."}</span>
                    </p>
                </Card>
            </div>
        </div>
      </div>
    </section>
  )
}