import Image from "next/image"
import { Card } from "@/components/ui/card"

export default function AboutSection() {
  return (
    <section className="relative w-full mb-12">
      {/* Hero Image Container */}
      <div className="relative w-full h-[500px] lg:h-[600px] rounded-lg overflow-hidden mb-8">
        <Image src="/images/team-celebration.jpg" alt="ლელო რაგბის კლუბი" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Hero Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">ჩვენს შესახებ</h1>
          <p className="text-lg md:text-xl text-white max-w-3xl">
            რაგბის კლუბი "ლელო", დაარსებული 1980 წელს თბილისში, წარმოადგენს ერთ-ერთ ყველაზე წარმატებულ და ტრადიციულ
            კლუბს ქართულ რაგბიში.
          </p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto px-4">
        <Card className="p-6 bg-background/80 backdrop-blur-sm border-2">
          <h2 className="text-2xl font-bold mb-4">ისტორია და მიღწევები</h2>
          <p className="text-muted-foreground mb-4">
            ლელო საერთაშორისო რეპუტაციას მოიპოვა საქართველოს ჩემპიონატის ოცჯერ მოგებით და არაერთხელ გახდა თასის მედლები.
          </p>
          <p className="text-muted-foreground">
            კლუბმა გააჩინა ორი სრულად აღჭურვილი სამარჯვენო ბაზა თბილისში, მათ შორის დედის ღიმა რომელიც, რომელშიც 3000
            მაყურებელს იტევს.
          </p>
        </Card>

        <Card className="p-6 bg-background/80 backdrop-blur-sm border-2">
          <h2 className="text-2xl font-bold mb-4">ინფრასტრუქტურა და აკადემია</h2>
          <p className="text-muted-foreground mb-4">
            აკადემიაში 6-დან 18 წლამდე ასაკის დაახლოებით 1000 ახალგაზრდა მორაგბე ვარჯიშობს.
          </p>
          <p className="text-muted-foreground">კლუბის პროფესიონალ და თანამედროვებული ვალხი კვეტიშვილს.</p>
        </Card>
      </div>
    </section>
  )
}
