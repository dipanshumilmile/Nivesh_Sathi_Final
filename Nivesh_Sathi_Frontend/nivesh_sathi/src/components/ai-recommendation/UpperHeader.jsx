export default function UpperHeader() {
  return (
    <section className="mb-8 text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-[#e6f8f0] px-4 py-1 text-xs font-semibold text-[#0bb883] mb-4">
        <span className="h-2 w-2 rounded-full bg-[#0bb883]" />
        AI-powered Recommendations
      </span>

      <h1 className="text-3xl md:text-4xl font-semibold text-[#102a43] mb-2">
        Get Personalized Fund Picks
      </h1>

      <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto">
        Tell us about your investment goals and let our AI scan hundreds of
        mutual funds to highlight the ones that best fit your profile.
      </p>
    </section>
  );
}
