import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { BLOCKS } from '../data/blocks'

gsap.registerPlugin(ScrollTrigger)

export default function BlockSection() {
  const sectionRef = useRef(null)
  const countRef = useRef(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const cards = gsap.utils.toArray('.block', section)
      const count = countRef.current
      const n = cards.length

      cards.forEach((card, i) => {
        gsap.set(card, {
          yPercent: i === 0 ? 0 : 130,
          rotationX: i === 0 ? 0 : 18,
          z: i === 0 ? 40 : 0,
          scale: 1,
          zIndex: n - i,
        })
      })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${160 + (n - 1) * 130}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      })

      tl.to('.blocks-label', { opacity: 1, duration: 0.3 }, 0)
        .to(count, { opacity: 1, duration: 0.3 }, 0)
        .to({}, { duration: 0.22 })

      for (let i = 1; i < n; i += 1) {
        const at = `block-${i}`

        tl.to(
          cards[i - 1],
          {
            yPercent: -130,
            rotationX: -18,
            z: -80,
            duration: 1,
          },
          at,
        )

        tl.to(
          cards[i],
          {
            yPercent: 0,
            rotationX: 0,
            z: 40,
            zIndex: n + i,
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

      tl.to({}, { duration: 0.22 })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="pin-section blocks-section">
      <p className="blocks-label" style={{ opacity: 0 }}>
        More
      </p>
      <p ref={countRef} className="blocks-count" style={{ opacity: 0 }}>
        01 / 04
      </p>

      <div className="blocks-stage">
        <div className="blocks-deck">
          {BLOCKS.map((block) => (
            <article className="block" key={block.id}>
              <div className="block-face">
                <img
                  className="block-image"
                  src={block.image}
                  alt={`${block.title} wireless earbuds`}
                />
                <div>
                  <div className="block-index">{block.id}</div>
                  <div className="block-kicker">More</div>
                </div>
                <div className="block-body">
                  <h2 className="block-title">{block.title}</h2>
                  <p className="block-copy">{block.copy}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
