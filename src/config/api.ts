// API Configuration
export const API_CONFIG = {
  // Update this URL after deploying to Render
  // Expected format: https://alphagenome-backend.onrender.com
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://alphagenome-backend.onrender.com',
  
  // Fallback to local Vercel function if Render backend is not available
  USE_LOCAL_MOCK: process.env.NEXT_PUBLIC_USE_LOCAL_MOCK === 'true',
}

export function getAnalyzeEndpoint(): string {
  if (API_CONFIG.USE_LOCAL_MOCK) {
    return '/api/analyze_snps'
  }
  return `${API_CONFIG.BACKEND_URL}/api/analyze_snps`
}