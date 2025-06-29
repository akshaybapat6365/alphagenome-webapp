import json
import os

def handler(request, response):
    """Vercel Python serverless function for AlphaGenome analysis"""
    
    if request.method == 'OPTIONS':
        response.status_code = 200
        response.headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
        return response
    
    if request.method != 'POST':
        response.status_code = 405
        return response
    
    try:
        # Parse request body
        body = json.loads(request.body)
        snps = body.get('snps', [])
        api_key = os.environ.get('ALPHAGENOME_API_KEY')
        
        # Process SNPs
        results = []
        for snp in snps:
            # Calculate mock pathogenicity score based on position
            # In a real implementation, this would use the AlphaGenome Python client
            position = int(snp.get('position', 0))
            
            # Mock scoring algorithm
            base_score = (position % 1000) / 1000.0
            chromosome_factor = int(snp.get('chromosome', 1)) * 0.01
            pathogenicity = min(base_score * 0.7 + chromosome_factor + 0.1, 0.95)
            
            # Determine effect based on score
            if pathogenicity > 0.8:
                effect = "High impact: Likely pathogenic variant affecting protein function"
            elif pathogenicity > 0.5:
                effect = "Moderate impact: Possible functional consequences"
            else:
                effect = "Low impact: Likely benign variant"
            
            results.append({
                'rsId': snp['rsId'],
                'chromosome': snp['chromosome'],
                'position': snp['position'],
                'genotype': snp['genotype'],
                'predictions': {
                    'pathogenicity': round(pathogenicity, 3),
                    'effect': effect,
                    'confidence': 0.85,
                    'details': {
                        'api_key_configured': bool(api_key),
                        'model_version': 'AlphaGenome-Mock-1.0',
                        'analysis_note': 'Using simplified scoring pending full AlphaGenome integration'
                    }
                }
            })
        
        response.status_code = 200
        response.headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
        response.body = json.dumps({
            'results': results,
            'metadata': {
                'total_variants': len(results),
                'api_configured': bool(api_key)
            }
        })
        
    except Exception as e:
        response.status_code = 500
        response.headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
        response.body = json.dumps({
            'error': str(e)
        })
    
    return response