import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { echoes } from "@/lib/data"

export default function EchoesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Echoes</h1>
          <p className="text-gray-600">Browse all available echoes and their set bonuses</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {echoes.map((echo) => (
            <Card key={echo.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{echo.name}</CardTitle>
                    <CardDescription className="mt-1">Cost {echo.cost}</CardDescription>
                  </div>
                  <Badge variant="secondary">{echo.element}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Main Stats</div>
                    <div className="flex flex-wrap gap-1">
                      {echo.mainStats.map((stat) => (
                        <Badge key={stat} variant="outline" className="text-xs">
                          {stat}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Set Bonuses</div>
                    <div className="space-y-2">
                      <div className="p-2 bg-blue-50 rounded text-xs">
                        <div className="font-medium text-blue-700">2-Piece</div>
                        <div className="text-blue-600">{echo.setBonus["2pc"]}</div>
                      </div>
                      <div className="p-2 bg-purple-50 rounded text-xs">
                        <div className="font-medium text-purple-700">5-Piece</div>
                        <div className="text-purple-600">{echo.setBonus["5pc"]}</div>
                      </div>
                    </div>
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
