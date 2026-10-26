import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { copy } from "../copy"

const ease = [0.76, 0, 0.24, 1] as const
const IDLE = 5000
const AFTER_LOAD = 2400
const KEY = "ssa-idle-shown"

export function Idle() {
  const [on, setOn] = useState(false)
  const busy = useRef(false)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (localStorage.getItem(KEY)) return

    let idle = 0
    let ready = false

    const arm = () => {
      window.clearTimeout(idle)
      if (!ready || busy.current || localStorage.getItem(KEY)) return
      idle = window.setTimeout(() => {
        busy.current = true
        setOn(true)
      }, IDLE)
    }

    const onAct = () => {
      if (busy.current) return
      arm()
    }

    const boot = window.setTimeout(() => {
      ready = true
      arm()
    }, AFTER_LOAD)

    const events = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"] as const
    events.forEach((e) => window.addEventListener(e, onAct, { passive: true }))

    return () => {
      window.clearTimeout(boot)
      window.clearTimeout(idle)
      events.forEach((e) => window.removeEventListener(e, onAct))
    }
  }, [])

  return (
    <AnimatePresence>
      {on && (
        <motion.div
          className="pack pack-idle"
          initial={{ y: "108%" }}
          animate={{ y: ["108%", "0%", "0%", "-108%"] }}
          transition={{
            duration: 4.2,
            times: [0, 0.18, 0.72, 1],
            ease,
          }}
          onAnimationComplete={() => {
            localStorage.setItem(KEY, "1")
            setOn(false)
          }}
        >
          <p>
            {copy.idle.split("\n").map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
