import { useEffect, useRef } from "react"

export function Eyes() {
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = box.current
    if (!root) return

    const pupils = [...root.querySelectorAll<HTMLElement>(".pupil")]
    const pos = pupils.map(() => ({ x: 0, y: 0 }))
    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let raf = 0

    const onPointer = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
    }

    const tick = () => {
      pupils.forEach((el, i) => {
        const eye = el.parentElement
        if (!eye) return
        const b = eye.getBoundingClientRect()
        const cx = b.left + b.width / 2
        const cy = b.top + b.height / 2
        const ang = Math.atan2(ty - cy, tx - cx)
        const cap = b.width * 0.2
        const dist = Math.min(Math.hypot(tx - cx, ty - cy), cap)
        const wx = Math.cos(ang) * dist
        const wy = Math.sin(ang) * dist
        pos[i].x += (wx - pos[i].x) * 0.12
        pos[i].y += (wy - pos[i].y) * 0.12
        el.style.transform = `translate(${pos[i].x}px, ${pos[i].y}px)`
      })
      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!raf) raf = requestAnimationFrame(tick)
        } else {
          cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { threshold: 0.12 },
    )
    io.observe(root)
    raf = requestAnimationFrame(tick)

    window.addEventListener("pointermove", onPointer, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener("pointermove", onPointer)
    }
  }, [])

  return (
    <div className="eyes-pair" ref={box}>
      <div className="eye">
        <div className="pupil">
          <i />
        </div>
      </div>
      <div className="eye">
        <div className="pupil">
          <i />
        </div>
      </div>
    </div>
  )
}
