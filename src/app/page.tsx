
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
      <div className="molecular-background" />
      <div className="relative z-10 px-6">
        <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tighter leading-tight mb-6">
          Decode Your Future.
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10">
          AlphaGenome provides sophisticated, AI-driven analysis of your genetic data. 
          Uncover predispositions, understand your traits, and take control of your health.
        </p>
        <Link 
          href="/analyze" 
          className="inline-block bg-deep-sky-blue text-black font-bold py-4 px-10 rounded-full text-lg transition-transform transform hover:scale-105 shadow-[0_0_30px_rgba(0,191,255,0.5)]"
          style={{ backgroundColor: '#00BFFF' }}
        >
          Begin Analysis
        </Link>
      </div>
    </div>
  );
}
