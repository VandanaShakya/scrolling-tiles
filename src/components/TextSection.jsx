import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const LINES = [
  ['We', 'design'],
  ['products', 'that'],
  ['feel', 'alive'],
]

export default function TextSection() {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const hint = section.querySelector('.text-hint')
      const words = gsap.utils.toArray('.text-word', section)

      gsap.set(words, { yPercent: 118 })
      gsap.set(hint, { autoAlpha: 1 })

      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=180%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate(self) {
            if (!hint) return
            hint.classList.toggle('is-gone', self.progress > 0.02)
          },
        },
      })
        .to(hint, { autoAlpha: 0, duration: 0.25 }, 0)
        .to('.text-kicker', { opacity: 1, duration: 0.35 }, 0)
        .to(words, { yPercent: 0, stagger: 0.08, duration: 0.7 }, 0.05)
        .to(
          '.text-headline',
          { scale: 0.88, y: -36, opacity: 0.18, duration: 1 },
          1.15,
        )
        .to('.text-kicker', { opacity: 0, duration: 0.5 }, 1.2)
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="pin-section text-section">
      <p className="text-kicker" style={{ opacity: 0 }}>
        Studio / 2026
      </p>

      <h1 className="text-headline">
        {LINES.map((line) => (
          <span className="text-line" key={line.join('-')}>
            {line.map((word) => (
              <span className="text-word-mask" key={word}>
                <span
                  className={
                    word === 'alive' ? 'text-word is-italic' : 'text-word'
                  }
                >
                  {word}
                </span>
              </span>
            ))}
          </span>
        ))}
      </h1>

      <p className="text-hint">
        Scroll
        <svg
          className="text-hint-arrow"
          viewBox="0 0 16 16"
          width="16"
          height="16"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M8 3v8.2M4.2 8.6 8 12.4l3.8-3.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.45"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </p>
    </section>
  )
}
