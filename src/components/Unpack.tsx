import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { copy } from "../copy"

const ease = [0.76, 0, 0.24, 1] as const

export function Unpack() {
  const [on, setOn] = useState(true)

  useEffect(() => {
    document.documentElement.classList.add("is-packed")
    const t = window.setTimeout(() => setOn(false), 1180)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!on) document.documentElement.classList.remove("is-packed")
  }, [on])

  return (
    <AnimatePresence>
      {on && (
        <motion.div
          className="pack"
          exit={{ y: "-108%" }}
          transition={{ duration: 0.9, ease }}
        >
          <motion.span
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.42, ease }}
          >
            {copy.pack}
          </motion.span>
          <div className="pack-bar">
            <motion.i
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.95, delay: 0.12, ease }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
