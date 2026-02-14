const EthiopianCross = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    {/* ዋናው የመስቀል ቅርጽ */}
    <rect x="42" y="5" width="16" height="90" rx="4" />
    <rect x="5" y="42" width="90" height="16" rx="4" />
    
    {/* የላይኛው ጫፍ - የአክሊል ቅርጽ */}
    <rect x="30" y="12" width="40" height="10" rx="5" />
    <circle cx="34" cy="17" r="3" />
    <circle cx="50" cy="17" r="3" />
    <circle cx="66" cy="17" r="3" />
    
    {/* የታችኛው ጫፍ */}
    <rect x="30" y="78" width="40" height="10" rx="5" />
    <circle cx="34" cy="83" r="3" />
    <circle cx="50" cy="83" r="3" />
    <circle cx="66" cy="83" r="3" />
    
    {/* የግራ ጫፍ */}
    <rect x="12" y="30" width="10" height="40" rx="5" />
    <circle cx="17" cy="34" r="3" />
    <circle cx="17" cy="50" r="3" />
    <circle cx="17" cy="66" r="3" />
    
    {/* የቀኝ ጫፍ */}
    <rect x="78" y="30" width="10" height="40" rx="5" />
    <circle cx="83" cy="34" r="3" />
    <circle cx="83" cy="50" r="3" />
    <circle cx="83" cy="66" r="3" />
    
    {/* መሃል ላይ ያለው ክብ - ዓለምን ያመለክታል */}
    <circle cx="50" cy="50" r="12" fill="currentColor" />
    <circle cx="50" cy="50" r="6" fill="white" />
    <circle cx="50" cy="50" r="3" fill="currentColor" />
    
    {/* የወይራ ቅርንጫፎች - ሰላምን ያመለክታሉ */}
    <path d="M50 38 L50 44 L44 44 L50 38" fill="currentColor" />
    <path d="M50 38 L50 44 L56 44 L50 38" fill="currentColor" />
    <path d="M50 62 L50 56 L44 56 L50 62" fill="currentColor" />
    <path d="M50 62 L50 56 L56 56 L50 62" fill="currentColor" />
    
    {/* የመስቀሉ ጫፎች ላይ የሚገኙ የመስቀል ቅርጾች */}
    <path d="M50 5 L46 12 L50 19 L54 12 L50 5" fill="currentColor" />
    <path d="M50 95 L46 88 L50 81 L54 88 L50 95" fill="currentColor" />
    <path d="M5 50 L12 46 L19 50 L12 54 L5 50" fill="currentColor" />
    <path d="M95 50 L88 46 L81 50 L88 54 L95 50" fill="currentColor" />
    
    {/* የጌጥ መስመሮች - በዋናው መስቀል ላይ */}
    <rect x="46" y="5" width="8" height="90" fill="white" opacity="0.3" />
    <rect x="5" y="46" width="90" height="8" fill="white" opacity="0.3" />
  </svg>
);

export default EthiopianCross;