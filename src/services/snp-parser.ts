import { SNP, InputFormat, ParseResult } from '@/types'

export class SNPParser {
  static parse(input: string, format: InputFormat = InputFormat.AUTO_DETECT): ParseResult {
    const lines = input.trim().split('\n').filter(line => line.trim())
    
    if (format === InputFormat.AUTO_DETECT) {
      format = this.detectFormat(lines)
    }

    switch (format) {
      case InputFormat.VCF:
        return this.parseVCF(lines)
      case InputFormat.TWENTY_THREE_AND_ME:
        return this.parse23AndMe(lines)
      case InputFormat.CUSTOM_TAB:
        return this.parseCustomTab(lines)
      default:
        return this.parseCustomTab(lines)
    }
  }

  private static detectFormat(lines: string[]): InputFormat {
    if (lines.length === 0) return InputFormat.CUSTOM_TAB

    const firstLine = lines[0]
    
    // Check for VCF format
    if (firstLine.startsWith('##fileformat=VCF')) {
      return InputFormat.VCF
    }
    
    // Check for 23andMe format (usually starts with # rsid)
    if (firstLine.startsWith('# rsid') || firstLine.includes('chromosome\tposition\tgenotype')) {
      return InputFormat.TWENTY_THREE_AND_ME
    }
    
    // Default to custom tab format
    return InputFormat.CUSTOM_TAB
  }

  private static parseVCF(lines: string[]): ParseResult {
    const snps: SNP[] = []
    const errors: string[] = []
    let headerFound = false

    for (const line of lines) {
      if (line.startsWith('##')) continue
      if (line.startsWith('#CHROM')) {
        headerFound = true
        continue
      }
      if (!headerFound) continue

      const parts = line.split('\t')
      if (parts.length < 10) {
        errors.push(`Invalid VCF line: ${line}`)
        continue
      }

      try {
        const [chrom, pos, id, ref, alt, , , , format, sample] = parts
        const genotype = this.extractGenotypeFromVCF(format, sample, ref, alt)
        
        snps.push({
          rsId: id !== '.' ? id : `chr${chrom}:${pos}`,
          chromosome: chrom.replace('chr', ''),
          position: parseInt(pos),
          genotype
        })
      } catch (e) {
        errors.push(`Error parsing line: ${line}`)
      }
    }

    return { format: InputFormat.VCF, snps, errors }
  }

  private static parse23AndMe(lines: string[]): ParseResult {
    const snps: SNP[] = []
    const errors: string[] = []

    for (const line of lines) {
      if (line.startsWith('#')) continue
      
      const parts = line.split('\t')
      if (parts.length < 4) {
        errors.push(`Invalid 23andMe line: ${line}`)
        continue
      }

      try {
        const [rsId, chromosome, position, genotype] = parts
        snps.push({
          rsId,
          chromosome: chromosome.replace('chr', ''),
          position: parseInt(position),
          genotype: genotype.trim()
        })
      } catch (e) {
        errors.push(`Error parsing line: ${line}`)
      }
    }

    return { format: InputFormat.TWENTY_THREE_AND_ME, snps, errors }
  }

  private static parseCustomTab(lines: string[]): ParseResult {
    const snps: SNP[] = []
    const errors: string[] = []

    for (const line of lines) {
      // Skip empty lines and comments
      if (!line.trim() || line.startsWith('#')) continue
      
      // Try multiple delimiters
      let parts = line.split('\t')
      if (parts.length < 4) {
        parts = line.split(/\s+/)
      }
      
      if (parts.length < 4) {
        errors.push(`Invalid format in line: ${line}`)
        continue
      }

      try {
        const [rsId, chromosome, position, genotype] = parts
        
        // Validate rsId format
        if (!rsId.startsWith('rs') && !rsId.includes(':')) {
          errors.push(`Invalid rsId format: ${rsId}`)
          continue
        }

        // Validate genotype
        const validGenotype = /^[ACGT]{1,2}$/.test(genotype.trim())
        if (!validGenotype) {
          errors.push(`Invalid genotype: ${genotype} for ${rsId}`)
          continue
        }

        snps.push({
          rsId,
          chromosome: chromosome.replace('chr', ''),
          position: parseInt(position),
          genotype: genotype.trim()
        })
      } catch (e) {
        errors.push(`Error parsing line: ${line}`)
      }
    }

    return { format: InputFormat.CUSTOM_TAB, snps, errors }
  }

  private static extractGenotypeFromVCF(format: string, sample: string, ref: string, alt: string): string {
    const formatFields = format.split(':')
    const gtIndex = formatFields.indexOf('GT')
    
    if (gtIndex === -1) return 'NN'
    
    const sampleFields = sample.split(':')
    const gtValue = sampleFields[gtIndex]
    
    if (!gtValue) return 'NN'
    
    const alleles = [ref, ...alt.split(',')]
    const [allele1, allele2] = gtValue.split(/[/|]/).map(a => parseInt(a))
    
    if (isNaN(allele1) || isNaN(allele2)) return 'NN'
    
    return (alleles[allele1] || 'N') + (alleles[allele2] || 'N')
  }

  static validateSNPs(snps: SNP[]): string[] {
    const errors: string[] = []
    const seen = new Set<string>()

    for (const snp of snps) {
      const key = `${snp.rsId}-${snp.chromosome}-${snp.position}`
      
      if (seen.has(key)) {
        errors.push(`Duplicate SNP: ${snp.rsId}`)
      }
      seen.add(key)

      if (!snp.rsId) {
        errors.push('Missing rsId')
      }

      if (!snp.chromosome || !['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','X','Y','MT'].includes(snp.chromosome.toUpperCase())) {
        errors.push(`Invalid chromosome: ${snp.chromosome} for ${snp.rsId}`)
      }

      if (!snp.position || snp.position < 1) {
        errors.push(`Invalid position: ${snp.position} for ${snp.rsId}`)
      }

      if (!snp.genotype || !/^[ACGT]{1,2}$/.test(snp.genotype)) {
        errors.push(`Invalid genotype: ${snp.genotype} for ${snp.rsId}`)
      }
    }

    return errors
  }
}