import './index.css'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import ZohoForm from './components/ZohoForm.jsx'

function Section({ id, title, children, className = '' }) {
  return (
    <section id={id} className={`section ${className}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        {children}
      </div>
    </section>
  )
}

function Features() {
  const items = [
    { title: 'In-House Production', desc: 'Cabinets built locally for quality, speed, and consistency.' },
    { title: 'Trade & Retail', desc: 'Serving contractors, designers, and homeowners with transparent pricing.' },
    { title: 'Custom Colors & Sizes', desc: 'Endless options with durable finishes and soft-close hardware.' },
    { title: 'Fast Lead Times', desc: 'From design to install, schedules you can trust.' },
  ]
  return (
    <div className="features-grid">
      {items.map((f) => (
        <div key={f.title} className="feature-card">
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
        </div>
      ))}
    </div>
  )
}

function Gallery() {
  const items = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    label: i % 2 === 0 ? 'Kitchen' : 'Bath',
  }))
  return (
    <div className="gallery-grid">
      {items.map((it) => (
        <article key={it.id} className="gallery-card">
          <div className="gallery-image" aria-hidden="true" />
          <div className="gallery-meta">
            <span className="tag">{it.label}</span>
            <h3>Project {it.id + 1}</h3>
          </div>
        </article>
      ))}
    </div>
  )
}

function Process() {
  const steps = [
    { n: '01', t: 'Design & Measure', d: 'We capture measurements and goals, then propose layouts and finishes.' },
    { n: '02', t: 'Build', d: 'Your order moves to production with quality checks at each stage.' },
    { n: '03', t: 'Deliver & Install', d: 'Coordinated delivery and install, with jobsite-ready packaging.' },
  ]
  return (
    <ol className="process">
      {steps.map((s) => (
        <li key={s.n}>
          <div className="step-num">{s.n}</div>
          <div>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

function Testimonials() {
  const quotes = [
    { q: 'Great pricing and cabinets arrived on time. Install was smooth.', a: 'Homeowner' },
    { q: 'My go-to for remodels—reliable lead times and finishes.', a: 'Contractor' },
    { q: 'Design team is responsive and helpful. Clients love the look.', a: 'Designer' },
  ]
  return (
    <div className="testimonials">
      {quotes.map((x, i) => (
        <blockquote key={i}>
          <p>“{x.q}”</p>
          <footer>— {x.a}</footer>
        </blockquote>
      ))}
    </div>
  )
}

function CTA() {
  return (
    <Section id="contact" className="cta">
      <div className="cta-inner">
        <ZohoForm />
      </div>
    </Section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="brand">
          <span className="logo-box" aria-hidden="true">K&B</span>
          <div className="brand-text">
            <strong>KNB Cabinets</strong>
            <span>Kitchen & Bath</span>
          </div>
        </div>
        <nav className="footer-links">
          <a href="#kitchens">Kitchens</a>
          <a href="#bath">Bath</a>
          <a href="#about">About</a>
          <a href="#process">Process</a>
        </nav>
        <p className="copy">© {new Date().getFullYear()} KNB Cabinets. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="site">
      <Navbar />
      <main>
        <Hero />
        <Section id="features" title="Why KNB?">
          <Features />
        </Section>
        <Section id="kitchens" title="Recent Projects">
          <Gallery />
        </Section>
        <Section id="process" title="Our Process">
          <Process />
        </Section>
        <Section id="reviews" title="What Customers Say">
          <Testimonials />
        </Section>
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
