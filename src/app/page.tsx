'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useToast } from '@/components/ui/use-toast'
import { SNPParser } from '@/services/snp-parser'
import { AlphaGenomeAPI } from '@/services/alphagenome-api'
import { InputFormat, AlphaGenomeResult } from '@/types'
import { AlertCircle, CheckCircle2, Loader2, FileText, Dna, Sun, Moon } from 'lucide-react'
import { ErrorMonitor } from '@/utils/monitoring'
import { ImplementationNotice } from '@/components/implementation-notice'

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
    const startTime = performance.now()
    setLoading(true)
    setResults([])
    setParseErrors([])
    
    ErrorMonitor.logEvent('analyze_started', { formatSelected: format })

    try {
      const parseResult = SNPParser.parse(input, format)
      
      if (parseResult.errors.length > 0) {
        setParseErrors(parseResult.errors)
      }

      if (parseResult.snps.length === 0) {
        toast({
          title: 'No valid SNPs found',
          description: 'Please check your input format and try again.',
          variant: 'destructive'
        })
        setLoading(false)
        return
      }

      const validationErrors = SNPParser.validateSNPs(parseResult.snps)
      if (validationErrors.length > 0) {
        setParseErrors(prev => [...prev, ...validationErrors])
      }

      toast({
        title: 'Analyzing SNPs',
        description: `Found ${parseResult.snps.length} valid SNPs. Processing...`
      })

      const analysisResults = await AlphaGenomeAPI.analyzeSNPs(parseResult.snps)
      setResults(analysisResults)

      toast({
        title: 'Analysis complete',
        description: `Successfully analyzed ${analysisResults.length} SNPs.`
      })
      
      const duration = performance.now() - startTime
      ErrorMonitor.logPerformance('analysis_complete', duration)
      ErrorMonitor.logEvent('analyze_success', { 
        snpCount: analysisResults.length,
        duration 
      })
    } catch (error) {
      ErrorMonitor.logError(error as Error, { format, inputLength: input.length })
      toast({
        title: 'Analysis failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const loadSampleData = (selectedFormat: InputFormat) => {
    if (selectedFormat === InputFormat.AUTO_DETECT) return
    setInput(SAMPLE_DATA[selectedFormat] || '')
    setFormat(selectedFormat)
    toast({
      title: 'Sample data loaded',
      description: `Loaded ${selectedFormat.replace('_', ' ')} format example`
    })
  }

  const exportResults = () => {
    const data = results.map(r => ({
      rsId: r.rsId,
      chromosome: r.chromosome,
      position: r.position,
      genotype: r.genotype,
      pathogenicity: r.predictions?.pathogenicity || 'N/A',
      effect: r.predictions?.effect || 'N/A',
      confidence: r.predictions?.confidence || 'N/A'
    }))

    const csv = [
      'rsId,chromosome,position,genotype,pathogenicity,effect,confidence',
      ...data.map(d => `${d.rsId},${d.chromosome},${d.position},${d.genotype},${d.pathogenicity},${d.effect},${d.confidence}`)
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'alphagenome-results.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center py-8 px-4">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
      <div className="container mx-auto max-w-6xl space-y-10">
        <header className="flex flex-col items-center justify-center text-center mb-12 mt-4">
          <Dna className="w-12 h-12 mb-4 text-primary drop-shadow-lg" />
          <h1 className="text-6xl font-extrabold soft-gradient-text tracking-tight leading-tight">
            AlphaGenome
          </h1>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl">
            Advanced AI-powered genetic analysis for personalized insights.
          </p>
        </header>
        
        <ImplementationNotice />
        
        <div className="grid gap-10 md:grid-cols-2">
          <Card className="bg-card/60 backdrop-blur-md shadow-xl border border-primary/20 edge-hue p-6">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl font-bold soft-gradient-text mb-2">Input Genetic Data</CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                Paste your SNP data in VCF, 23andMe, or custom tab-delimited format.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={format} onValueChange={(value) => setFormat(value as InputFormat)}>
                  <SelectTrigger className="flex-grow h-12 text-base bg-input/30 border-primary/30 focus:ring-2 focus:ring-primary/50">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-primary/30">
                    <SelectItem value={InputFormat.AUTO_DETECT}>Auto-detect</SelectItem>
                    <SelectItem value={InputFormat.VCF}>VCF Format</SelectItem>
                    <SelectItem value={InputFormat.TWENTY_THREE_AND_ME}>23andMe</SelectItem>
                    <SelectItem value={InputFormat.CUSTOM_TAB}>Custom Tab</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => loadSampleData(format)}
                  disabled={format === InputFormat.AUTO_DETECT}
                  className="h-12 text-base border-primary/30 text-primary hover:bg-primary/10"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Load Sample
                </Button>
              </div>

              <Textarea
                placeholder="Paste your genetic data here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[350px] font-mono text-sm bg-input/30 border-primary/30 focus:ring-2 focus:ring-primary/50 p-4 rounded-lg"
              />

              {parseErrors.length > 0 && (
                <Alert variant="destructive" className="bg-destructive/20 border-destructive/50 text-destructive-foreground">
                  <AlertCircle className="h-5 w-5" />
                  <AlertTitle className="text-lg">Parsing Errors</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                      {parseErrors.slice(0, 5).map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                      {parseErrors.length > 5 && (
                        <li>... and {parseErrors.length - 5} more errors</li>
                      )}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleAnalyze} 
                disabled={loading || !input.trim()}
                className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-primary/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze SNPs'
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-md shadow-xl border border-primary/20 edge-hue p-6">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl font-bold soft-gradient-text mb-2">Analysis Results</CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                AlphaGenome predictions for your genetic variants.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground opacity-70">
                  <Dna className="w-16 h-16 mx-auto mb-6 opacity-20" />
                  <p className="text-lg">No results yet. Upload and analyze your genetic data to see predictions.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-primary/20">
                    <p className="text-base text-muted-foreground font-medium">
                      Analyzed <span className="text-primary font-semibold">{results.length}</span> variants
                    </p>
                    <Button size="lg" variant="outline" onClick={exportResults} className="h-12 text-base border-primary/30 text-primary hover:bg-primary/10">
                      Export CSV
                    </Button>
                  </div>
                  
                  <div className="max-h-[450px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {results.map((result, idx) => (
                      <div key={idx} className="border border-primary/20 rounded-xl p-4 bg-accent/10 hover:bg-accent/20 transition-all duration-200 shadow-sm hover:shadow-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-lg text-foreground">{result.rsId}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Chr{result.chromosome}:{result.position} - {result.genotype}
                            </p>
                          </div>
                          {result.error ? (
                            <div className="text-destructive text-sm flex items-center">
                              <AlertCircle className="w-5 h-5 mr-1" /> Error
                            </div>
                          ) : result.predictions && (
                            <div className="text-right">
                              <div className={`text-base font-bold ${
                                (result.predictions.pathogenicity || 0) > 0.7 
                                  ? 'text-red-400' 
                                  : (result.predictions.pathogenicity || 0) > 0.3 
                                  ? 'text-yellow-400' 
                                  : 'text-green-400'
                              }`}>
                                {result.predictions.pathogenicity !== undefined 
                                  ? `Risk: ${(result.predictions.pathogenicity * 100).toFixed(0)}%`
                                  : 'Unknown'}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {result.predictions.effect || 'No effect data'}
                              </p>
                            </div>
                          )}
                        </div>
                        {result.error && (
                          <p className="text-sm text-destructive mt-2">{result.error}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-10 bg-card/60 backdrop-blur-md shadow-xl border border-primary/20 edge-hue p-6">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold soft-gradient-text mb-2">About AlphaGenome</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base text-muted-foreground leading-relaxed">
              AlphaGenome uses advanced AI to analyze genetic variants and predict their potential effects. 
              This tool supports multiple input formats including VCF, 23andMe, and custom tab-delimited files. 
              Results include pathogenicity predictions, functional effects, and confidence scores.
            </p>
            <Alert className="mt-6 bg-accent/10 border-primary/20 text-muted-foreground">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <AlertTitle className="text-lg font-semibold text-foreground">Supported Formats</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside text-base mt-2 space-y-1">
                  <li><span className="font-medium text-foreground">VCF (Variant Call Format)</span> - Standard bioinformatics format</li>
                  <li><span className="font-medium text-foreground">23andMe</span> - Direct-to-consumer genetic test format</li>
                  <li><span className="font-medium text-foreground">Custom Tab-Delimited</span> - Format: rsID chromosome position genotype</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}