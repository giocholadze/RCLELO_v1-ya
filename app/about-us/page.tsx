"use client" // Added "use client" directive to resolve potential import issues

import Image from "next/image"
// Lucide icons for visual elements
import { Trophy, MapPin, Target, Users, BarChart, Flag } from "lucide-react"
import type { MatchFixture } from "@/lib/types"

interface AboutSectionProps {
  matches: MatchFixture[] // Prop is included but not used in this design
}

export default function AboutSection({ matches }: AboutSectionProps) {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12">

      {/* Main Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-10 text-center border-b pb-4">
        <span className="text-red-500">კლუბის შესახებ</span>
      </h1>

      {/* Intro Text */}
      <p className="text-base sm:text-lg text-muted-foreground mb-8 md:mb-12 text-center">
        რაგბის კლუბი "ლელო" თბილისში დაარსდა და წარმოადგენს ერთ-ერთ ყველაზე წარმატებულ და ტრადიციულ კლუბს ქართულ რაგბიში. კლუბი მნიშვნელოვან როლს თამაშობს ქვეყნის რაგბის განვითარებასა და სპორტის პოპულარიზაციაში.
      </p>

      {/* Content Sections */}
      <div className="space-y-10">

        {/* History */}
        <div className="p-4 rounded-lg text-center"> {/* Centered text */}
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-red-500 flex items-center justify-center"> {/* Centered heading */}
            <BarChart className="w-6 h-6 mr-3 flex-shrink-0" /> ისტორია
          </h2>
          <div className="space-y-3 text-base text-foreground/90">
            <p>კლუბი 1985 წელს ბათუ კევლიშვილის თაოსნობით დაარსდა.</p>
            <p>2014 წელს გუნდი შეუერთდა გლობალურ სარაგბო ქსელს Saracens და ეწოდა “Lelo Saracens Tbilisi“.</p>
          </div>
        </div>

        {/* Achievements */}
        <div className="p-4 rounded-lg text-center"> {/* Centered text */}
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-red-500 flex items-center justify-center"> {/* Centered heading */}
            <Trophy className="w-6 h-6 mr-3 flex-shrink-0" /> მიღწევები
          </h2>
          <div className="space-y-3 text-base text-foreground/90">
             <p><strong>ჩემპიონატის გამარჯვებები:</strong> 2004, 2009, 2013, 2014, 2015, 2016.</p>
          </div>
        </div>

        {/* Infrastructure */}
        <div className="p-4 rounded-lg text-center"> {/* Centered text */}
           <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-red-500 flex items-center justify-center"> {/* Centered heading */}
             <MapPin className="w-6 h-6 mr-3 flex-shrink-0" /> ინფრასტრუქტურა
          </h2>
           <div className="space-y-3 text-base text-foreground/90">
             <p>კლუბს აქვს მთავარი ბაზა „Lelo Arena“ თბილისში (იოანე პეტრიწის 8დ), ასევე ბაზა ვარკეთილში, ლელოს აკადემია დიღომში და მოედანი ქვიშხეთში.</p>
             {/* Image 1: Lelo Arena */}
             <div className="relative w-full h-64 sm:h-80 md:h-96 my-6 rounded-lg overflow-hidden shadow-lg inline-block"> {/* Added inline-block */}
                <Image
                    src="/images/lelo-arena.jpg"
                    alt="Lelo Arena Stadium"
                    fill
                    className="object-cover"
                />
             </div>
          </div>
        </div>

         {/* Identity & Goals */}
         <div className="p-4 rounded-lg text-center"> {/* Centered text */}
           <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-red-500 flex items-center justify-center"> {/* Centered heading */}
             <Target className="w-6 h-6 mr-3 flex-shrink-0" /> იდენტობა და მიზნები
          </h2>
           <div className="space-y-3 text-base text-foreground/90">
             <p><strong>ოფიციალური ფერები:</strong> წითელი, შავი და თეთრი.</p>
             <p><strong>კლუბის მისია:</strong> მონაწილეობა პირველ ეროვნულ დივიზიონში, მომზადება პროფესიონალურ დონეზე, სოციალური პასუხისმგებლობა და ახალგაზრდული ბაზების განვითარება.</p>
             {/* Image 2: Home of Rugby */}
             <div className="relative w-full h-64 sm:h-80 md:h-96 my-6 rounded-lg overflow-hidden shadow-lg inline-block"> {/* Added inline-block */}
                <Image
                    src="/images/home-of-rugby.jpg"
                    alt="Welcome to the Home of Rugby"
                    fill
                    className="object-cover"
                />
             </div>
          </div>
        </div>

        {/* Importance & Development */}
        <div className="p-4 rounded-lg text-center"> {/* Centered text */}
           <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-red-500 flex items-center justify-center"> {/* Centered heading */}
             <Flag className="w-6 h-6 mr-3 flex-shrink-0" /> მნიშვნელობა ქართული რაგბისთვის
          </h2>
           <div className="space-y-3 text-base text-foreground/90">
             <p>Rugby Club Lelo Tbilisi ერთ-ერთი წამყვანი კლუბია საქართველოში, ხელს უწყობს რაგბის კულტურის გაღვივებას და სპორტის პოპულარიზაციას ახალგაზრდებში.</p>
             <p>ლელო არის საქართველოს ყველა ასაკის ნაკრებების ძირითადი შემავსებელი ძალა, გამოირჩევა მაღალპროფესიონალური მიდგომით და საუკეთესო სარაგბო სკოლით ქვეყნის მასშტაბით.</p>
             <p>კლუბის აღზრდილი მოთამაშეები წარმატებით ასპარეზობენ საფრანგეთის ტოპ გუნდებში.</p>
          </div>
        </div>

      </div>
    </section>
  )
}