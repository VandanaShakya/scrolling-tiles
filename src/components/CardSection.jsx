import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { CARDS } from '../data/cards'

gsap.registerPlugin(ScrollTrigger)

export default function CardSection() {
  const sectionRef = useRef(null)
  const countRef = useRef(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const ring = section.querySelector('.card-ring')
      const tiles = gsap.utils.toArray('.tile', section)
      const count = countRef.current
      const n = tiles.length

      const mm = gsap.matchMedia()

      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)',
        },
        (context) => {
          const { isDesktop } = context.conditions
          const radius = isDesktop ? 430 : 210

          gsap.set(ring, {
            rotationX: 14,
            rotationY: 0,
            z: -radius,
            transformStyle: 'preserve-3d',
            transformPerspective: 1600,
          })

          tiles.forEach((tile, i) => {
            const angle = (i / n) * Math.PI * 2
            gsap.set(tile, {
              x: Math.sin(angle) * radius,
              y: 0,
              z: Math.cos(angle) * radius,
              rotationY: (i / n) * 360,
              rotationX: 0,
              yPercent: 0,
              scale: 1,
              zIndex: n - i,
            })
          })

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: `+=${280 + n * 95}%`,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
            },
          })

          tl.to('.cards-label', { opacity: 1, duration: 0.3 }, 0)
            .to(count, { opacity: 1, duration: 0.3 }, 0)

          tl.to(
            ring,
            {
              rotationY: -360,
              duration: 2.6,
            },
            0.1,
          )

          tl.set(ring, { rotationY: 0 })

          tl.to(
            ring,
            {
              rotationX: 0,
              z: 0,
              duration: 0.85,
            },
            'collapse',
          )

          tiles.forEach((tile, i) => {
            tl.to(
              tile,
              {
                x: 0,
                z: i === 0 ? 40 : 0,
                rotationY: 0,
                zIndex: i === 0 ? n + 2 : n - i,
                duration: 0.85,
              },
              'collapse',
            )
          })

          tl.to(
            tiles.slice(1),
            {
              yPercent: 145,
              rotationX: 22,
              duration: 0.7,
            },
            'collapse+=0.28',
          )

          for (let i = 1; i < n; i += 1) {
            const at = `card-${i}`

            tl.to(
              tiles[i - 1],
              {
                yPercent: -145,
                rotationX: -22,
                z: -80,
                duration: 1,
              },
              at,
            )

            tl.to(
              tiles[i],
              {
                yPercent: 0,
                rotationX: 0,
                z: 40,
                zIndex: n + i + 2,
                duration: 1,
              },
              at,
            )

            tl.call(
              () => {
                if (count) {
                  count.textContent = `${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`
                }
              },
              undefined,
              at,
            )
          }
        },
      )

      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="pin-section cards-section">
      <p className="cards-label" style={{ opacity: 0 }}>
        Wireless
      </p>
      <p ref={countRef} className="cards-count" style={{ opacity: 0 }}>
        01 / 06
      </p>

      <div className="card-stage">
        <div className="card-ring">
          {CARDS.map((card) => (
            <article className="tile" key={card.id}>
              <div className="tile-face">
                <img
                  className="tile-image"
                  src={card.image}
                  alt={`${card.title} wireless earbuds`}
                />
                <div>
                  <div className="tile-index">{card.id}</div>
                  <div className="tile-tag">{card.tag}</div>
                </div>
                <div>
                  <h2 className="tile-title">{card.title}</h2>
                  <p className="tile-copy">{card.copy}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
