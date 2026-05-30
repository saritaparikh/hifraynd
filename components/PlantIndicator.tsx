interface PlantIndicatorProps {
  lastContactDate?: Date
  cadenceDays: number | null
  nextReachOutDate: string | null
}

type PlantState = 'thriving' | 'needs_water' | 'overdue' | 'dormant'

function determineState(
  lastContactDate: Date | undefined,
  cadenceDays: number | null,
  nextReachOutDate: string | null
): PlantState {
  const score =
    cadenceDays && lastContactDate
      ? Math.max(
          0,
          1 -
            Math.floor((Date.now() - lastContactDate.getTime()) / 86_400_000) /
              cadenceDays
        )
      : null

  if (score === null) {
    if (nextReachOutDate) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const [year, month, day] = nextReachOutDate.split('-').map(Number)
      const date = new Date(year, month - 1, day)
      if (date.getTime() < today.getTime()) return 'overdue'
    }
    return 'dormant'
  }
  if (score >= 0.6) return 'thriving'
  if (score >= 0.2) return 'needs_water'
  return 'overdue'
}

export default function PlantIndicator({
  lastContactDate,
  cadenceDays,
  nextReachOutDate,
}: PlantIndicatorProps) {
  const state = determineState(lastContactDate, cadenceDays, nextReachOutDate)
  const soilFill = state === 'overdue' ? '#8c7a5c' : '#5c4a34'

  return (
    <svg width="72" height="72" viewBox="-30 18 60 135" aria-hidden="true">
      <g>
        <path d="M-22 115 L-28 148 L28 148 L22 115 Z" fill="#c96a28" />
        <rect x="-26" y="107" width="52" height="12" rx="3" fill="#9c4f1c" />
        <ellipse cx="0" cy="107" rx="23" ry="5" fill={soilFill} />
        {state === 'thriving' && <Thriving />}
        {state === 'needs_water' && <NeedsWater />}
        {state === 'overdue' && <Overdue />}
        {state === 'dormant' && <Dormant />}
      </g>
    </svg>
  )
}

function Thriving() {
  return (
    <>
      <line x1="0" y1="107" x2="0" y2="55" stroke="#5a7a3e" strokeWidth="3" strokeLinecap="round" />
      <line x1="0" y1="85" x2="-28" y2="68" stroke="#5a7a3e" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="0" y1="72" x2="28" y2="55" stroke="#5a7a3e" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="0" y1="95" x2="22" y2="82" stroke="#5a7a3e" strokeWidth="2" strokeLinecap="round" />
      <path d="M0 22 C12 32 12 54 0 58 C-12 54 -12 32 0 22 Z" fill="#5a7a3e" />
      <path
        d="M-28 56 C-16 60 -12 76 -18 80 C-28 78 -36 62 -28 56 Z"
        fill="#456030"
        transform="rotate(15 -24 68)"
      />
      <path
        d="M28 42 C40 46 42 62 36 66 C26 64 22 48 28 42 Z"
        fill="#5a7a3e"
        transform="rotate(-10 34 54)"
      />
      <path
        d="M22 70 C32 72 34 84 28 88 C20 86 16 74 22 70 Z"
        fill="#456030"
        transform="rotate(-20 26 79)"
      />
      <path
        d="M-8 44 C-2 48 -2 58 -6 60 C-12 58 -14 48 -8 44 Z"
        fill="#98b472"
        transform="rotate(10 -8 52)"
      />
      <path
        d="M8 52 C14 56 14 66 10 68 C4 66 2 56 8 52 Z"
        fill="#98b472"
        transform="rotate(-5 10 60)"
      />
    </>
  )
}

function NeedsWater() {
  return (
    <>
      <path
        d="M0 107 Q4 85 2 58"
        stroke="#5a7a3e"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M2 85 Q-10 82 -26 95"
        stroke="#5a7a3e"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M2 70 Q16 67 30 80"
        stroke="#5a7a3e"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M2 40 C14 50 13 68 2 72 C-10 68 -10 50 2 40 Z" fill="#456030" />
      <path
        d="M-26 85 C-18 87 -16 99 -20 103 C-28 101 -32 89 -26 85 Z"
        fill="#5a7a3e"
        transform="rotate(50 -24 94)"
      />
      <path
        d="M30 70 C38 72 38 84 33 88 C25 86 23 74 30 70 Z"
        fill="#456030"
        transform="rotate(-45 31 79)"
      />
    </>
  )
}

function Overdue() {
  return (
    <>
      <path
        d="M0 107 Q-8 88 -10 72 Q-8 58 -2 50"
        stroke="#6f3612"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M-6 85 Q-20 90 -30 108"
        stroke="#6f3612"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M-7 70 Q8 75 18 95"
        stroke="#6f3612"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M-30 102 C-24 104 -22 112 -26 116 C-32 114 -36 106 -30 102 Z"
        fill="#6f3612"
        transform="rotate(55 -28 109)"
      />
      <path
        d="M18 88 C24 90 24 98 20 102 C14 100 12 92 18 88 Z"
        fill="#6f3612"
        transform="rotate(-50 19 95)"
      />
      <path d="M-2 38 C4 44 3 54 -1 56 C-6 54 -7 44 -2 38 Z" fill="#8c7a5c" />
    </>
  )
}

function Dormant() {
  return (
    <>
      <line x1="0" y1="107" x2="0" y2="90" stroke="#8aab5e" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M0 80 C5 83 5 90 1 91 C-3 90 -4 83 0 80 Z"
        fill="#98b472"
        transform="rotate(-25 0 86)"
      />
      <path
        d="M0 82 C-5 85 -5 92 -1 93 C3 92 4 85 0 82 Z"
        fill="#98b472"
        transform="rotate(25 0 88)"
      />
    </>
  )
}
