export function WindowIllustration() {
  return (
    <div className="relative w-full max-w-md aspect-square">
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Window frame */}
        <rect x="50" y="50" width="300" height="300" rx="2" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="4" />

        {/* Window divisions */}
        <line x1="200" y1="50" x2="200" y2="350" stroke="#E5E7EB" strokeWidth="4" />
        <line x1="50" y1="200" x2="350" y2="200" stroke="#E5E7EB" strokeWidth="4" />

        {/* Window glass */}
        <rect x="54" y="54" width="142" height="142" fill="#EFF6FF" fillOpacity="0.6" />
        <rect x="204" y="54" width="142" height="142" fill="#EFF6FF" fillOpacity="0.6" />
        <rect x="54" y="204" width="142" height="142" fill="#EFF6FF" fillOpacity="0.6" />
        <rect x="204" y="204" width="142" height="142" fill="#EFF6FF" fillOpacity="0.6" />

        {/* Window handle */}
        <rect x="190" y="190" width="20" height="20" rx="2" fill="#FB923C" />

        {/* Dimension lines */}
        <line x1="30" y1="50" x2="30" y2="350" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="370" y1="50" x2="370" y2="350" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="50" y1="30" x2="350" y2="30" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="50" y1="370" x2="350" y2="370" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" />

        {/* Dimension arrows */}
        <line x1="25" y1="50" x2="35" y2="50" stroke="#94A3B8" strokeWidth="1" />
        <line x1="25" y1="350" x2="35" y2="350" stroke="#94A3B8" strokeWidth="1" />
        <line x1="50" y1="25" x2="50" y2="35" stroke="#94A3B8" strokeWidth="1" />
        <line x1="350" y1="25" x2="350" y2="35" stroke="#94A3B8" strokeWidth="1" />

        {/* Dimension text */}
        <text x="15" y="200" fill="#64748B" fontSize="12" textAnchor="middle" transform="rotate(-90, 15, 200)">
          300 cm
        </text>
        <text x="200" y="20" fill="#64748B" fontSize="12" textAnchor="middle">
          300 cm
        </text>

        {/* Highlight effect */}
        <rect x="50" y="50" width="300" height="300" rx="2" fill="url(#paint0_linear)" fillOpacity="0.1" />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="paint0_linear" x1="50" y1="50" x2="350" y2="350" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FB923C" />
            <stop offset="1" stopColor="#FB923C" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Decorative elements */}
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-100 rounded-full opacity-30 z-[-1]"></div>
      <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full opacity-20 z-[-1]"></div>
    </div>
  )
}
