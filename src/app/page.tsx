'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { SNPParser } from '@/services/snp-parser'
import { AlphaGenomeAPI } from '@/services/alphagenome-api'
import { InputFormat, AlphaGenomeResult } from '@/types'
import { AlertCircle, CheckCircle2, Loader2, FileText, Dna, Sun, Moon, Download, Sparkles, ArrowRight } from 'lucide-react'
import { ErrorMonitor } from '@/utils/monitoring'
import { ResultCard } from '@/components/result-card'

const SAMPLE_DATA = {
  [InputFormat.VCF]: `##fileformat=VCFv4.2
##reference=GRCh38
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tsample1
1\t69869\trs548049170\tT\tC\t.\tPASS\t.\tGT\t1/1
1\t565508\trs9283150\tA\tG\t.\tPASS\t.\tGT\t0/0`,
  [InputFormat.TWENTY_THREE_AND_ME]: `# rsid\tchromosome\tposition\tgenotype
rs548049170\t1\t69869\tTT
rs9283150\t1\t565508\tAA
rs116587930\t1\t727841\tGG`,
  [InputFormat.CUSTOM_TAB]: `rs548049170 1 69869 TT
rs9283150 1 565508 AA
rs116587930 1 727841 GG
rs3131972 1 752721 GG
rs12184325 1 754105 CC
rs12567639 1 756268 AA
rs114525117 1 759036 GG`
}

export default function Home() {
  const [input, setInput] = useState('')
  const [format, setFormat] = useState<InputFormat>(InputFormat.AUTO_DETECT)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AlphaGenomeResult[]>([])
  const [parseErrors, setParseErrors] = useState<string[]>([])
  const [theme, setTheme] = useState('dark')
  const { toast } = useToast()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const handleAnalyze = async () => {
    setLoading(true)
    setResults([])
    setParseErrors([])

    try {
      const parseResult = SNPParser.parse(input, format)
      if (parseResult.errors.length > 0) setParseErrors(parseResult.errors)
      if (parseResult.snps.length === 0) {
        toast({ title: 'No valid SNPs found', variant: 'destructive' })
        setLoading(false)
        return
      }

      const analysisResults = await AlphaGenomeAPI.analyzeSNPs(parseResult.snps)
      setResults(analysisResults)
      toast({ title: 'Analysis complete' })
    } catch (error) {
      toast({ title: 'Analysis failed', description: (error as Error).message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const loadSampleData = (selectedFormat: InputFormat) => {
    if (selectedFormat === InputFormat.AUTO_DETECT) return
    setInput(SAMPLE_DATA[selectedFormat] || '')
    setFormat(selectedFormat)
  }

  return (
    <>
      <div className="celestial-background" />
      <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="container mx-auto max-w-7xl w-full">
          <header className="text-center mb-16 animate-fade-in-up">
            <Dna className="w-16 h-16 mx-auto mb-6 text-sky-400" />
            <h1 className="text-5xl md:text-7xl font-bold gradient-text tracking-tighter">
              AlphaGenome
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mt-4 max-w-3xl mx-auto">
              Unlock the secrets of your DNA with our AI-powered genomic analysis platform.
            </p>
          </header>

          <div className="w-full max-w-4xl mx-auto aurora-card p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-6">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-semibold text-white">1. Input Your Data</h2>
                <p className="text-slate-400">Paste your raw genetic data below.</p>
              </div>
              <Select value={format} onValueChange={(value) => setFormat(value as InputFormat)}>
                <SelectTrigger className="h-12 text-base bg-slate-700/50 border-slate-600 focus:ring-sky-500">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value={InputFormat.AUTO_DETECT}>Auto-detect</SelectItem>
                  <SelectItem value={InputFormat.VCF}>VCF</SelectItem>
                  <SelectItem value={InputFormat.TWENTY_THREE_AND_ME}>23andMe</SelectItem>
                  <SelectItem value={InputFormat.CUSTOM_TAB}>Custom Tab</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              placeholder="e.g. rs12345 C G..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[250px] font-mono text-sm bg-slate-900/70 border-slate-700 focus:ring-2 focus:ring-sky-500 p-4 rounded-md w-full"
            />
            <div className="flex justify-between items-center mt-4">
                <Button variant="link" onClick={() => loadSampleData(format)} disabled={format === InputFormat.AUTO_DETECT} className="text-sky-400">
                    Load Sample Data
                </Button>
                <Button onClick={handleAnalyze} disabled={loading || !input.trim()} className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-sky-500/40">
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ArrowRight className="mr-2 h-5 w-5" />}
                  {loading ? 'Analyzing...' : 'Analyze Now'}
                </Button>
            </div>
          </div>

          {results.length > 0 && (
            <div className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Analysis Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.map((result, idx) => (
                  <ResultCard key={idx} result={result} index={idx} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}