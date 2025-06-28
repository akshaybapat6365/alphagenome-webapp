import { SNP, AlphaGenomeResult } from '@/types'

export class AlphaGenomeAPI {
  private static readonly API_KEY = process.env.NEXT_PUBLIC_ALPHAGENOME_API_KEY
  private static readonly API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

  static async analyzeSNPs(snps: SNP[]): Promise<AlphaGenomeResult[]> {
    if (!this.API_KEY) {
      throw new Error('AlphaGenome API key not configured')
    }

    const results: AlphaGenomeResult[] = []
    
    // Process in batches to avoid rate limits
    const batchSize = 5
    for (let i = 0; i < snps.length; i += batchSize) {
      const batch = snps.slice(i, i + batchSize)
      const batchResults = await Promise.all(
        batch.map(snp => this.analyzeSingleSNP(snp))
      )
      results.push(...batchResults)
      
      // Add delay between batches to avoid rate limiting
      if (i + batchSize < snps.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    return results
  }

  static async analyzeSingleSNP(snp: SNP): Promise<AlphaGenomeResult> {
    try {
      const prompt = `Analyze this genetic variant:
- rsID: ${snp.rsId}
- Chromosome: ${snp.chromosome}
- Position: ${snp.position}
- Genotype: ${snp.genotype}

Please provide:
1. Potential pathogenicity score (0-1, where 0 is benign and 1 is pathogenic)
2. Predicted effect on protein function
3. Confidence level (0-1)

Format your response as JSON with fields: pathogenicity, effect, confidence`

      const response = await fetch(`${this.API_BASE_URL}?key=${this.API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 500,
          }
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      
      // Try to parse the response as JSON
      let predictions
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          predictions = JSON.parse(jsonMatch[0])
        }
      } catch {
        // Fallback to regex parsing
        const pathogenicityMatch = content.match(/pathogenicity[:\s]*([0-9.]+)/i)
        const effectMatch = content.match(/effect[:\s]*([^,\n]+)/i)
        const confidenceMatch = content.match(/confidence[:\s]*([0-9.]+)/i)
        
        predictions = {
          pathogenicity: pathogenicityMatch ? parseFloat(pathogenicityMatch[1]) : 0.5,
          effect: effectMatch ? effectMatch[1].trim() : 'Unknown',
          confidence: confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.5
        }
      }

      return {
        ...snp,
        predictions
      }
    } catch (error) {
      console.error(`Error analyzing SNP ${snp.rsId}:`, error)
      return {
        ...snp,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}?key=${this.API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Test connection'
            }]
          }]
        })
      })

      return response.ok
    } catch {
      return false
    }
  }
}