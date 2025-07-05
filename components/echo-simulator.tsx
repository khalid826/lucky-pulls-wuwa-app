"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dice6, RefreshCw } from "lucide-react"
import { echoes, echoMainStatRanges, echoSubStatRanges } from "@/lib/data"
import { getStatIcon } from "@/lib/stat-icons"

export default function EchoSimulator({ selectedEchoes, onEchoChange }) {
  const [echoSlots, setEchoSlots] = useState([
    { cost: 4, echo: null, mainStat: null, mainStatValue: 0, subStats: [] },
    { cost: 3, echo: null, mainStat: null, mainStatValue: 0, subStats: [] },
    { cost: 3, echo: null, mainStat: null, mainStatValue: 0, subStats: [] },
    { cost: 1, echo: null, mainStat: null, mainStatValue: 0, subStats: [] },
    { cost: 1, echo: null, mainStat: null, mainStatValue: 0, subStats: [] },
  ])

  const generateRandomValue = (min, max, isInteger = false) => {
    const value = Math.random() * (max - min) + min
    return isInteger ? Math.floor(value) : Math.round(value * 10) / 10
  }

  const rollSubStats = (availableSubStats, count = 4) => {
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

    if (field === "echo") {
      const selectedEcho = echoes.find((e) => e.id === value)
      if (selectedEcho) {
        // Reset main stat when echo changes
        newSlots[slotIndex].mainStat = null
        newSlots[slotIndex].mainStatValue = 0
        newSlots[slotIndex].subStats = []
      }
    }

    if (field === "mainStat") {
      const cost = newSlots[slotIndex].cost
      const range = echoMainStatRanges[cost]?.[value]
      if (range) {
        newSlots[slotIndex].mainStatValue = generateRandomValue(range.min, range.max)
      }
    }

    setEchoSlots(newSlots)
    onEchoChange(newSlots)
  }

  const rollSubStatsForSlot = (slotIndex) => {
    const slot = echoSlots[slotIndex]
    const selectedEcho = echoes.find((e) => e.id === slot.echo)

    if (selectedEcho) {
      const availableSubStats = selectedEcho.subStats.filter((stat) => stat !== slot.mainStat)
      const newSubStats = rollSubStats(availableSubStats)
      updateEchoSlot(slotIndex, "subStats", newSubStats)
    }
  }

  const getAvailableEchoes = (cost) => {
    return echoes.filter((echo) => echo.cost === cost)
  }

  const getAvailableMainStats = (cost) => {
    return Object.keys(echoMainStatRanges[cost] || {})
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Echo Configuration</CardTitle>
        <CardDescription>Configure your echo loadout with main stats and substats</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {echoSlots.map((slot, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Slot {index + 1}</h4>
              <Badge variant="outline">{slot.cost}-Cost</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Echo</label>
                <Select value={slot.echo || ""} onValueChange={(value) => updateEchoSlot(index, "echo", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select echo" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableEchoes(slot.cost).map((echo) => (
                      <SelectItem key={echo.id} value={echo.id}>
                        <div className="flex items-center gap-2">
                          <span>{echo.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {echo.element}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Main Stat</label>
                <Select
                  value={slot.mainStat || ""}
                  onValueChange={(value) => updateEchoSlot(index, "mainStat", value)}
                  disabled={!slot.echo}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select main stat" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableMainStats(slot.cost).map((stat) => (
                      <SelectItem key={stat} value={stat}>
                        {stat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {slot.mainStat && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-700">{slot.mainStat}</span>
                  <span className="text-blue-800 font-bold">
                    {slot.mainStatValue}
                    {slot.mainStat.includes("%") ? "%" : ""}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Sub Stats</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => rollSubStatsForSlot(index)}
                  disabled={!slot.echo}
                  className="flex items-center gap-1"
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
                      <div key={subIndex} className="p-2 bg-gray-50 rounded text-sm flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <StatIcon className="w-3 h-3 text-gray-600" />
                          <span className="text-xs">{subStat.stat}</span>
                        </div>
                        <span className="font-medium text-xs">
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
        ))}

        <Separator />

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              echoSlots.forEach((_, index) => {
                if (echoSlots[index].echo) {
                  rollSubStatsForSlot(index)
                }
              })
            }}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Roll All Substats
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
