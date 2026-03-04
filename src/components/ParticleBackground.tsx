/**
 * 背景グリッド + SVG パーティクル（浮遊ドット + ホタル）の共通コンポーネント。
 * 全ページで同じパターンを使用するため、データ配列だけ差し替えて再利用する。
 */

export interface Particle {
  x: number
  y: number
  r: number
  color: string
  dur: number
  delay: number
}

const DOT_ANIM = ['dot-float-a', 'dot-float-b', 'dot-float-c'] as const

export function ParticleBackground({
  dots = [],
  fireflies = [],
  prefix,
  showGrid = true,
}: {
  dots?: readonly Particle[]
  fireflies?: readonly Particle[]
  prefix: string
  showGrid?: boolean
}) {
  const hasCyan = fireflies.some(f => f.color === '#43d9bf')
  const hasYellow = fireflies.some(f => f.color === '#fee023')

  return (
    <>
      {showGrid && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: [
              'linear-gradient(rgba(67,217,191,0.07) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(67,217,191,0.07) 1px, transparent 1px)',
            ].join(', '),
            backgroundSize: '48px 48px',
          }}
        />
      )}

      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {hasCyan && (
            <filter id={`${prefix}-glow-cyan`} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          )}
          {hasYellow && (
            <filter id={`${prefix}-glow-yellow`} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          )}
        </defs>

        {dots.map((d, i) => (
          <circle
            key={`dot-${i}`}
            className="svg-particle"
            cx={`${d.x}%`}
            cy={`${d.y}%`}
            r={d.r}
            fill={d.color}
            opacity={0.55}
            style={{
              animation: `${DOT_ANIM[i % 3]} ${d.dur}s ease-in-out infinite`,
              animationDelay: `${d.delay}s`,
            }}
          />
        ))}

        {fireflies.map((f, i) => (
          <circle
            key={`ff-${i}`}
            className="svg-particle"
            cx={`${f.x}%`}
            cy={`${f.y}%`}
            r={f.r}
            fill={f.color}
            filter={
              f.color === '#43d9bf'
                ? `url(#${prefix}-glow-cyan)`
                : `url(#${prefix}-glow-yellow)`
            }
            style={{
              animation: `firefly-pulse ${f.dur}s ease-in-out infinite`,
              animationDelay: `${f.delay}s`,
            }}
          />
        ))}
      </svg>
    </>
  )
}
