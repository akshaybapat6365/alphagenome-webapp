
export default function About() {
  return (
    <div className="min-h-screen pt-32 pb-20 container-mx">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tighter">About AlphaGenome</h1>
        <p className="text-lg text-gray-400 mt-4">We are a team of scientists, engineers, and researchers dedicated to making genetic information accessible and actionable.</p>
      </div>

      <div className="max-w-4xl mx-auto bg-gray-900/50 p-8 rounded-2xl border border-gray-800">
        <p className="text-lg text-gray-300 mb-6">
          AlphaGenome was founded on the principle that understanding your own DNA is a fundamental right. We believe that by providing individuals with access to their genetic information, we can empower them to make more informed decisions about their health, lifestyle, and future.
        </p>
        <p className="text-lg text-gray-300 mb-6">
          Our platform uses state-of-the-art artificial intelligence and machine learning algorithms to analyze your genetic data. We are committed to providing the most accurate and up-to-date information possible, and we are constantly working to improve our platform and expand our capabilities.
        </p>
        <p className="text-lg text-gray-300">
          We are also committed to privacy and security. We believe that your genetic data is your own, and we will never share it with third parties without your explicit consent. We use the latest encryption and security technologies to protect your data, and we are constantly working to improve our security measures.
        </p>
      </div>
    </div>
  );
}
