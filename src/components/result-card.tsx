import { AlertCircle, Activity, Dna, TrendingUp, Info } from 'lucide-react'
import { AlphaGenomeResult } from '@/types'
import { Progress } from '@/components/ui/progress'

interface ResultCardProps {
  result: AlphaGenomeResult
  index: number
}

export function ResultCard({ result, index }: ResultCardProps) {
  const getRiskLevel = (pathogenicity: number) => {
    if (pathogenicity > 0.7) return { label: 'High Risk', color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20' }
    if (pathogenicity > 0.3) return { label: 'Moderate Risk', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/20' }
    return { label: 'Low Risk', color: 'text-green-500', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/20' }
  }

  if (result.error) {
    return (
      <div className="border border-destructive/20 rounded-xl p-6 bg-destructive/5 animate-in fade-in-50 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{result.rsId}</p>
            <p className="text-sm text-muted-foreground mt-1">Error: {result.error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!result.predictions) {
    return null
  }

  const risk = getRiskLevel(result.predictions.pathogenicity || 0)
  const pathogenicityPercent = (result.predictions.pathogenicity || 0) * 100

  return (
    <div 
      className={`border ${risk.borderColor} rounded-xl p-6 ${risk.bgColor} hover:scale-[1.02] transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-5`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${risk.bgColor}`}>
              <Dna className={`w-5 h-5 ${risk.color}`} />
            </div>
            <div>
              <p className="font-bold text-lg">{result.rsId}</p>
              <p className="text-sm text-muted-foreground">
                Chr{result.chromosome}:{result.position.toLocaleString()} • {result.genotype}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${risk.bgColor} ${risk.color}`}>
            {risk.label}
          </div>
        </div>

        {/* Risk Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Pathogenicity Score</span>
            <span className={`text-lg font-bold ${risk.color}`}>{pathogenicityPercent.toFixed(1)}%</span>
          </div>
          <Progress value={pathogenicityPercent} className="h-2" />
        </div>

        {/* Effect Description */}
        <div className="flex items-start gap-2 pt-2">
          <Activity className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Predicted Effect</p>
            <p className="text-sm text-muted-foreground">{result.predictions.effect || 'No effect data available'}</p>
          </div>
        </div>

        {/* Confidence */}
        {result.predictions.confidence !== undefined && (
          <div className="flex items-center gap-2 pt-2 border-t border-primary/10">
            <Info className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Confidence: {(result.predictions.confidence * 100).toFixed(0)}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}