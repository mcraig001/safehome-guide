interface SafeScoreProps {
  score: number;
  breakdown?: {
    safety?: number;
    ease?: number;
    install?: number;
    value?: number;
  };
  size?: 'sm' | 'md' | 'lg';
}

export function SafeScore({ score, breakdown, size = 'md' }: SafeScoreProps) {
  const color = score >= 80 ? '#1B4332' : score >= 60 ? '#D97706' : '#DC2626';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Fair';

  const sizes = {
    sm: { circle: 64, fontSize: 20, label: 'text-xs' },
    md: { circle: 96, fontSize: 28, label: 'text-sm' },
    lg: { circle: 128, fontSize: 40, label: 'text-base' },
  };
  const s = sizes[size];

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div
        style={{
          width: s.circle,
          height: s.circle,
          borderRadius: '50%',
          border: `4px solid ${color}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAFAF7',
        }}
      >
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: s.fontSize, fontWeight: 700, color }}>{score}</span>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#666' }}>/100</span>
      </div>
      <span className={`font-semibold ${s.label}`} style={{ color }}>
        SafeScore™ {label}
      </span>
      {breakdown && size !== 'sm' && (
        <div className="text-xs text-gray-600 space-y-2 w-full min-w-[160px]">
          {Object.entries(breakdown).map(([key, val]) => (
            <div key={key}>
              <div className="flex justify-between mb-0.5">
                <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="font-mono font-medium">{val}</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${val}%`, backgroundColor: val >= 80 ? '#1B4332' : val >= 60 ? '#D97706' : '#DC2626' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
