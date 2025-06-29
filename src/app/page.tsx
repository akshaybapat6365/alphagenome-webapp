import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 soft-shader" />
      </div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-4">
          Welcome to AlphaGenome
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Harnessing the power of artificial intelligence to decode the secrets of your DNA. Discover personalized insights and unlock a new understanding of your genetic makeup.
        </p>
        <Link href="/analyze" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 edge-hue">
          Start Analyzing
        </Link>
      </div>
    </div>
  );
}