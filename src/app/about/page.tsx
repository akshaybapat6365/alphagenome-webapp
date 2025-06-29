export default function About() {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold text-white text-center mb-12">About AlphaGenome</h1>
        <div className="max-w-4xl mx-auto glassmorphism rounded-lg p-8 edge-hue">
          <p className="text-lg text-gray-300 mb-6">
            AlphaGenome stands at the forefront of personalized medicine, leveraging state-of-the-art artificial intelligence to provide profound insights into your genetic data. Our mission is to empower individuals with a deeper understanding of their health, ancestry, and unique genetic traits.
          </p>
          <p className="text-lg text-gray-300 mb-6">
            Our platform analyzes single nucleotide polymorphisms (SNPs) to predict genetic predispositions to various health conditions, identify carrier statuses for inherited diseases, and uncover the intricate details of your genetic makeup. We are committed to providing a secure, user-friendly, and highly accurate genetic analysis service.
          </p>
          <p className="text-lg text-gray-300">
            The team behind AlphaGenome is comprised of leading experts in bioinformatics, artificial intelligence, and genetic research. We believe that by unlocking the power of the genome, we can help people live healthier, more informed lives.
          </p>
        </div>
      </div>
    </div>
  );
}