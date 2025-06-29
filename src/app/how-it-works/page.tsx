export default function HowItWorks() {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold text-white text-center mb-12">How It Works</h1>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="glassmorphism rounded-lg p-8 edge-hue">
            <h2 className="text-2xl font-bold text-white mb-4">1. Upload Your Data</h2>
            <p className="text-gray-300">Start by pasting your raw genetic data from services like 23andMe or AncestryDNA into our secure analysis tool.</p>
          </div>
          <div className="glassmorphism rounded-lg p-8 edge-hue">
            <h2 className="text-2xl font-bold text-white mb-4">2. AI-Powered Analysis</h2>
            <p className="text-gray-300">Our advanced AI algorithms analyze your data, cross-referencing it with the latest genetic research and databases.</p>
          </div>
          <div className="glassmorphism rounded-lg p-8 edge-hue">
            <h2 className="text-2xl font-bold text-white mb-4">3. Get Your Results</h2>
            <p className="text-gray-300">Receive a detailed, personalized report on your genetic predispositions, traits, and ancestry in a clear and understandable format.</p>
          </div>
        </div>
      </div>
    </div>
  );
}