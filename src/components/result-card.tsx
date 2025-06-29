
import { AlphaGenomeResult } from '@/types'
import { Dna, AlertCircle, TrendingUp } from 'lucide-react'

interface ResultCardProps {
  result: AlphaGenomeResult
  index: number
}

const getRiskConfig = (pathogenicity: number) => {
  if (pathogenicity > 0.7) return { label: 'High', color: 'text-red-500' };
  if (pathogenicity > 0.3) return { label: 'Moderate', color: 'text-yellow-500' };
  return { label: 'Low', color: 'text-green-500' };
};

export function ResultCard({ result }: ResultCardProps) {
  if (result.error) {
    return (
      <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 flex items-center gap-4">
        <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
        <div>
          <p className="font-bold text-lg text-white">{result.rsId}</p>
          <p className="text-sm text-gray-400">Error: {result.error}</p>
        </div>
      </div>
    )
  }

  if (!result.predictions) return null;

  const risk = getRiskConfig(result.predictions.pathogenicity || 0);
  const pathogenicityPercent = (result.predictions.pathogenicity || 0) * 100;

  return (
    <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 transition-colors hover:border-blue-500/50">
      <div className="flex justify-between items-start mb-4">
        <p className="font-bold text-xl text-white">{result.rsId}</p>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-black/30 ${risk.color}`}>
          {risk.label} Risk
        </span>
      </div>

      <div className="space-y-4">
        <div>
            <p className="text-sm text-gray-400">Pathogenicity</p>
            <p className={`text-2xl font-bold ${risk.color}`}>{pathogenicityPercent.toFixed(1)}%</p>
        </div>

        <div className="text-sm">
            <p className="text-gray-400">Genotype</p>
            <p className="text-white font-mono">{result.genotype} at {result.chromosome}:{result.position}</p>
        </div>

        <div className="text-sm">
            <p className="text-gray-400">Predicted Effect</p>
            <p className="text-white">{result.predictions.effect || 'N/A'}</p>
        </div>
      </div>
    </div>
  )
}
