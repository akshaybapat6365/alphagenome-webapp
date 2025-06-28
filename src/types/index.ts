export interface SNP {
  rsId: string
  chromosome: string
  position: number
  genotype: string
}

export interface AlphaGenomeResult {
  rsId: string
  chromosome: string
  position: number
  genotype: string
  predictions?: {
    pathogenicity?: number
    effect?: string
    confidence?: number
  }
  error?: string
}

export enum InputFormat {
  VCF = 'vcf',
  TWENTY_THREE_AND_ME = '23andme',
  CUSTOM_TAB = 'custom_tab',
  AUTO_DETECT = 'auto'
}

export interface ParseResult {
  format: InputFormat
  snps: SNP[]
  errors: string[]
}