import { SNP, AlphaGenomeResult } from '@/types'
import { getAnalyzeEndpoint } from '@/config/api'

export class AlphaGenomeAPI {
  static async analyzeSNPs(snps: SNP[]): Promise<AlphaGenomeResult[]> {
    try {
      // Use the configured API endpoint (Render backend or local)
      const response = await fetch(getAnalyzeEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ snps })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to analyze SNPs')
      }

      const data = await response.json()
      
      if (data.error) {
        console.warn('AlphaGenome API Warning:', data.error)
      }
      
      return data.results
    } catch (error) {
      console.error('Error analyzing SNPs:', error)
      throw error
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(getAnalyzeEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ snps: [] })
      })
      return response.ok
    } catch {
      return false
    }
  }
}