import { AlphaGenomeResult } from '@/types'
import { Dna, AlertCircle, TrendingUp, CheckCircle, Info } from 'lucide-react'

interface ResultCardProps {
  result: AlphaGenomeResult
  index: number
}

const getRiskConfig = (pathogenicity: number) => {
  if (pathogenicity > 0.7) {
    return { label: 'High Risk', color: 'text-blue-400', gradient: 'from-blue-500/20 to-slate-800/10' };
  }
  if (pathogenicity > 0.3) {
    return { label: 'Moderate Risk', color: 'text-yellow-400', gradient: 'from-yellow-500/20 to-slate-800/10' };
  }
  return { label: 'Low Risk', color: 'text-green-400', gradient: 'from-green-500/20 to-slate-800/10' };
};

export function ResultCard({ result, index }: ResultCardProps) {
  if (result.error) {
    return (
      <div className="glassmorphism rounded-lg p-5 flex items-center gap-4 edge-hue">
        <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
        <div>
          <p className="font-bold text-lg text-white">{result.rsId}</p>
          <p className="text-sm text-slate-400">Error: {result.error}</p>
        </div>
      </div>
    )
  }

  if (!result.predictions) return null;

  const risk = getRiskConfig(result.predictions.pathogenicity || 0);
  const pathogenicityPercent = (result.predictions.pathogenicity || 0) * 100;

  return (
    <div 
      className={`glassmorphism rounded-lg p-6 bg-gradient-to-br ${risk.gradient} edge-hue`}
    >
      <div className="flex justify-between items-start mb-4">
        <p className="font-bold text-xl text-white">{result.rsId}</p>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${risk.color} bg-black/20`}>
          {risk.label}
        </span>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
            <div className="flex justify-between items-baseline">
                <p className="text-sm text-slate-300">Pathogenicity Score</p>
                <p className={`text-2xl font-bold ${risk.color}`}>{pathogenicityPercent.toFixed(1)}%</p>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2.5">
                <div className={`bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full`} style={{ width: `${pathogenicityPercent}%` }} />
            </div>
        </div>

        <div className="flex items-start gap-3 text-sm">
            <Dna className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-300">
                <span className="font-semibold text-white">Genotype:</span> {result.genotype} at Chr{result.chromosome}:{result.position}
            </p>
        </div>

        <div className="flex items-start gap-3 text-sm">
            <TrendingUp className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-300">
                <span className="font-semibold text-white">Predicted Effect:</span> {result.predictions.effect || 'N/A'}
            </p>
        </div>

        {result.predictions.confidence !== undefined && (
            <div className="flex items-center gap-3 text-sm pt-3 border-t border-slate-700/50">
                <Info className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <p className="text-slate-300">
                    <span className="font-semibold text-white">Confidence:</span> {(result.predictions.confidence * 100).toFixed(0)}%
                </p>
            </div>
        )}
      </div>
    </div>
  )
}