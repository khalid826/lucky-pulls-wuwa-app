import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sword, Users, Calculator, BookOpen } from "lucide-react"
import { getElementColor } from "@/lib/stat-icons"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Wuthering Waves</h1>
          <h2 className="text-3xl font-semibold text-slate-300 mb-6">Wiki & Build Simulator</h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Master the art of resonance. Explore resonators, optimize builds, and dominate the battlefield with our
            comprehensive toolkit.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <Users className="w-12 h-12 mx-auto text-blue-400 mb-2" />
              <CardTitle className="text-white">Resonators</CardTitle>
              <CardDescription className="text-slate-400">Browse all available resonators</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/resonators">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0">
                  View Resonators
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <Calculator className="w-12 h-12 mx-auto text-green-400 mb-2" />
              <CardTitle className="text-white">Build Simulator</CardTitle>
              <CardDescription className="text-slate-400">Simulate and optimize builds</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/simulator">
                <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0">
                  Start Simulation
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <Sword className="w-12 h-12 mx-auto text-red-400 mb-2" />
              <CardTitle className="text-white">Weapons</CardTitle>
              <CardDescription className="text-slate-400">Explore weapon database</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/weapons">
                <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0">
                  View Weapons
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <BookOpen className="w-12 h-12 mx-auto text-purple-400 mb-2" />
              <CardTitle className="text-white">Echo Sets</CardTitle>
              <CardDescription className="text-slate-400">Browse echo collections</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/echoes">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0">
                  View Echo Sets
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700">
          <h2 className="text-3xl font-bold text-white mb-6">Featured Resonators</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Rover", element: "Spectro", rarity: 5 },
              { name: "Jiyan", element: "Aero", rarity: 5 },
              { name: "Calcharo", element: "Electro", rarity: 5 },
            ].map((resonator) => {
              const elementGradient = getElementColor(resonator.element)
              return (
                <Card
                  key={resonator.name}
                  className="bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600 hover:border-slate-500 transition-all duration-300 hover:scale-105"
                >
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg text-white">{resonator.name}</CardTitle>
                        <CardDescription className="text-slate-400">{resonator.element} Element</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex">
                          {Array.from({ length: resonator.rarity }).map((_, i) => (
                            <span key={i} className="text-yellow-400">
                              ★
                            </span>
                          ))}
                        </div>
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${elementGradient}`} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/resonators/${resonator.name.toLowerCase()}`}>
                      <Button
                        variant="outline"
                        className="w-full bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                      >
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
