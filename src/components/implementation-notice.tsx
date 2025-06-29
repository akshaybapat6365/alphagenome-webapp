import { CheckCircle2, ExternalLink, AlertCircle } from 'lucide-react'
import { API_CONFIG } from '@/config/api'

export function ImplementationNotice() {
  const isUsingMock = API_CONFIG.USE_LOCAL_MOCK
  const backendUrl = API_CONFIG.BACKEND_URL
  
  return (
    <div className={`${isUsingMock ? 'bg-yellow-900/20 border-yellow-600/50' : 'bg-green-900/20 border-green-600/50'} border rounded-lg p-6 mb-8`}>
      <div className="flex items-start gap-3">
        {isUsingMock ? (
          <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
        )}
        <div className="space-y-3">
          <h3 className={`text-lg font-semibold ${isUsingMock ? 'text-yellow-200' : 'text-green-200'}`}>
            AlphaGenome Integration Status
          </h3>
          <p className={`${isUsingMock ? 'text-yellow-100/80' : 'text-green-100/80'}`}>
            {isUsingMock 
              ? 'Using local mock API. Deploy the backend to Render for full AlphaGenome functionality.'
              : `Connected to AlphaGenome backend at ${backendUrl}`
            }
          </p>
          <div className="space-y-2 text-sm">
            <p className={`${isUsingMock ? 'text-yellow-100/70' : 'text-green-100/70'}`}>
              Current capabilities:
            </p>
            <ul className={`list-disc list-inside space-y-1 ${isUsingMock ? 'text-yellow-100/60' : 'text-green-100/60'} ml-4`}>
              <li>Variant effect prediction using AlphaGenome ML model</li>
              <li>RNA expression impact analysis</li>
              <li>Splicing and chromatin accessibility predictions</li>
              <li>Pathogenicity scoring based on functional changes</li>
              {isUsingMock && <li className="text-yellow-400">⚠️ Limited to mock predictions</li>}
            </ul>
          </div>
          <div className="flex gap-4 mt-4">
            <a
              href="https://github.com/google-deepmind/alphagenome"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 ${isUsingMock ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'} transition-colors`}
            >
              AlphaGenome Docs <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/akshaybapat6365/alphagenome-backend"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 ${isUsingMock ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'} transition-colors`}
            >
              Backend Source <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}