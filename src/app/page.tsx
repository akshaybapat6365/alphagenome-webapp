'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useToast } from '@/components/ui/use-toast'
import { SNPParser } from '@/services/snp-parser'
import { AlphaGenomeAPI } from '@/services/alphagenome-api'
import { InputFormat, AlphaGenomeResult } from '@/types'
import { AlertCircle, CheckCircle2, Loader2, FileText, Dna } from 'lucide-react'

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
  const { toast } = useToast()

  const handleAnalyze = async () => {
    setLoading(true)
    setResults([])
    setParseErrors([])

    try {
      // Parse SNPs
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

      // Validate SNPs
      const validationErrors = SNPParser.validateSNPs(parseResult.snps)
      if (validationErrors.length > 0) {
        setParseErrors(prev => [...prev, ...validationErrors])
      }

      toast({
        title: 'Analyzing SNPs',
        description: `Found ${parseResult.snps.length} valid SNPs. Processing...`
      })

      // Analyze with AlphaGenome API
      const analysisResults = await AlphaGenomeAPI.analyzeSNPs(parseResult.snps)
      setResults(analysisResults)

      toast({
        title: 'Analysis complete',
        description: `Successfully analyzed ${analysisResults.length} SNPs.`
      })
    } catch (error) {
      console.error('Analysis error:', error)
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex items-center justify-center mb-8 mt-8">
          <Dna className="w-8 h-8 mr-3 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            AlphaGenome
          </h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Input Genetic Data</CardTitle>
              <CardDescription>
                Paste your SNP data in VCF, 23andMe, or custom tab-delimited format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Select value={format} onValueChange={(value) => setFormat(value as InputFormat)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={InputFormat.AUTO_DETECT}>Auto-detect</SelectItem>
                    <SelectItem value={InputFormat.VCF}>VCF Format</SelectItem>
                    <SelectItem value={InputFormat.TWENTY_THREE_AND_ME}>23andMe</SelectItem>
                    <SelectItem value={InputFormat.CUSTOM_TAB}>Custom Tab</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => loadSampleData(format)}
                  disabled={format === InputFormat.AUTO_DETECT}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Load Sample
                </Button>
              </div>

              <Textarea
                placeholder="Paste your genetic data here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />

              {parseErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Parsing Errors</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside text-sm mt-2">
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
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze SNPs'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                AlphaGenome predictions for your genetic variants
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Dna className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No results yet. Upload and analyze your genetic data to see predictions.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-muted-foreground">
                      Analyzed {results.length} variants
                    </p>
                    <Button size="sm" variant="outline" onClick={exportResults}>
                      Export CSV
                    </Button>
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto space-y-2">
                    {results.map((result, idx) => (
                      <div key={idx} className="border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-sm">{result.rsId}</p>
                            <p className="text-xs text-muted-foreground">
                              Chr{result.chromosome}:{result.position} - {result.genotype}
                            </p>
                          </div>
                          {result.error ? (
                            <div className="text-destructive text-xs">
                              <AlertCircle className="w-4 h-4" />
                            </div>
                          ) : result.predictions && (
                            <div className="text-right">
                              <div className={`text-xs font-medium ${
                                (result.predictions.pathogenicity || 0) > 0.7 
                                  ? 'text-destructive' 
                                  : (result.predictions.pathogenicity || 0) > 0.3 
                                  ? 'text-yellow-600' 
                                  : 'text-green-600'
                              }`}>
                                {result.predictions.pathogenicity !== undefined 
                                  ? `Risk: ${(result.predictions.pathogenicity * 100).toFixed(0)}%`
                                  : 'Unknown'}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {result.predictions.effect || 'No effect data'}
                              </p>
                            </div>
                          )}
                        </div>
                        {result.error && (
                          <p className="text-xs text-destructive mt-1">{result.error}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About AlphaGenome</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              AlphaGenome uses advanced AI to analyze genetic variants and predict their potential effects. 
              This tool supports multiple input formats including VCF, 23andMe, and custom tab-delimited files. 
              Results include pathogenicity predictions, functional effects, and confidence scores.
            </p>
            <Alert className="mt-4">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Supported Formats</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside text-sm mt-2">
                  <li>VCF (Variant Call Format) - Standard bioinformatics format</li>
                  <li>23andMe - Direct-to-consumer genetic test format</li>
                  <li>Custom Tab-Delimited - Format: rsID chromosome position genotype</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}