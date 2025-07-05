"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dice6, RefreshCw } from "lucide-react"
import { echoSets, echoMainStatRanges, echoSubStatRanges } from "@/lib/data"
import { getStatIcon, getSetColor } from "@/lib/stat-icons"

export default function EchoSetSelector({ echoConfiguration, onEchoChange }) {
  const [selectedSet, setSelectedSet] = useState("")
  const [echoSlots, setEchoSlots] = useState([
    { cost: 4, mainStat: null, mainStatValue: 0, subStats: [] },
    { cost: 3, mainStat: null, mainStatValue: 0, subStats: [] },
    { cost: 3, mainStat: null, mainStatValue: 0, subStats: [] },
    { cost: 1, mainStat: null, mainStatValue: 0, subStats: [] },
    { cost: 1, mainStat: null, mainStatValue: 0, subStats: [] },
  ])

  const generateRandomValue = (min, max, isInteger = false) => {
    const value = Math.random() * (max - min) + min
    return isInteger ? Math.floor(value) : Math.round(value * 10) / 10
  }

  const rollSubStats = (count = 4) => {
    const availableSubStats = Object.keys(echoSubStatRanges)
    const shuffled = [...availableSubStats].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count).map((stat) => {
      const range = echoSubStatRanges[stat]
      const isInteger = stat === "ATK" || stat === "HP" || stat === "DEF"
      return {
        stat,
        value: generateRandomValue(range.min, range.max, isInteger),
      }
    })
  }

  const updateEchoSlot = (slotIndex, field, value) => {
    const newSlots = [...echoSlots]
    newSlots[slotIndex] = { ...newSlots[slotIndex], [field]: value }

    if (field === "mainStat") {
      const cost = newSlots[slotIndex].cost
      const range = echoMainStatRanges[cost]?.[value]
      if (range) {
        newSlots[slotIndex].mainStatValue = generateRandomValue(range.min, range.max)
      }
    }

    setEchoSlots(newSlots)
    onEchoChange({ set: selectedSet, slots: newSlots })
  }

  const rollSubStatsForSlot = (slotIndex) => {
    const newSubStats = rollSubStats()
    updateEchoSlot(slotIndex, "subStats", newSubStats)
  }

  const getAvailableMainStats = (cost) => {
    if (!selectedSet) return []
    const set = echoSets.find((s) => s.id === selectedSet)
    return set?.mainStats[cost] || []
  }

  const selectedSetData = echoSets.find((s) => s.id === selectedSet)

  return (
    <div className="space-y-6">
      {/* Echo Set Selection */}
      <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Echo Set Selection</CardTitle>
          <CardDescription className="text-slate-300">Choose an echo set to configure your build</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedSet} onValueChange={setSelectedSet}>
            <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
              <SelectValue placeholder="Select an echo set" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {echoSets.map((set) => (
                <SelectItem key={set.id} value={set.id} className="text-white hover:bg-slate-700">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getSetColor(set.name)}`} />
                    <span className="font-medium">{set.name}</span>
                    <Badge variant="outline" className="text-xs border-slate-500 text-slate-300">
                      {set.element}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedSetData && (
            <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getSetColor(selectedSetData.name)}`} />
                  <h3 className="font-bold text-lg text-white">{selectedSetData.name}</h3>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                    <div className="text-sm font-medium text-slate-200 mb-1">2-Piece Bonus</div>
                    <div className="text-sm text-slate-300">{selectedSetData.bonuses["2pc"]}</div>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                    <div className="text-sm font-medium text-slate-200 mb-1">5-Piece Bonus</div>
                    <div className="text-sm text-slate-300">{selectedSetData.bonuses["5pc"]}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Echo Configuration */}
      {selectedSet && (
        <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">Echo Configuration</CardTitle>
            <CardDescription className="text-slate-300">
              Configure main stats and substats for each echo slot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {echoSlots.map((slot, index) => (
              <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-white">Echo Slot {index + 1}</h4>
                  <Badge variant="outline" className="border-slate-500 text-slate-300">
                    {slot.cost}-Cost
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-slate-200">Main Stat</label>
                    <Select
                      value={slot.mainStat || ""}
                      onValueChange={(value) => updateEchoSlot(index, "mainStat", value)}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select main stat" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {getAvailableMainStats(slot.cost).map((stat) => (
                          <SelectItem key={stat} value={stat} className="text-white hover:bg-slate-700">
                            <div className="flex items-center gap-2">
                              {(() => {
                                const StatIcon = getStatIcon(stat)
                                return <StatIcon className="w-4 h-4" />
                              })()}
                              <span>{stat}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {slot.mainStat && (
                    <div className="p-3 bg-blue-900/30 rounded-lg border border-blue-700/50">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const StatIcon = getStatIcon(slot.mainStat)
                            return <StatIcon className="w-4 h-4 text-blue-300" />
                          })()}
                          <span className="font-medium text-blue-200">{slot.mainStat}</span>
                        </div>
                        <span className="text-blue-100 font-bold">
                          {slot.mainStatValue}
                          {slot.mainStat.includes("%") ? "%" : ""}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-200">Sub Stats</label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => rollSubStatsForSlot(index)}
                        className="flex items-center gap-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                      >
                        <Dice6 className="w-3 h-3" />
                        Roll
                      </Button>
                    </div>

                    {slot.subStats.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {slot.subStats.map((subStat, subIndex) => {
                          const StatIcon = getStatIcon(subStat.stat)
                          return (
                            <div
                              key={subIndex}
                              className="p-2 bg-slate-700/50 rounded border border-slate-600 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-1">
                                <StatIcon className="w-3 h-3 text-slate-400" />
                                <span className="text-xs text-slate-300">{subStat.stat}</span>
                              </div>
                              <span className="font-medium text-xs text-white">
                                {subStat.value}
                                {subStat.stat.includes("%") ? "%" : ""}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex gap-2 pt-4 border-t border-slate-600">
              <Button
                variant="outline"
                onClick={() => {
                  echoSlots.forEach((_, index) => {
                    rollSubStatsForSlot(index)
                  })
                }}
                className="flex items-center gap-2 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                <RefreshCw className="w-4 h-4" />
                Roll All Substats
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
