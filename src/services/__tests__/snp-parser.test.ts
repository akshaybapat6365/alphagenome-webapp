import { SNPParser } from '../snp-parser'
import { InputFormat } from '@/types'

describe('SNPParser', () => {
  describe('parse', () => {
    it('should parse custom tab format correctly', () => {
      const input = `rs548049170 1 69869 TT
rs9283150 1 565508 AA`
      
      const result = SNPParser.parse(input, InputFormat.CUSTOM_TAB)
      
      expect(result.format).toBe(InputFormat.CUSTOM_TAB)
      expect(result.snps).toHaveLength(2)
      expect(result.snps[0]).toEqual({
        rsId: 'rs548049170',
        chromosome: '1',
        position: 69869,
        genotype: 'TT'
      })
    })

    it('should auto-detect VCF format', () => {
      const input = `##fileformat=VCFv4.2
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tsample1
1\t69869\trs548049170\tT\tC\t.\tPASS\t.\tGT\t1/1`
      
      const result = SNPParser.parse(input)
      
      expect(result.format).toBe(InputFormat.VCF)
      expect(result.snps).toHaveLength(1)
    })

    it('should handle parsing errors gracefully', () => {
      const input = `invalid line
rs123 1 100`
      
      const result = SNPParser.parse(input, InputFormat.CUSTOM_TAB)
      
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('validateSNPs', () => {
    it('should validate correct SNPs', () => {
      const snps = [{
        rsId: 'rs123',
        chromosome: '1',
        position: 100,
        genotype: 'AA'
      }]
      
      const errors = SNPParser.validateSNPs(snps)
      expect(errors).toHaveLength(0)
    })

    it('should catch invalid chromosomes', () => {
      const snps = [{
        rsId: 'rs123',
        chromosome: '99',
        position: 100,
        genotype: 'AA'
      }]
      
      const errors = SNPParser.validateSNPs(snps)
      expect(errors.length).toBeGreaterThan(0)
    })
  })
})