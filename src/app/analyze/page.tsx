'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { SNPParser } from '@/services/snp-parser'
import { AlphaGenomeAPI } from '@/services/alphagenome-api'
import { InputFormat, AlphaGenomeResult } from '@/types'
import { Loader2, ArrowRight, FileText } from 'lucide-react'
import { ResultCard } from '@/components/result-card'

const SAMPLE_DATA = {
  [InputFormat.VCF]: `##fileformat=VCFv4.2\n##reference=GRCh38\n#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tsample1\n1\t69869\trs548049170\tT\tC\t.\tPASS\t.\tGT\t1/1`, 
  [InputFormat.TWENTY_THREE_AND_ME]: `# rsid\tchromosome\tposition\tgenotype\nrs548049170\t1\t69869\tTT`, 
  [InputFormat.CUSTOM_TAB]: `rs548049170 1 69869 TT`
}

export default function Analyze() {
  const [input, setInput] = useState('')
  const [format, setFormat] = useState<InputFormat>(InputFormat.AUTO_DETECT)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AlphaGenomeResult[]>([])
  const { toast } = useToast()

  const handleAnalyze = async () => {
    setLoading(true)
    setResults([])
    try {
      const parseResult = SNPParser.parse(input, format)
      if (parseResult.snps.length === 0) {
        toast({ title: 'No valid SNPs found.', variant: 'destructive' })
        setLoading(false)
        return
      }
      const analysisResults = await AlphaGenomeAPI.analyzeSNPs(parseResult.snps)
      setResults(analysisResults)
    } catch (error) {
      toast({ title: 'Analysis Failed', description: (error as Error).message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const loadSampleData = () => {
    if(format !== InputFormat.AUTO_DETECT) {
        setInput(SAMPLE_DATA[format]);
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 container-mx">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tighter">Analysis Tool</h1>
        <p className="text-lg text-gray-400 mt-4">Paste your genetic data to begin. Our AI will analyze the provided SNPs and return predictions.</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select value={format} onValueChange={(value) => setFormat(value as InputFormat)}>
              <SelectTrigger className="h-12 text-base bg-black border-gray-700 focus:ring-blue-500">
                <SelectValue placeholder="Select Format" />
              </SelectTrigger>
              <SelectContent className="bg-black border-gray-800 text-white">
                <SelectItem value={InputFormat.AUTO_DETECT}>Auto-Detect</SelectItem>
                <SelectItem value={InputFormat.VCF}>VCF</SelectItem>
                <SelectItem value={InputFormat.TWENTY_THREE_AND_ME}>23andMe</SelectItem>
                <SelectItem value={InputFormat.CUSTOM_TAB}>Custom Tab</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadSampleData} className="h-12 border-gray-700 hover:bg-gray-800">
              <FileText className="mr-2 h-4 w-4"/> Load Sample
            </Button>
          </div>
          <Textarea
            placeholder="Your genetic data here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[300px] font-mono text-sm bg-black border-gray-700 focus:ring-2 focus:ring-blue-500 p-4 rounded-md w-full"
          />
          <div className="text-right mt-6">
            <Button onClick={handleAnalyze} disabled={loading || !input.trim()} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105">
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ArrowRight className="mr-2 h-5 w-5" />}
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-10 tracking-tighter">Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result, idx) => (
              <ResultCard key={idx} result={result} index={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}