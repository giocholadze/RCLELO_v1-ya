import Image from "next/image"
import { Card } from "@/components/ui/card"
// 1. Import the type for the data you are passing in
import type { MatchFixture } from "@/lib/types"

// 2. Define the props for the component
interface AboutSectionProps {
  matches: MatchFixture[]
}

// Use the props in the function signature
export default function AboutSection({ matches }: AboutSectionProps) {
  // NOTE: The component now accepts the 'matches' prop, but doesn't use it yet.
  // This is enough to fix the error. We can add UI for it later if you want.

  return (
    <section className="relative w-full mb-12">
      <div className="relative w-full h-[460px] md:h-[510px] rounded-2xl overflow-hidden">
        
        <Image 
            src="/images/team-celebration.jpg" 
            alt="ლელო რაგბის კლუბი" 
            fill 
            className="object-cover" 
            priority 
        />
        
        <div className="absolute inset-0 bg-black/80" /> 

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-10 lg:p-12">
            
            <div className="w-full max-w-4xl mx-auto text-center mb-8">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-text-glow">
                    <span>ჩვენს შესახებ</span>
                </h1>
                <p className="text-lg md:text-xl text-white/90">
                    <span>{'რაგბის კლუბი "ლელო", დაარსებული 1980 წელს თბილისში, წარმოადგენს ერთ-ერთ ყველაზე წარმატებულ და ტრადიციულ კლუბს ქართულ რაგბიში.'}</span>
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto w-full mt-8 px-4">
                <Card className="p-6 bg-black/60 backdrop-blur-sm border border-white/20 text-white">
                    <h2 className="text-2xl font-bold mb-4 text-white">
                        <span>ისტორია და მიღწევები</span>
                    </h2>
                    <p className="text-white/80">
                        <span>{"ლელო საერთაშორისო რეპუტაციას მოიპოვა საქართველოს ჩემპიონატის ოცჯერ მოგებით და არაერთხელ გახდა თასის მედლები..."}</span>
                    </p>
                </Card>
                <Card className="p-6 bg-black/60 backdrop-blur-sm border border-white/20 text-white">
                    <h2 className="text-2xl font-bold mb-4 text-white">
                        <span>ინფრასტრუქტურა და აკადემია</span>
                    </h2>
                    <p className="text-white/80">
                        <span>{"აკადემიაში 6-დან 18 წლამდე ასაკის დაახლოებით 1000 ახალგაზრდა მორაგბე ვარჯიშობს..."}</span>
                    </p>
                </Card>
            </div>
        </div>
      </div>
    </section>
  )
}