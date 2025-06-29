'use client'

import { AlphaGenomeResult } from '@/types'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { Card } from '@/components/ui/card'

interface VariantVisualizationProps {
  results: AlphaGenomeResult[]
}

export function VariantVisualization({ results }: VariantVisualizationProps) {
  // Filter out results with errors
  const validResults = results.filter(r => !r.error && r.predictions)

  // Risk distribution data
  const riskDistribution = [
    { name: 'High Risk', value: validResults.filter(r => (r.predictions?.pathogenicity || 0) > 0.7).length, color: '#ef4444' },
    { name: 'Moderate Risk', value: validResults.filter(r => (r.predictions?.pathogenicity || 0) > 0.3 && (r.predictions?.pathogenicity || 0) <= 0.7).length, color: '#eab308' },
    { name: 'Low Risk', value: validResults.filter(r => (r.predictions?.pathogenicity || 0) <= 0.3).length, color: '#22c55e' }
  ]

  // Chromosome distribution
  const chromosomeData = validResults.reduce((acc, result) => {
    const chr = result.chromosome
    if (!acc[chr]) acc[chr] = 0
    acc[chr]++
    return acc
  }, {} as Record<string, number>)

  const chromosomeChartData = Object.entries(chromosomeData)
    .map(([chr, count]) => ({ chromosome: `Chr${chr}`, count }))
    .sort((a, b) => {
      const aNum = parseInt(a.chromosome.replace('Chr', ''))
      const bNum = parseInt(b.chromosome.replace('Chr', ''))
      return aNum - bNum
    })

  // Top pathogenic variants
  const topPathogenic = validResults
    .sort((a, b) => (b.predictions?.pathogenicity || 0) - (a.predictions?.pathogenicity || 0))
    .slice(0, 5)
    .map(r => ({
      name: r.rsId,
      pathogenicity: ((r.predictions?.pathogenicity || 0) * 100).toFixed(1),
      confidence: ((r.predictions?.confidence || 0) * 100).toFixed(0)
    }))

  // Confidence vs Pathogenicity scatter data
  const scatterData = validResults.map(r => ({
    x: (r.predictions?.confidence || 0) * 100,
    y: (r.predictions?.pathogenicity || 0) * 100,
    rsId: r.rsId
  }))

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="space-y-8 mt-12">
      <h2 className="text-3xl font-bold text-center mb-8">Genomic Analysis Insights</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Distribution Pie Chart */}
        <Card className="bg-gray-900/50 p-6 border-gray-800">
          <h3 className="text-xl font-semibold mb-4 text-white">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => <span className="text-gray-300">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Chromosome Distribution */}
        <Card className="bg-gray-900/50 p-6 border-gray-800">
          <h3 className="text-xl font-semibold mb-4 text-white">Variants by Chromosome</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chromosomeChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="chromosome" 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Bar dataKey="count" fill="#00BFFF" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Pathogenic Variants */}
        <Card className="bg-gray-900/50 p-6 border-gray-800">
          <h3 className="text-xl font-semibold mb-4 text-white">Top Risk Variants</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={topPathogenic}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <PolarRadiusAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Radar name="Pathogenicity %" dataKey="pathogenicity" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              <Radar name="Confidence %" dataKey="confidence" stroke="#00BFFF" fill="#00BFFF" fillOpacity={0.3} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Legend 
                formatter={(value) => <span className="text-gray-300">{value}</span>}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Summary Statistics */}
        <Card className="bg-gray-900/50 p-6 border-gray-800">
          <h3 className="text-xl font-semibold mb-4 text-white">Analysis Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <span className="text-gray-400">Total Variants Analyzed</span>
              <span className="text-2xl font-bold text-white">{validResults.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <span className="text-gray-400">Average Pathogenicity</span>
              <span className="text-2xl font-bold text-blue-400">
                {(validResults.reduce((sum, r) => sum + (r.predictions?.pathogenicity || 0), 0) / validResults.length * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <span className="text-gray-400">High Risk Variants</span>
              <span className="text-2xl font-bold text-red-500">
                {riskDistribution[0].value}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <span className="text-gray-400">Average Confidence</span>
              <span className="text-2xl font-bold text-green-400">
                {(validResults.reduce((sum, r) => sum + (r.predictions?.confidence || 0), 0) / validResults.length * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}