import { useEffect, useRef, useState } from "react"
import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { AnimatePresence, motion } from "motion/react"
import { Eyes } from "./components/Eyes"
import { Marquee } from "./components/Marquee"
import { Idle } from "./components/Idle"
import { Unpack } from "./components/Unpack"
import { copy } from "./copy"

const ease = [0.76, 0, 0.24, 1] as const

const view = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease },
}

export default function App() {
  const [hover, setHover] = useState<string | null>(null)
  const [active, setActive] = useState(0)
  const [slot, setSlot] = useState(0)
  const cards = useRef<(HTMLElement | null)[]>([])
  const words = copy.hero.slot

  useEffect(() => {
    const tick = () => setSlot((n) => (n + 1) % words.length)
    let t = window.setInterval(tick, 2200)
    const onVis = () => {
      window.clearInterval(t)
      if (document.hidden) return
      t = window.setInterval(tick, 2200)
    }
    document.addEventListener("visibilitychange", onVis)
    return () => {
      window.clearInterval(t)
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [words.length])

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08 })
    let id = 0
    const raf = (time: number) => {
      lenis.raf(time)
      id = requestAnimationFrame(raf)
    }
    id = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

    let last = 0
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!hit) return
        const i = cards.current.indexOf(hit.target as HTMLElement)
        if (i < 0 || i === last) return
        last = i
        setActive(i)
      },
      { threshold: 0.55, rootMargin: "-22% 0px -42% 0px" },
    )

    cards.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <Unpack />
      <Idle />

      <nav className="nav">
        <span className="logo">{copy.nav.logo}</span>
        <div className="nav-r">
          <a href="#work">{copy.nav.work}</a>
          <a href="#about">{copy.nav.about}</a>
          <a className="nav-cta" href="https://t.me/Egregoru">
            {copy.nav.write}
          </a>
        </div>
      </nav>

      <section className="land">
        <h1>
          <motion.span
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1, ease }}
          >
            {copy.hero.l1}
          </motion.span>
          <motion.span
            className="land-row"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.12, ease }}
          >
            <span className="slot">
              <AnimatePresence mode="wait">
                <motion.b
                  key={words[slot]}
                  initial={{ y: "80%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-80%" }}
                  transition={{ duration: 0.38, ease }}
                >
                  {words[slot]}
                </motion.b>
              </AnimatePresence>
            </span>
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.24, ease }}
          >
            {copy.hero.l2}
          </motion.span>
        </h1>
        <motion.div
          className="land-bot"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 1.36, ease }}
        >
          <p>{copy.hero.lead}</p>
          <a href="https://t.me/Egregoru">{copy.hero.cta}</a>
        </motion.div>
      </section>

      <Marquee />

      <section className="about" id="about">
        <motion.h2 {...view}>{copy.about.title}</motion.h2>
      </section>

      <section className="approach">
        <motion.article className="ap-card ap-green" {...view}>
          <div>
            <p>{copy.approach.kicker}</p>
            <a href="https://t.me/Egregoru">{copy.approach.cta}</a>
          </div>
          <p className="ap-copy">{copy.approach.text}</p>
        </motion.article>
        <motion.article
          className="ap-card ap-dark"
          {...view}
          transition={{ ...view.transition, delay: 0.08 }}
        >
          <Eyes />
        </motion.article>
      </section>

      <section className="work" id="work">
        <div className="work-grid">
          {hover && (
            <div className="work-ghost" aria-hidden>
              {hover}
            </div>
          )}
          {copy.works.map((w, i) => (
            <motion.article
              key={w.name}
              ref={(el) => {
                cards.current[i] = el
              }}
              className={active === i ? "on" : undefined}
              {...view}
              transition={{ ...view.transition, delay: i * 0.05 }}
              onMouseEnter={() => {
                setHover(w.name)
                setActive(i)
              }}
              onMouseLeave={() => setHover(null)}
              onClick={() => setActive(i)}
            >
              <header>
                <span>{w.name}</span>
                <div>
                  {w.tags.map((t) => (
                    <em key={t}>{t}</em>
                  ))}
                </div>
              </header>
              <div className="work-body">
                <strong className="work-big">{w.name}</strong>
                <p>{w.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="ready">
        <motion.h2 {...view}>{copy.ready.title}</motion.h2>
        <motion.p {...view} transition={{ ...view.transition, delay: 0.06 }}>
          {copy.ready.lead}
        </motion.p>
        <motion.a
          href="https://t.me/Egregoru"
          {...view}
          transition={{ ...view.transition, delay: 0.1 }}
        >
          {copy.ready.cta}
        </motion.a>
      </section>

      <footer className="foot">
        <div className="foot-who">
          <strong>{copy.foot.name}</strong>
          <span>{copy.foot.studio}</span>
        </div>
        <nav>
          {copy.socials.map((s) => (
            <a key={s.name} href={s.href}>
              {s.name}
            </a>
          ))}
        </nav>
      </footer>
    </>
  )
}
