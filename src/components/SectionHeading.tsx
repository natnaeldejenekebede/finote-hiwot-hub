import EthiopianCross from "./EthiopianCross";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionHeading = ({ title, subtitle, className = "" }: SectionHeadingProps) => (
  <div className={`text-center mb-12 ${className}`}>
    <div className="flex items-center justify-center gap-4 mb-4">
      <EthiopianCross className="w-5 h-5 text-primary" />
      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">{title}</h2>
      <EthiopianCross className="w-5 h-5 text-primary" />
    </div>
    {subtitle && (
      <p className="text-muted-foreground font-body max-w-2xl mx-auto">{subtitle}</p>
    )}
    <div className="ornate-divider mt-4 max-w-xs mx-auto">
      <span className="text-primary text-xs">✦</span>
    </div>
  </div>
);

export default SectionHeading;
