
export default function HowItWorks() {
  return (
    <div className="min-h-screen pt-32 pb-20 container-mx">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tighter">How It Works</h1>
        <p className="text-lg text-gray-400 mt-4">A simple, three-step process to unlock your genetic insights.</p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
        <div className="border border-gray-800 p-8 rounded-2xl">
          <div className="text-5xl font-bold text-blue-500 mb-4">1</div>
          <h2 className="text-2xl font-bold text-white mb-2">Submit Your Data</h2>
          <p className="text-gray-400">Paste your raw data from any major genetic testing service into our secure analysis tool.</p>
        </div>
        <div className="border border-gray-800 p-8 rounded-2xl">
          <div className="text-5xl font-bold text-blue-500 mb-4">2</div>
          <h2 className="text-2xl font-bold text-white mb-2">AI-Powered Analysis</h2>
          <p className="text-gray-400">Our algorithms cross-reference your genetic markers against a vast database of genomic research.</p>
        </div>
        <div className="border border-gray-800 p-8 rounded-2xl">
          <div className="text-5xl font-bold text-blue-500 mb-4">3</div>
          <h2 className="text-2xl font-bold text-white mb-2">Receive Your Report</h2>
          <p className="text-gray-400">Get a personalized report detailing potential health predispositions, traits, and more.</p>
        </div>
      </div>
    </div>
  );
}
