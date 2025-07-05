import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { resonators } from "@/lib/data"
import { getElementColor, getElementBgColor } from "@/lib/stat-icons"

export default function ResonatorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resonators</h1>
          <p className="text-gray-600">Browse all available resonators and their abilities</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resonators.map((resonator) => {
            const elementGradient = getElementColor(resonator.element)
            const elementBg = getElementBgColor(resonator.element)

            return (
              <Card key={resonator.id} className={`hover:shadow-lg transition-shadow border-2 ${elementBg}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{resonator.name}</CardTitle>
                      <CardDescription className="mt-1">{resonator.weapon} User</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex">
                        {Array.from({ length: resonator.rarity }).map((_, i) => (
                          <span key={i} className="text-yellow-400 text-lg">
                            ★
                          </span>
                        ))}
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full bg-gradient-to-r ${elementGradient} text-white text-sm font-medium`}
                      >
                        {resonator.element}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center p-2 bg-red-50 rounded">
                        <div className="font-semibold text-red-700">HP</div>
                        <div>{resonator.baseStats.hp}</div>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded">
                        <div className="font-semibold text-orange-700">ATK</div>
                        <div>{resonator.baseStats.attack}</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-semibold text-blue-700">DEF</div>
                        <div>{resonator.baseStats.defense}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/resonators/${resonator.id}`} className="flex-1">
                        <Button className="w-full">View Details</Button>
                      </Link>
                      <Link href={`/simulator?resonator=${resonator.id}`}>
                        <Button variant="outline">Simulate</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
