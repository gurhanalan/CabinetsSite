export default function Navbar() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a className="brand" href="#">
          <span className="logo-box" aria-hidden="true">K&B</span>
          <div className="brand-text">
            <strong>KNB Cabinets</strong>
            <span>Kitchen &amp; Bath</span>
          </div>
        </a>
        <nav className="nav-links">
          <a href="#kitchens">Kitchens</a>
          <a href="#bath">Bath</a>
          <a href="#about">About</a>
          <a href="#process">Process</a>
          <a href="#contact" className="btn btn--primary">Get a Quote</a>
        </nav>
      </div>
    </header>
  )
}
