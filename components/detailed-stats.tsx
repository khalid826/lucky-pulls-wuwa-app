import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getStatIcon, getSetColor } from "@/lib/stat-icons"

export default function DetailedStats({ stats, activeSets, materialNeeds }) {
  const statCategories = [
    {
      name: "Core Stats",
      stats: [
        { label: "HP", key: "hp", value: stats.hp?.toLocaleString() || "0", suffix: "" },
        { label: "ATK", key: "attack", value: stats.attack?.toLocaleString() || "0", suffix: "" },
        { label: "DEF", key: "defense", value: stats.defense?.toLocaleString() || "0", suffix: "" },
      ],
    },
    {
      name: "Critical Stats",
      stats: [
        { label: "Crit Rate", key: "critRate", value: stats.critRate || 0, suffix: "%" },
        { label: "Crit DMG", key: "critDMG", value: stats.critDMG || 0, suffix: "%" },
      ],
    },
    {
      name: "Action Bonuses",
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
      name: "Utility Stats",
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
      {/* Crit Value Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            Crit Value Analysis
          </CardTitle>
          <CardDescription>Overall critical stat optimization metric</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Total Crit Value</span>
              <span className="text-2xl font-bold text-purple-600">{calculateCritValue()}</span>
            </div>
            <Progress value={Math.min(calculateCritValue() / 2, 100)} className="h-3" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span>Crit Rate Contribution:</span>
                <span className="font-medium">{((stats.critRate || 5) * 2).toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Crit DMG Contribution:</span>
                <span className="font-medium">{(stats.critDMG || 150).toFixed(1)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stats */}
      {statCategories.map((category) => (
        <Card key={category.name}>
          <CardHeader>
            <CardTitle>{category.name}</CardTitle>
            <CardDescription>Detailed breakdown of {category.name.toLowerCase()}</CardDescription>
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
                        <StatIcon className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">{stat.label}</span>
                      </div>
                      <span className="text-lg font-bold">
                        {stat.value}
                        {stat.suffix}
                      </span>
                    </div>
                    {efficiency > 0 && (
                      <div className="space-y-1">
                        <Progress value={efficiency} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
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

      {/* Echo Set Bonuses */}
      {activeSets && activeSets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Echo Set Bonuses</CardTitle>
            <CardDescription>Active set effects from your echo configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeSets.map((set, index) => {
                const setGradient = getSetColor(set.name)
                return (
                  <div key={index} className={`p-4 bg-gradient-to-r ${setGradient} rounded-lg text-white`}>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-lg">{set.name}</h4>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        {set.pieces}-Piece Set
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-white/10 rounded p-2">
                        <div className="text-sm font-medium mb-1">2-Piece Bonus</div>
                        <div className="text-sm opacity-90">{set.bonus["2pc"]}</div>
                      </div>
                      {set.pieces >= 5 && (
                        <div className="bg-white/10 rounded p-2">
                          <div className="text-sm font-medium mb-1">5-Piece Bonus</div>
                          <div className="text-sm opacity-90">{set.bonus["5pc"]}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Material Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Material Requirements</CardTitle>
          <CardDescription>Resources needed for current build configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {materialNeeds.characterMats?.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  Character Materials
                </h4>
                <div className="space-y-2">
                  {materialNeeds.characterMats.map((mat, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm">{mat.name}</span>
                      <Badge variant="secondary">{mat.amount}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {materialNeeds.weaponMats?.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  Weapon Materials
                </h4>
                <div className="space-y-2">
                  {materialNeeds.weaponMats.map((mat, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                      <span className="text-sm">{mat.name}</span>
                      <Badge variant="secondary">{mat.amount}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {materialNeeds.skillMats?.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  Skill Materials
                </h4>
                <div className="space-y-2">
                  {materialNeeds.skillMats.map((mat, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm">{mat.name}</span>
                      <Badge variant="secondary">{mat.amount}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!materialNeeds.characterMats?.length &&
              !materialNeeds.weaponMats?.length &&
              !materialNeeds.skillMats?.length && (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
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
