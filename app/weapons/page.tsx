import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { weapons } from "@/lib/data"

export default function WeaponsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Weapons</h1>
          <p className="text-gray-600">Browse all available weapons and their stats</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weapons.map((weapon) => (
            <Card key={weapon.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{weapon.name}</CardTitle>
                    <CardDescription className="mt-1">{weapon.type}</CardDescription>
                  </div>
                  <div className="flex">
                    {Array.from({ length: weapon.rarity }).map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-orange-50 rounded">
                      <div className="font-semibold text-orange-700 text-sm">Base ATK</div>
                      <div className="text-lg font-bold">{weapon.baseAttack}</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-semibold text-blue-700 text-sm">{weapon.subStat}</div>
                      <div className="text-lg font-bold">{weapon.subStatValue}</div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-1">Passive</div>
                    <div className="text-xs text-gray-600">{weapon.passive}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
