'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { getGames } from '@/lib/axios/backendApi'
import { useQuery } from '@tanstack/react-query'
import GameDetail from '@/lib/types/gameDetail'
import ecoCodes from '../../games/eco_codes.json'

interface OpeningStats {
  totalGames: number
  whiteWins: number
  whiteLosses: number
  whiteDraws: number
  blackWins: number
  blackLosses: number
  blackDraws: number
  gamesByYear: Record<string, number>
}

function calculateStats(games: GameDetail[]): OpeningStats {
  const stats: OpeningStats = {
    totalGames: games.length,
    whiteWins: 0,
    whiteLosses: 0,
    whiteDraws: 0,
    blackWins: 0,
    blackLosses: 0,
    blackDraws: 0,
    gamesByYear: {}
  }

  games.forEach(game => {
    // Count results
    if (game.result === '1-0') {
      stats.whiteWins++
      stats.blackLosses++
    } else if (game.result === '0-1') {
      stats.whiteLosses++
      stats.blackWins++
    } else if (game.result === '1/2-1/2') {
      stats.whiteDraws++
      stats.blackDraws++
    }

    // Count by year
    if (game.date) {
      const year = game.date.split('.')[0]
      stats.gamesByYear[year] = (stats.gamesByYear[year] || 0) + 1
    }
  })

  return stats
}

export default function OpeningStatistics() {
  const [selectedEcoCode, setSelectedEcoCode] = useState<string>('')

  const ecoOptions = useMemo(
    () => [...ecoCodes].sort((a, b) => a.eco_code.localeCompare(b.eco_code)),
    []
  )

  const selectedOpening = useMemo(
    () => ecoOptions.find(o => o.eco_code === selectedEcoCode),
    [selectedEcoCode, ecoOptions]
  )

  const { data: gamesData, isLoading } = useQuery({
    queryKey: ['opening-stats', selectedEcoCode],
    queryFn: async () => {
      if (!selectedEcoCode) return null
      const result = await getGames('games/', { eco_code: selectedEcoCode })
      return result
    },
    enabled: !!selectedEcoCode,
  })

  const stats = useMemo(
    () => (gamesData?.results ? calculateStats(gamesData.results) : null),
    [gamesData]
  )

  const whiteWinRate = stats ? ((stats.whiteWins / stats.totalGames) * 100).toFixed(1) : 0
  const whiteDrawRate = stats ? ((stats.whiteDraws / stats.totalGames) * 100).toFixed(1) : 0
  const whiteLossRate = stats ? ((stats.whiteLosses / stats.totalGames) * 100).toFixed(1) : 0

  const blackWinRate = stats ? ((stats.blackWins / stats.totalGames) * 100).toFixed(1) : 0
  const blackDrawRate = stats ? ((stats.blackDraws / stats.totalGames) * 100).toFixed(1) : 0
  const blackLossRate = stats ? ((stats.blackLosses / stats.totalGames) * 100).toFixed(1) : 0

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Opening Statistics</CardTitle>
          <CardDescription>
            Analyze opening performance including usage over time and winning percentages for both sides
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Opening Selection */}
          <div className="space-y-2">
            <Label htmlFor="eco-code">Select Opening</Label>
            <Select value={selectedEcoCode} onValueChange={setSelectedEcoCode}>
              <SelectTrigger id="eco-code">
                <SelectValue placeholder="Choose an opening to analyze" />
              </SelectTrigger>
              <SelectContent>
                {ecoOptions.map((option) => (
                  <SelectItem key={option.eco_code} value={option.eco_code}>
                    {option.eco_code} - {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Statistics Display */}
          {selectedOpening && stats && (
            <div className="space-y-6">
              {/* Opening Info */}
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h3 className="font-semibold text-lg">{selectedOpening.eco_code}</h3>
                <p className="text-sm text-muted-foreground">{selectedOpening.name}</p>
                <Badge className="mt-2">{stats.totalGames} games</Badge>
              </div>

              {/* White Statistics */}
              <div className="space-y-3">
                <h4 className="font-semibold text-white">White Performance</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-muted-foreground">Wins</p>
                    <p className="text-2xl font-bold text-green-700">{whiteWinRate}%</p>
                    <p className="text-xs text-muted-foreground mt-1">{stats.whiteWins} games</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs text-muted-foreground">Draws</p>
                    <p className="text-2xl font-bold text-yellow-700">{whiteDrawRate}%</p>
                    <p className="text-xs text-muted-foreground mt-1">{stats.whiteDraws} games</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-xs text-muted-foreground">Losses</p>
                    <p className="text-2xl font-bold text-red-700">{whiteLossRate}%</p>
                    <p className="text-xs text-muted-foreground mt-1">{stats.whiteLosses} games</p>
                  </div>
                </div>
              </div>

              {/* Black Statistics */}
              <div className="space-y-3">
                <h4 className="font-semibold">Black Performance</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-muted-foreground">Wins</p>
                    <p className="text-2xl font-bold text-green-700">{blackWinRate}%</p>
                    <p className="text-xs text-muted-foreground mt-1">{stats.blackWins} games</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs text-muted-foreground">Draws</p>
                    <p className="text-2xl font-bold text-yellow-700">{blackDrawRate}%</p>
                    <p className="text-xs text-muted-foreground mt-1">{stats.blackDraws} games</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-xs text-muted-foreground">Losses</p>
                    <p className="text-2xl font-bold text-red-700">{blackLossRate}%</p>
                    <p className="text-xs text-muted-foreground mt-1">{stats.blackLosses} games</p>
                  </div>
                </div>
              </div>

              {/* Games by Year */}
              {Object.keys(stats.gamesByYear).length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Usage by Year</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
                    {Object.entries(stats.gamesByYear)
                      .sort(([yearA], [yearB]) => yearB.localeCompare(yearA))
                      .map(([year, count]) => (
                        <div
                          key={year}
                          className="p-2 bg-slate-100 rounded border text-center"
                        >
                          <p className="text-xs text-muted-foreground">{year}</p>
                          <p className="text-lg font-semibold">{count}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!selectedEcoCode && (
            <div className="text-center py-8 text-muted-foreground">
              Select an opening to view statistics
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              Loading statistics...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
  
}