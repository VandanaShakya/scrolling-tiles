import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { CASES } from '../data/cases'

gsap.registerPlugin(ScrollTrigger)

function CaseCard({ item }) {
  return (
    <article className="case-item">
      <div className="case-frame">
        <img
          className="case-image"
          src={item.image}
          alt={`${item.title} wireless earbuds`}
        />
      </div>
      <p className="case-meta">
        <span className="case-index">{item.id}</span>
        <span className="case-name">{item.title}</span>
      </p>
    </article>
  )
}

export default function CasesSection() {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      const items = gsap.utils.toArray('.case-item', sectionRef.current)

      gsap.set(items, { yPercent: 130, opacity: 0 })
      gsap.set('.cases-title', { opacity: 0, y: 28 })
      gsap.set('.cases-side', { opacity: 0 })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${160 + items.length * 35}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      })

      tl.to('.cases-title', { opacity: 1, y: 0, duration: 0.4 }, 0)
        .to('.cases-side', { opacity: 1, duration: 0.3 }, 0.08)
        .to(
          items,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.22,
          },
          0.12,
        )
        .to({}, { duration: 0.28 })
    },
    { scope: sectionRef },
  )

  const topRow = CASES.slice(0, 4)
  const bottomRow = CASES.slice(4)

  return (
    <section ref={sectionRef} className="pin-section cases-section">
      <div className="cases-layout">
        <div className="cases-row">
          {topRow.map((item) => (
            <CaseCard item={item} key={item.id} />
          ))}
        </div>

        <div className="cases-mid">
          <p className="cases-side cases-side-left">
            <span>[+] Navigation</span>
            <span>EN</span>
          </p>
          <h2 className="cases-title">Our Cases</h2>
          <p className="cases-side cases-side-right">
            Let&apos;s discuss ↗
          </p>
        </div>

        <div className="cases-row">
          {bottomRow.map((item) => (
            <CaseCard item={item} key={item.id} />
          ))}
        </div>
      </div>
    </section>
  )
}
