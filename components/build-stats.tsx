import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getStatIcon, getSetColor } from "@/lib/stat-icons"

export default function BuildStats({ stats, echoSet, materialNeeds }) {
  const statCategories = [
    {
      name: "Core Combat Stats",
      stats: [
        { label: "HP", key: "hp", value: stats.hp?.toLocaleString() || "0", suffix: "" },
        { label: "ATK", key: "attack", value: stats.attack?.toLocaleString() || "0", suffix: "" },
        { label: "DEF", key: "defense", value: stats.defense?.toLocaleString() || "0", suffix: "" },
        { label: "Crit Rate", key: "critRate", value: stats.critRate || 0, suffix: "%" },
        { label: "Crit DMG", key: "critDMG", value: stats.critDMG || 0, suffix: "%" },
      ],
    },
    {
      name: "Action Damage Bonuses",
      stats: [
        { label: "Basic Attack DMG%", key: "basicAttackDMG", value: stats.basicAttackDMG || 0, suffix: "%" },
        { label: "Heavy Attack DMG%", key: "heavyAttackDMG", value: stats.heavyAttackDMG || 0, suffix: "%" },
        { label: "Resonance Skill DMG%", key: "resonanceSkillDMG", value: stats.resonanceSkillDMG || 0, suffix: "%" },
        {
          label: "Resonance Liberation DMG%",
          key: "resonanceLiberationDMG",
          value: stats.resonanceLiberationDMG || 0,
          suffix: "%",
        },
      ],
    },
    {
      name: "Utility & Support Stats",
      stats: [
        { label: "Energy Regen", key: "energyRegen", value: stats.energyRegen || 100, suffix: "%" },
        { label: "Healing Bonus%", key: "healingBonus", value: stats.healingBonus || 0, suffix: "%" },
        { label: "Elemental DMG%", key: "elementalDMG", value: stats.elementalDMG || 0, suffix: "%" },
        { label: "All DMG Bonus%", key: "allDMGBonus", value: stats.allDMGBonus || 0, suffix: "%" },
      ],
    },
  ]

  const calculateCritValue = () => {
    const critRate = stats.critRate || 5
    const critDMG = stats.critDMG || 150
    return Math.round((critRate * 2 + critDMG) * 10) / 10
  }

  const getStatEfficiency = (statKey, value) => {
    const maxValues = {
      critRate: 100,
      critDMG: 300,
      energyRegen: 200,
      elementalDMG: 100,
      basicAttackDMG: 100,
      heavyAttackDMG: 100,
      resonanceSkillDMG: 100,
      resonanceLiberationDMG: 100,
    }

    const maxValue = maxValues[statKey]
    if (!maxValue) return 0

    return Math.min((value / maxValue) * 100, 100)
  }

  return (
    <div className="space-y-6">
      {/* Crit Value Analysis */}
      <Card className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 border-purple-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">CV</span>
            </div>
            <div>
              <div className="text-xl font-bold">Crit Value Analysis</div>
              <div className="text-sm text-purple-200">Build optimization metric</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-purple-100">Total Crit Value</span>
              <span className="text-3xl font-bold text-white">{calculateCritValue()}</span>
            </div>
            <Progress value={Math.min(calculateCritValue() / 2, 100)} className="h-3 bg-purple-800" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between text-purple-200">
                <span>Crit Rate:</span>
                <span className="font-medium text-white">{((stats.critRate || 5) * 2).toFixed(1)} CV</span>
              </div>
              <div className="flex justify-between text-purple-200">
                <span>Crit DMG:</span>
                <span className="font-medium text-white">{(stats.critDMG || 150).toFixed(1)} CV</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stats */}
      {statCategories.map((category) => (
        <Card
          key={category.name}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white"
        >
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white">{category.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {category.stats.map((stat) => {
                const StatIcon = getStatIcon(stat.label)
                const efficiency = getStatEfficiency(
                  stat.key,
                  typeof stat.value === "string" ? Number.parseFloat(stat.value.replace(/,/g, "")) : stat.value,
                )

                return (
                  <div key={stat.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatIcon className="w-5 h-5 text-slate-400" />
                        <span className="font-medium text-slate-200">{stat.label}</span>
                      </div>
                      <span className="text-xl font-bold text-white">
                        {stat.value}
                        {stat.suffix}
                      </span>
                    </div>
                    {efficiency > 0 && (
                      <div className="space-y-1">
                        <Progress value={efficiency} className="h-2 bg-slate-700" />
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Efficiency</span>
                          <span>{efficiency.toFixed(1)}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Echo Set Bonus */}
      {echoSet && (
        <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white">Active Echo Set</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 bg-gradient-to-r ${getSetColor(echoSet.name)} rounded-lg text-white`}>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-xl">{echoSet.name}</h4>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  5-Piece Set
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="bg-white/10 rounded p-3">
                  <div className="text-sm font-medium mb-1">2-Piece Bonus</div>
                  <div className="text-sm opacity-90">{echoSet.bonuses["2pc"]}</div>
                </div>
                <div className="bg-white/10 rounded p-3">
                  <div className="text-sm font-medium mb-1">5-Piece Bonus</div>
                  <div className="text-sm opacity-90">{echoSet.bonuses["5pc"]}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Material Requirements */}
      <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white">Material Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {materialNeeds.characterMats?.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-slate-200 mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  Character Materials
                </h4>
                <div className="space-y-2">
                  {materialNeeds.characterMats.map((mat, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-blue-900/30 rounded border border-blue-700/50"
                    >
                      <span className="text-sm text-blue-200">{mat.name}</span>
                      <Badge variant="secondary" className="bg-blue-700/50 text-blue-100 border-blue-600">
                        {mat.amount}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {materialNeeds.weaponMats?.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-slate-200 mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  Weapon Materials
                </h4>
                <div className="space-y-2">
                  {materialNeeds.weaponMats.map((mat, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-orange-900/30 rounded border border-orange-700/50"
                    >
                      <span className="text-sm text-orange-200">{mat.name}</span>
                      <Badge variant="secondary" className="bg-orange-700/50 text-orange-100 border-orange-600">
                        {mat.amount}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {materialNeeds.skillMats?.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-slate-200 mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  Skill Materials
                </h4>
                <div className="space-y-2">
                  {materialNeeds.skillMats.map((mat, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-green-900/30 rounded border border-green-700/50"
                    >
                      <span className="text-sm text-green-200">{mat.name}</span>
                      <Badge variant="secondary" className="bg-green-700/50 text-green-100 border-green-600">
                        {mat.amount}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!materialNeeds.characterMats?.length &&
              !materialNeeds.weaponMats?.length &&
              !materialNeeds.skillMats?.length && (
                <div className="text-center py-8 text-slate-400">
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">✨</span>
                  </div>
                  <p>No materials needed at current levels</p>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
