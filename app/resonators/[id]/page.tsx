import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { resonators } from "@/lib/data"
import { getElementColor, getElementBgColor, getStatIcon } from "@/lib/stat-icons"

export default function ResonatorDetailPage({ params }) {
  const resonator = resonators.find((r) => r.id === params.id)

  if (!resonator) {
    notFound()
  }

  const elementGradient = getElementColor(resonator.element)
  const elementBg = getElementBgColor(resonator.element)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/resonators">
            <Button variant="ghost" className="mb-4 text-slate-300 hover:text-white hover:bg-slate-800">
              ← Back to Resonators
            </Button>
          </Link>

          {/* Hero Section */}
          <div className={`${elementBg} rounded-2xl p-8 mb-8 border-2 border-slate-600`}>
            <div className="flex items-center gap-6 mb-6">
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-r ${elementGradient} flex items-center justify-center`}
              >
                <span className="text-white font-bold text-3xl">{resonator.name[0]}</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">{resonator.name}</h1>
                <div className="flex items-center gap-4">
                  <Badge className={`bg-gradient-to-r ${elementGradient} text-white border-0 text-lg px-4 py-1`}>
                    {resonator.element}
                  </Badge>
                  <div className="flex">
                    {Array.from({ length: resonator.rarity }).map((_, i) => (
                      <span key={i} className="text-yellow-500 text-2xl">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-slate-700 font-medium">{resonator.weapon} User</span>
                </div>
              </div>
            </div>
            <p className="text-slate-700 text-lg leading-relaxed max-w-4xl">{resonator.description}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Base Stats */}
            <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Base Statistics</CardTitle>
                <CardDescription className="text-slate-300">Level 1 base stats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { label: "HP", value: resonator.baseStats.hp, color: "red" },
                    { label: "ATK", value: resonator.baseStats.attack, color: "orange" },
                    { label: "DEF", value: resonator.baseStats.defense, color: "blue" },
                    { label: "Crit Rate", value: resonator.baseStats.critRate, color: "purple", suffix: "%" },
                    { label: "Crit DMG", value: resonator.baseStats.critDMG, color: "pink", suffix: "%" },
                  ].map((stat) => {
                    const StatIcon = getStatIcon(stat.label)
                    return (
                      <div
                        key={stat.label}
                        className={`text-center p-4 bg-${stat.color}-900/30 rounded-lg border border-${stat.color}-700/50`}
                      >
                        <StatIcon className={`w-6 h-6 mx-auto mb-2 text-${stat.color}-400`} />
                        <div className={`text-2xl font-bold text-${stat.color}-300`}>
                          {stat.value}
                          {stat.suffix || ""}
                        </div>
                        <div className={`text-sm text-${stat.color}-400`}>{stat.label}</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Skills & Abilities */}
            <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Skills & Abilities</CardTitle>
                <CardDescription className="text-slate-300">Combat abilities with detailed multipliers</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-600">
                    <TabsTrigger value="basic" className="text-white data-[state=active]:bg-slate-700">
                      Basic
                    </TabsTrigger>
                    <TabsTrigger value="skill" className="text-white data-[state=active]:bg-slate-700">
                      Skill
                    </TabsTrigger>
                    <TabsTrigger value="liberation" className="text-white data-[state=active]:bg-slate-700">
                      Liberation
                    </TabsTrigger>
                    <TabsTrigger value="passives" className="text-white data-[state=active]:bg-slate-700">
                      Passives
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-600">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-xl text-white">{resonator.skills.basic.name}</h3>
                          <Badge variant="outline" className="mt-1 border-slate-500 text-slate-300">
                            {resonator.skills.basic.type}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-slate-300 mb-4 leading-relaxed">{resonator.skills.basic.description}</p>

                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-3">Damage Multipliers by Level</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-slate-600">
                                <th className="text-left p-2 text-slate-300">Level</th>
                                {Object.keys(resonator.skills.basic.multipliers[0].values).map((key) => (
                                  <th key={key} className="text-right p-2 text-slate-300 capitalize">
                                    {key.replace(/([A-Z])/g, " $1")}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {resonator.skills.basic.multipliers.slice(0, 5).map((mult) => (
                                <tr key={mult.level} className="border-b border-slate-700/50">
                                  <td className="p-2 font-medium text-white">{mult.level}</td>
                                  {Object.values(mult.values).map((value, idx) => (
                                    <td key={idx} className="text-right p-2 text-slate-200">
                                      {value}%
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="skill" className="space-y-4">
                    <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-600">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-xl text-white">{resonator.skills.skill.name}</h3>
                          <Badge variant="outline" className="mt-1 border-slate-500 text-slate-300">
                            {resonator.skills.skill.type}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-slate-300 mb-4 leading-relaxed">{resonator.skills.skill.description}</p>

                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-3">Damage Multipliers by Level</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {resonator.skills.skill.multipliers.slice(0, 10).map((mult) => (
                            <div
                              key={mult.level}
                              className="flex justify-between items-center p-2 bg-slate-800/50 rounded border border-slate-600"
                            >
                              <span className="text-sm font-medium text-slate-300">Level {mult.level}</span>
                              <span className="text-sm font-bold text-white">{mult.values.damage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="liberation" className="space-y-4">
                    <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-600">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-xl text-white">{resonator.skills.liberation.name}</h3>
                          <Badge variant="outline" className="mt-1 border-slate-500 text-slate-300">
                            {resonator.skills.liberation.type}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-slate-300 mb-4 leading-relaxed">{resonator.skills.liberation.description}</p>

                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-3">Damage Multipliers by Level</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {resonator.skills.liberation.multipliers.slice(0, 10).map((mult) => (
                            <div key={mult.level} className="p-2 bg-slate-800/50 rounded border border-slate-600">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-slate-300">Level {mult.level}</span>
                              </div>
                              {Object.entries(mult.values).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-xs">
                                  <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                                  <span className="text-white font-medium">{value}%</span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="passives" className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-700/50">
                        <h3 className="font-bold text-lg text-blue-200 mb-2">
                          Intro Skill: {resonator.skills.intro.name}
                        </h3>
                        <p className="text-blue-100 text-sm mb-3">{resonator.skills.intro.description}</p>
                        <div className="text-xs text-blue-300">
                          Damage: {resonator.skills.intro.multipliers[0].values.damage}% -{" "}
                          {resonator.skills.intro.multipliers[9].values.damage}% ATK
                        </div>
                      </div>

                      <div className="p-4 bg-green-900/30 rounded-lg border border-green-700/50">
                        <h3 className="font-bold text-lg text-green-200 mb-2">
                          Outro Skill: {resonator.skills.outro.name}
                        </h3>
                        <p className="text-green-100 text-sm">{resonator.skills.outro.description}</p>
                      </div>

                      <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-700/50">
                        <h3 className="font-bold text-lg text-purple-200 mb-2">
                          Passive 1: {resonator.skills.passive1.name}
                        </h3>
                        <p className="text-purple-100 text-sm">{resonator.skills.passive1.description}</p>
                      </div>

                      <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-700/50">
                        <h3 className="font-bold text-lg text-purple-200 mb-2">
                          Passive 2: {resonator.skills.passive2.name}
                        </h3>
                        <p className="text-purple-100 text-sm">{resonator.skills.passive2.description}</p>
                      </div>

                      <div className="p-4 bg-yellow-900/30 rounded-lg border border-yellow-700/50">
                        <h3 className="font-bold text-lg text-yellow-200 mb-2">
                          Concerto: {resonator.skills.concerto.name}
                        </h3>
                        <p className="text-yellow-100 text-sm">{resonator.skills.concerto.description}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/simulator?resonator=${resonator.id}`}>
                  <Button className={`w-full bg-gradient-to-r ${elementGradient} hover:opacity-90 text-white border-0`}>
                    Build Simulator
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                >
                  Material Calculator
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                >
                  Team Builder
                </Button>
              </CardContent>
            </Card>

            {/* Resonance Chain */}
            <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white">
              <CardHeader>
                <CardTitle className="text-white">Resonance Chain</CardTitle>
                <CardDescription className="text-slate-300">Constellation effects and upgrades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resonator.resonanceChain.map((chain, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-700/50"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-700/50 rounded-full flex items-center justify-center border border-purple-600">
                        <span className="text-sm font-bold text-purple-200">S{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-purple-200 mb-1">Sequence {index + 1}</div>
                        <div className="text-sm text-purple-100 leading-relaxed">{chain}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Builds */}
            <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white">
              <CardHeader>
                <CardTitle className="text-white">Recommended Builds</CardTitle>
                <CardDescription className="text-slate-300">Popular build configurations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-900/30 rounded-lg border border-green-700/50">
                  <div className="font-medium text-green-200 mb-1">DPS Build</div>
                  <div className="text-sm text-green-300">Focus on ATK%, Crit Rate, Crit DMG</div>
                </div>
                <div className="p-3 bg-blue-900/30 rounded-lg border border-blue-700/50">
                  <div className="font-medium text-blue-200 mb-1">Support Build</div>
                  <div className="text-sm text-blue-300">Focus on Energy Regen, Healing Bonus</div>
                </div>
                <div className="p-3 bg-orange-900/30 rounded-lg border border-orange-700/50">
                  <div className="font-medium text-orange-200 mb-1">Hybrid Build</div>
                  <div className="text-sm text-orange-300">Balanced ATK and utility stats</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
