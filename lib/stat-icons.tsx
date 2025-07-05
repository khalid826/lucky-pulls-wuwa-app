import {
  Heart,
  Sword,
  Shield,
  Target,
  Zap,
  Battery,
  Plus,
  Sparkles,
  Swords,
  Hammer,
  Wand2,
  Crown,
  TrendingUp,
  Activity,
} from "lucide-react"

export const StatIcons = {
  HP: Heart,
  ATK: Sword,
  DEF: Shield,
  "Crit Rate": Target,
  "Crit DMG": Sparkles,
  "Energy Regen": Battery,
  "Healing Bonus%": Plus,
  "Basic Attack DMG%": Swords,
  "Heavy Attack DMG%": Hammer,
  "Resonance Skill DMG%": Wand2,
  "Resonance Liberation DMG%": Crown,
  "All DMG Bonus%": TrendingUp,
  "Elemental DMG%": Zap,
  "Physical DMG%": Activity,
}

export const ElementColors = {
  Spectro: "from-yellow-400 via-yellow-500 to-amber-600",
  Aero: "from-emerald-400 via-green-500 to-teal-600",
  Electro: "from-purple-400 via-violet-500 to-indigo-600",
  Glacio: "from-cyan-400 via-blue-500 to-indigo-600",
  Fusion: "from-red-400 via-orange-500 to-red-600",
  Havoc: "from-gray-600 via-gray-700 to-gray-900",
}

export const ElementBgColors = {
  Spectro: "bg-gradient-to-br from-yellow-50 to-amber-100",
  Aero: "bg-gradient-to-br from-emerald-50 to-green-100",
  Electro: "bg-gradient-to-br from-purple-50 to-violet-100",
  Glacio: "bg-gradient-to-br from-cyan-50 to-blue-100",
  Fusion: "bg-gradient-to-br from-red-50 to-orange-100",
  Havoc: "bg-gradient-to-br from-gray-50 to-gray-100",
}

export const SetColors = {
  "Freezing Frost": "from-cyan-500 via-blue-600 to-indigo-700",
  "Molten Rift": "from-red-500 via-orange-600 to-red-700",
  "Void Thunder": "from-purple-500 via-violet-600 to-indigo-700",
  "Sierra Gale": "from-emerald-500 via-green-600 to-teal-700",
  "Celestial Light": "from-yellow-500 via-amber-600 to-orange-700",
  "Rejuvenating Glow": "from-pink-500 via-rose-600 to-pink-700",
  "Moonlit Clouds": "from-indigo-500 via-blue-600 to-purple-700",
  "Lingering Tunes": "from-teal-500 via-cyan-600 to-blue-700",
  "Empyrean Anthem": "from-violet-500 via-purple-600 to-indigo-700",
  "Frosty Resolve": "from-blue-500 via-cyan-600 to-teal-700",
}

export function getStatIcon(statName: string) {
  const cleanStatName = statName.replace("%", "%")
  return StatIcons[cleanStatName] || StatIcons[statName] || TrendingUp
}

export function getElementColor(element: string) {
  return ElementColors[element] || "from-gray-400 to-gray-600"
}

export function getElementBgColor(element: string) {
  return ElementBgColors[element] || "bg-gray-50"
}

export function getSetColor(setName: string) {
  return SetColors[setName] || "from-gray-400 to-gray-600"
}
