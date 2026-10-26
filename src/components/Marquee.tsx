import { copy } from "../copy"

export function Marquee() {
  const row = [...copy.ticker, ...copy.ticker]

  return (
    <div className="ticker-wrap">
      <div className="ticker">
        <div className="ticker-track">
          {row.map((item, i) => (
            <span key={`${item}-${i}`}>
              {item}
              <em>★</em>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
