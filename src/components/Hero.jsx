export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="container hero-content">
        <h1>
          Custom Kitchen &amp; Bath Cabinets<br />
          <span className="accent">Wholesale • In-House Production</span>
        </h1>
        <p>
          From design to install—durable frames, premium finishes, and lead times you can count on.
        </p>
        <div className="hero-actions">
          <a href="#contact" className="btn btn--primary">Request a Free Measure</a>
          <a href="#kitchens" className="btn btn--ghost">Explore Styles</a>
        </div>
        <div className="hero-badges">
          <span>Custom Colors</span>
          <span>Soft-Close Hardware</span>
          <span>Warranty</span>
          <span>Trade Pricing</span>
        </div>
      </div>
      {/* Background image via CSS */}
    </section>
  )
}

