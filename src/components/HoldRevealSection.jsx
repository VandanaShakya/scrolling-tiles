import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const HEADLINES = [
  'Wireless',
  'sound,',
  'all-day',
  'charge, and',
  'full support',
]

export default function HoldRevealSection() {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const card = section.querySelector('.hold-card')
      const slot = section.querySelector('.hold-card-slot')
      const mm = gsap.matchMedia()

      mm.add('(min-width: 0px)', () => {
        const placeCard = () => {
          const s = slot.getBoundingClientRect()
          const b = section.getBoundingClientRect()
          gsap.set(card, {
            xPercent: -50,
            yPercent: -50,
            x: s.left - b.left + s.width / 2 - b.width / 2,
            y: s.top - b.top + s.height / 2 - b.height / 2,
            rotationY: 0,
            scale: 1,
            autoAlpha: 1,
            transformPerspective: 1400,
            transformOrigin: '50% 50%',
          })
        }

        placeCard()
        gsap.set('.hold-copy', { opacity: 1, y: 0 })
        gsap.set('.reveal-headline', { opacity: 0, scale: 0.96 })
        gsap.set('.hold-half-left', { xPercent: 0 })
        gsap.set('.hold-half-right', { xPercent: 0 })
        gsap.set('.hold-split', { opacity: 1 })

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=420%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: placeCard,
          },
        })

        tl.to({}, { duration: 0.35 })
          .to('.hold-copy', { opacity: 0, y: 28, duration: 0.55 }, 0.2)
          .to(
            card,
            {
              x: 0,
              y: 0,
              rotationY: 180,
              duration: 1.1,
            },
            0.45,
          )
          .to(
            '.hold-half-left',
            {
              xPercent: -100,
              duration: 0.9,
            },
            1.35,
          )
          .to(
            '.hold-half-right',
            {
              xPercent: 100,
              duration: 0.9,
            },
            1.35,
          )
          .to('.hold-split', { opacity: 0, duration: 0.35 }, 1.35)
          .to(
            card,
            {
              autoAlpha: 0.12,
              scale: 0.72,
              duration: 0.55,
            },
            1.85,
          )
          .to(
            '.reveal-headline',
            {
              opacity: 1,
              scale: 1,
              duration: 0.7,
            },
            1.9,
          )
          .to({}, { duration: 0.35 })
      })

      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="pin-section hold-reveal">
      <div className="reveal-stage">
        <h2 className="reveal-headline">
          {HEADLINES.map((line) => (
            <span className="reveal-line" key={line}>
              {line}
            </span>
          ))}
        </h2>
      </div>

      <div className="hold-half hold-half-left">
        <p className="hold-nav">
          <span>[+] Navigation</span>
          <span>EN</span>
        </p>
        <img
          className="hold-left-image"
          src="/earbuds/03.jpg"
          alt="Wireless earbuds texture"
        />
        <h2 className="hold-brand">Aural</h2>
      </div>

      <div className="hold-half hold-half-right">
        <div className="hold-right-stack">
          <div className="hold-card-slot" />
          <div className="hold-copy">
            <p className="hold-role">Wireless · In-ear</p>
            <p className="hold-bio">
              True wireless buds that hold the mix, not the ear. Charge in the
              case. Play all day.
            </p>
          </div>
        </div>
      </div>

      <div className="hold-split">
        <span>Prev</span>
        <span>Next</span>
      </div>

      <article className="hold-card">
        <img
          className="hold-card-image"
          src="/earbuds/06.jpg"
          alt="Wireless earbuds"
        />
        <img
          className="hold-card-back"
          src="/earbuds/05.jpg"
          alt="Wireless earbuds reverse"
        />
      </article>
    </section>
  )
}
