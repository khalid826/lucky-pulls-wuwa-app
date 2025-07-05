"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EchoSetSelector from "@/components/echo-set-selector"
import BuildStats from "@/components/build-stats"
import { resonators, weapons, echoSets } from "@/lib/data"
import { getElementColor, getElementBgColor } from "@/lib/stat-icons"

export default function SimulatorPage() {
  const searchParams = useSearchParams()
  const initialResonator = searchParams.get("resonator") || "rover"

  const [selectedResonator, setSelectedResonator] = useState(initialResonator)
  const [characterLevel, setCharacterLevel] = useState([1])
  const [weaponLevel, setWeaponLevel] = useState([1])
  const [selectedWeapon, setSelectedWeapon] = useState("")
  const [skillLevels, setSkillLevels] = useState({
    basic: [1],
    skill: [1],
    liberation: [1],
    intro: [1],
  })
  const [echoConfiguration, setEchoConfiguration] = useState(null)

  const currentResonator = resonators.find((r) => r.id === selectedResonator)
  const availableWeapons = weapons.filter((w) => w.type === currentResonator?.weapon)

  useEffect(() => {
    if (availableWeapons.length > 0 && !selectedWeapon) {
      setSelectedWeapon(availableWeapons[0].id)
    }
  }, [selectedResonator, availableWeapons, selectedWeapon])

  const calculateDetailedStats = () => {
    if (!currentResonator)
      return {
        hp: 0,
        attack: 0,
        defense: 0,
        critRate: 5,
        critDMG: 150,
        elementalDMG: 0,
        allDMGBonus: 0,
        energyRegen: 100,
        healingBonus: 0,
        basicAttackDMG: 0,
        heavyAttackDMG: 0,
        resonanceSkillDMG: 0,
        resonanceLiberationDMG: 0,
      }

    const levelMultiplier = 1 + (characterLevel[0] - 1) * 0.1
    const selectedWeaponData = weapons.find((w) => w.id === selectedWeapon)

    // Base stats from character
    const stats = {
      hp: Math.floor(currentResonator.baseStats.hp * levelMultiplier),
      attack: Math.floor(currentResonator.baseStats.attack * levelMultiplier),
      defense: Math.floor(currentResonator.baseStats.defense * levelMultiplier),
      critRate: currentResonator.baseStats.critRate || 5,
      critDMG: currentResonator.baseStats.critDMG || 150,
      elementalDMG: 0,
      allDMGBonus: 0,
      energyRegen: 100,
      healingBonus: 0,
      atkPercent: 0,
      hpPercent: 0,
      defPercent: 0,
      basicAttackDMG: 0,
      heavyAttackDMG: 0,
      resonanceSkillDMG: 0,
      resonanceLiberationDMG: 0,
    }

    // Add weapon stats
    if (selectedWeaponData) {
      const weaponAttackBonus = selectedWeaponData.baseAttack * (1 + (weaponLevel[0] - 1) * 0.05)
      stats.attack += Math.floor(weaponAttackBonus)

      // Add weapon substat
      if (selectedWeaponData.subStat === "Crit Rate") {
        stats.critRate += selectedWeaponData.subStatValue
      } else if (selectedWeaponData.subStat === "Crit DMG") {
        stats.critDMG += selectedWeaponData.subStatValue
      } else if (selectedWeaponData.subStat === "ATK%") {
        stats.atkPercent += selectedWeaponData.subStatValue
      } else if (selectedWeaponData.subStat === "Energy Regen") {
        stats.energyRegen += selectedWeaponData.subStatValue
      }

      // Add weapon passive stats
      if (selectedWeaponData.passiveStats) {
        Object.entries(selectedWeaponData.passiveStats).forEach(([key, value]) => {
          if (key === "atkPercent") stats.atkPercent += value
          if (key === "energyRegen") stats.energyRegen += value
        })
      }
    }

    // Add echo stats
    if (echoConfiguration?.slots) {
      echoConfiguration.slots.forEach((echo) => {
        if (echo.mainStat && echo.mainStatValue) {
          if (echo.mainStat === "ATK%") {
            stats.atkPercent += echo.mainStatValue
          } else if (echo.mainStat === "HP%") {
            stats.hpPercent += echo.mainStatValue
          } else if (echo.mainStat === "DEF%") {
            stats.defPercent += echo.mainStatValue
          } else if (echo.mainStat === "Crit Rate") {
            stats.critRate += echo.mainStatValue
          } else if (echo.mainStat === "Crit DMG") {
            stats.critDMG += echo.mainStatValue
          } else if (echo.mainStat === "Energy Regen") {
            stats.energyRegen += echo.mainStatValue
          } else if (echo.mainStat === "Healing Bonus%") {
            stats.healingBonus += echo.mainStatValue
          } else if (echo.mainStat.includes("DMG%")) {
            if (echo.mainStat.includes(currentResonator.element)) {
              stats.elementalDMG += echo.mainStatValue
            }
          }
        }

        // Add substat bonuses
        echo.subStats?.forEach((subStat) => {
          if (subStat.stat === "ATK") {
            stats.attack += subStat.value
          } else if (subStat.stat === "ATK%") {
            stats.atkPercent += subStat.value
          } else if (subStat.stat === "HP") {
            stats.hp += subStat.value
          } else if (subStat.stat === "HP%") {
            stats.hpPercent += subStat.value
          } else if (subStat.stat === "DEF") {
            stats.defense += subStat.value
          } else if (subStat.stat === "DEF%") {
            stats.defPercent += subStat.value
          } else if (subStat.stat === "Crit Rate") {
            stats.critRate += subStat.value
          } else if (subStat.stat === "Crit DMG") {
            stats.critDMG += subStat.value
          } else if (subStat.stat === "Energy Regen") {
            stats.energyRegen += subStat.value
          } else if (subStat.stat === "Basic Attack DMG%") {
            stats.basicAttackDMG += subStat.value
          } else if (subStat.stat === "Heavy Attack DMG%") {
            stats.heavyAttackDMG += subStat.value
          } else if (subStat.stat === "Resonance Skill DMG%") {
            stats.resonanceSkillDMG += subStat.value
          } else if (subStat.stat === "Resonance Liberation DMG%") {
            stats.resonanceLiberationDMG += subStat.value
          }
        })
      })
    }

    // Apply percentage bonuses
    stats.hp = Math.floor(stats.hp * (1 + stats.hpPercent / 100))
    stats.attack = Math.floor(stats.attack * (1 + stats.atkPercent / 100))
    stats.defense = Math.floor(stats.defense * (1 + stats.defPercent / 100))

    // Round values
    stats.critRate = Math.round(stats.critRate * 10) / 10
    stats.critDMG = Math.round(stats.critDMG * 10) / 10
    stats.energyRegen = Math.round(stats.energyRegen * 10) / 10
    stats.healingBonus = Math.round(stats.healingBonus * 10) / 10
    stats.elementalDMG = Math.round(stats.elementalDMG * 10) / 10
    stats.basicAttackDMG = Math.round(stats.basicAttackDMG * 10) / 10
    stats.heavyAttackDMG = Math.round(stats.heavyAttackDMG * 10) / 10
    stats.resonanceSkillDMG = Math.round(stats.resonanceSkillDMG * 10) / 10
    stats.resonanceLiberationDMG = Math.round(stats.resonanceLiberationDMG * 10) / 10

    return stats
  }

  const calculateMaterials = () => {
    const characterMats = []
    const weaponMats = []
    const skillMats = []

    // Character ascension materials
    if (characterLevel[0] > 20) {
      characterMats.push({ name: "LF Whisperin Core", amount: Math.floor(characterLevel[0] / 20) * 5 })
      characterMats.push({ name: "Shell Credits", amount: characterLevel[0] * 1000 })
    }

    // Weapon ascension materials
    if (weaponLevel[0] > 20) {
      weaponMats.push({ name: "Crude Ring", amount: Math.floor(weaponLevel[0] / 20) * 3 })
    }

    // Skill upgrade materials
    const totalSkillLevels =
      skillLevels.basic[0] + skillLevels.skill[0] + skillLevels.liberation[0] + skillLevels.intro[0]
    if (totalSkillLevels > 4) {
      skillMats.push({ name: "Waveworn Residue 210", amount: totalSkillLevels * 2 })
    }

    return { characterMats, weaponMats, skillMats }
  }

  const getActiveEchoSet = () => {
    if (!echoConfiguration?.set) return null
    return echoSets.find((set) => set.id === echoConfiguration.set)
  }

  const stats = calculateDetailedStats()
  const materialNeeds = calculateMaterials()
  const activeEchoSet = getActiveEchoSet()

  if (!currentResonator) return null

  const elementGradient = getElementColor(currentResonator.element)
  const elementBg = getElementBgColor(currentResonator.element)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Build Simulator</h1>
          <p className="text-slate-300">Create and optimize your resonator builds</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Build Configuration */}
          <div className="space-y-6">
            {/* Resonator Selection */}
            <Card className={`${elementBg} border-2 border-slate-600`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${elementGradient} flex items-center justify-center`}
                  >
                    <span className="text-white font-bold text-lg">{currentResonator.name[0]}</span>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-900">{currentResonator.name}</div>
                    <div className="text-sm text-slate-600">
                      {currentResonator.element} • {currentResonator.weapon}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedResonator} onValueChange={setSelectedResonator}>
                  <SelectTrigger className="bg-white/80 border-slate-400">
                    <SelectValue placeholder="Select a resonator" />
                  </SelectTrigger>
                  <SelectContent>
                    {resonators.map((resonator) => (
                      <SelectItem key={resonator.id} value={resonator.id}>
                        <div className="flex items-center gap-2">
                          <span>{resonator.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {resonator.element}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Tabs defaultValue="character" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-600">
                <TabsTrigger value="character" className="text-white data-[state=active]:bg-slate-700">
                  Character
                </TabsTrigger>
                <TabsTrigger value="echoes" className="text-white data-[state=active]:bg-slate-700">
                  Echo Sets
                </TabsTrigger>
              </TabsList>

              <TabsContent value="character" className="space-y-6">
                {/* Level Configuration */}
                <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white">
                  <CardHeader>
                    <CardTitle className="text-white">Level Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-200">Character Level</label>
                        <span className="text-sm text-slate-400">{characterLevel[0]}/90</span>
                      </div>
                      <Slider
                        value={characterLevel}
                        onValueChange={setCharacterLevel}
                        max={90}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-200">Weapon Level</label>
                        <span className="text-sm text-slate-400">{weaponLevel[0]}/90</span>
                      </div>
                      <Slider
                        value={weaponLevel}
                        onValueChange={setWeaponLevel}
                        max={90}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Weapon Selection */}
                <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white">
                  <CardHeader>
                    <CardTitle className="text-white">Weapon Selection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedWeapon} onValueChange={setSelectedWeapon}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Select a weapon" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {availableWeapons.map((weapon) => (
                          <SelectItem key={weapon.id} value={weapon.id} className="text-white hover:bg-slate-700">
                            <div className="flex items-center gap-2">
                              <span>{weapon.name}</span>
                              <div className="flex">
                                {Array.from({ length: weapon.rarity }).map((_, i) => (
                                  <span key={i} className="text-yellow-400 text-xs">
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedWeapon && (
                      <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                        {(() => {
                          const weapon = weapons.find((w) => w.id === selectedWeapon)
                          return weapon ? (
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-slate-200">Base ATK:</span>
                                <span className="text-sm text-white">{weapon.baseAttack}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-slate-200">{weapon.subStat}:</span>
                                <span className="text-sm text-white">
                                  {weapon.subStatValue}
                                  {weapon.subStat.includes("%") ? "%" : ""}
                                </span>
                              </div>
                              <div className="text-xs text-slate-300 mt-2 p-2 bg-slate-700/50 rounded">
                                {weapon.passive}
                              </div>
                            </div>
                          ) : null
                        })()}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Skill Levels */}
                <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white">
                  <CardHeader>
                    <CardTitle className="text-white">Skill Levels</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-200">Basic Attack</label>
                        <span className="text-sm text-slate-400">{skillLevels.basic[0]}/10</span>
                      </div>
                      <Slider
                        value={skillLevels.basic}
                        onValueChange={(value) => setSkillLevels((prev) => ({ ...prev, basic: value }))}
                        max={10}
                        min={1}
                        step={1}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-200">Resonance Skill</label>
                        <span className="text-sm text-slate-400">{skillLevels.skill[0]}/10</span>
                      </div>
                      <Slider
                        value={skillLevels.skill}
                        onValueChange={(value) => setSkillLevels((prev) => ({ ...prev, skill: value }))}
                        max={10}
                        min={1}
                        step={1}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-200">Liberation</label>
                        <span className="text-sm text-slate-400">{skillLevels.liberation[0]}/10</span>
                      </div>
                      <Slider
                        value={skillLevels.liberation}
                        onValueChange={(value) => setSkillLevels((prev) => ({ ...prev, liberation: value }))}
                        max={10}
                        min={1}
                        step={1}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-200">Intro Skill</label>
                        <span className="text-sm text-slate-400">{skillLevels.intro[0]}/10</span>
                      </div>
                      <Slider
                        value={skillLevels.intro}
                        onValueChange={(value) => setSkillLevels((prev) => ({ ...prev, intro: value }))}
                        max={10}
                        min={1}
                        step={1}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="echoes" className="space-y-6">
                <EchoSetSelector echoConfiguration={echoConfiguration} onEchoChange={setEchoConfiguration} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Side - Build Results */}
          <div className="space-y-6">
            <BuildStats stats={stats} echoSet={activeEchoSet} materialNeeds={materialNeeds} />
          </div>
        </div>
      </div>
    </div>
  )
}
