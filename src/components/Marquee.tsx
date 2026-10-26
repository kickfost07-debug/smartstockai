import { copy } from "../copy"

export function Marquee() {
  const row = copy.ticker

  return (
    <div className="ticker-wrap">
      <div className="ticker">
        <div className="ticker-track">
          <div className="ticker-row">
            {row.map((item) => (
              <span key={`a-${item}`}>
                {item}
                <em>★</em>
              </span>
            ))}
          </div>
          <div className="ticker-row" aria-hidden>
            {row.map((item) => (
              <span key={`b-${item}`}>
                {item}
                <em>★</em>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
