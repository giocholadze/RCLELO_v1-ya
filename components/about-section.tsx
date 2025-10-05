import { Card, CardContent } from "@/components/ui/card"
import EditableText from "@/components/editable-text"

export default function AboutSection() {
  return (
    <section className="mb-10 relative">
      <div className="relative rounded-xl overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/team-celebration.jpg')",
            filter: "brightness(0.7)",
          }}
        />
        <div className="absolute inset-0 bg-black/75" />

        <div className="relative z-10 p-8 md:p-12 text-white">
          <div className="text-center mb-8">
            <EditableText
              contentKey="about_title"
              defaultValue="ჩვენს შესახებ"
              as="h2"
              className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-md"
            />
            <EditableText
              contentKey="about_description"
              defaultValue="რაგბის კლუბი ლელო, დაარსებული 1980 წელს თბილისში, წარმოადგენს ერთ-ერთ ყველაზე წარმატებულ და ტიტულოვან კლუბს ქართულ რაგბიში."
              type="textarea"
              as="p"
              className="text-gray-50 max-w-4xl mx-auto leading-relaxed text-lg font-medium drop-shadow"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/20 backdrop-blur-md border-2 border-white/30 shadow-xl hover:bg-white/25 transition-all duration-300">
              <CardContent className="p-6">
                <EditableText
                  contentKey="history_title"
                  defaultValue="ისტორია და მიღწევები"
                  as="h3"
                  className="text-xl font-bold mb-4 text-white drop-shadow-md"
                />
                <EditableText
                  contentKey="history_content_1"
                  defaultValue="ლელო სარასენსმა ექვსჯერ მოიპოვა საქართველოს ჩემპიონატის ოქროს მედალი და არაერთხელ გახდა თასის მფლობელი."
                  type="textarea"
                  as="p"
                  className="text-gray-50 mb-4 leading-relaxed font-medium"
                />
                <EditableText
                  contentKey="history_content_2"
                  defaultValue="კლუბს გააჩნია ორი სრულად აღჭურვილი სარაგბო ბაზა თბილისში, მათ შორის ლელო არენა, რომელიც 3000 მაყურებელს იტევს."
                  type="textarea"
                  as="p"
                  className="text-gray-50 leading-relaxed font-medium"
                />
              </CardContent>
            </Card>

            <Card className="bg-white/20 backdrop-blur-md border-2 border-white/30 shadow-xl hover:bg-white/25 transition-all duration-300">
              <CardContent className="p-6">
                <EditableText
                  contentKey="infrastructure_title"
                  defaultValue="ინფრასტრუქტურა და აკადემია"
                  as="h3"
                  className="text-xl font-bold mb-4 text-white drop-shadow-md"
                />
                <EditableText
                  contentKey="infrastructure_content_1"
                  defaultValue="აკადემიაში 6-დან 18 წლამდე ასაკის დაახლოებით 1000 ახალგაზრდა მორაგბე ვარჯიშობს."
                  type="textarea"
                  as="p"
                  className="text-gray-50 mb-4 leading-relaxed font-medium"
                />
                <EditableText
                  contentKey="infrastructure_content_2"
                  defaultValue="კლუბის პრეზიდენტი და თანადამფუძნებელია ვასილ კევლიშვილი."
                  type="textarea"
                  as="p"
                  className="text-gray-50 leading-relaxed font-medium"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
