import HeroBadge from "./HeroBadge";
import HeroContent from "./HeroContent";
import HeroActions from "./HeroActions";
import HeroTrust from "./HeroTrust";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-emerald-50 via-white to-amber-50 py-24">
      <div className="mx-auto max-w-7xl px-6 flex flex-col items-center">
        <HeroBadge />
        <HeroContent />
        <HeroActions />
        <HeroTrust />
      </div>
    </section>
  );
}
