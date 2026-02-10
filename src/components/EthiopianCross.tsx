const EthiopianCross = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <rect x="42" y="5" width="16" height="90" rx="2" />
    <rect x="5" y="30" width="90" height="16" rx="2" />
    <rect x="30" y="18" width="40" height="10" rx="2" />
    <rect x="30" y="72" width="40" height="10" rx="2" />
    <rect x="18" y="35" width="10" height="30" rx="2" />
    <rect x="72" y="35" width="10" height="30" rx="2" />
    <circle cx="50" cy="50" r="8" />
  </svg>
);

export default EthiopianCross;
