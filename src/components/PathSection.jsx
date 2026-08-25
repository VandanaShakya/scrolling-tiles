import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { PATH_CARDS } from '../data/pathCards'

gsap.registerPlugin(ScrollTrigger)

function bezierPoint(t, p0, p1, p2) {
  const u = 1 - t
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  }
}

export default function PathSection() {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const cards = gsap.utils.toArray('.path-card', section)
      const n = cards.length
      const spacing = 0.16
      const proxy = { p: 0 }

      const mm = gsap.matchMedia()

      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)',
        },
        (context) => {
          const { isDesktop } = context.conditions
          const w = () => window.innerWidth
          const h = () => window.innerHeight

          const points = () =>
            isDesktop
              ? {
                  p0: { x: -w() * 0.46, y: h() * 0.34 },
                  p1: { x: w() * 0.1, y: h() * 0.36 },
                  p2: { x: w() * 0.44, y: -h() * 0.36 },
                }
              : {
                  p0: { x: -w() * 0.42, y: h() * 0.3 },
                  p1: { x: w() * 0.06, y: h() * 0.32 },
                  p2: { x: w() * 0.38, y: -h() * 0.3 },
                }

          const place = (p) => {
            const { p0, p1, p2 } = points()

            cards.forEach((card, i) => {
              const t = (i - 2) * spacing + p
              const { x, y } = bezierPoint(t, p0, p1, p2)
              const visibleT = gsap.utils.clamp(0, 1, t)
              const scale = gsap.utils.mapRange(0, 1, 1.15, 0.28, visibleT)
              const hidden = t < -0.12 || t > 1.1

              gsap.set(card, {
                x,
                y,
                xPercent: -50,
                yPercent: -50,
                scale,
                rotationZ: t * 18,
                rotationY: -12 + t * 26,
                rotationX: 6 - visibleT * 4,
                zIndex: Math.round(scale * 100),
                autoAlpha: hidden ? 0 : 1,
              })
            })
          }

          place(0)

          gsap.to(proxy, {
            p: 1.35,
            ease: 'none',
            onUpdate: () => place(proxy.p),
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: `+=${240 + n * 55}%`,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: () => place(proxy.p),
            },
          })
        },
      )

      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="pin-section path-section">
      <p className="path-label">Wireless</p>

      <div className="path-stage">
        {PATH_CARDS.map((card) => (
          <article className="path-card" key={card.id}>
            <div className="path-card-face">
              <img
                className="path-card-image"
                src={card.image}
                alt={`${card.title} wireless earbuds`}
              />
              <div>
                <div className="path-card-index">{card.id}</div>
                <div className="path-card-tag">{card.tag}</div>
              </div>
              <h2 className="path-card-title">{card.title}</h2>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
