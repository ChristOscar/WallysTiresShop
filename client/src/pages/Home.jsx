import { useEffect, useState } from 'react';

const SERVICES = [
  { icon: '🛞', title: 'New & Used Tires', desc: 'Huge selection of name-brand new tires and quality used tires at prices you can actually afford.' },
  { icon: '⚖️', title: 'Mounting & Balancing', desc: 'Professional mounting and precision balancing for a smooth, safe ride every time.' },
  { icon: '🔧', title: 'Flat Repair', desc: 'Fast flat repairs while you wait. Most repairs done in 20 minutes or less.' },
  { icon: '🔄', title: 'Tire Rotation', desc: 'Regular rotation extends tire life and keeps your vehicle handling right.' },
  { icon: '💿', title: 'Rim & Wheel Sales', desc: 'Quality rims and wheels for trucks, SUVs, and passenger cars in stock.' },
  { icon: '📡', title: 'TPMS Service', desc: 'Tire pressure monitoring system diagnostics, sensor replacement, and resets.' },
];

const BRANDS = [
  'Michelin', 'Goodyear', 'Bridgestone', 'Firestone', 'Continental',
  'BFGoodrich', 'Pirelli', 'Hankook', 'Kumho', 'Falken',
  'Cooper', 'Nitto', 'Toyo', 'General Tire', 'Nexen',
];

const REVIEWS = [
  {
    text: 'Excelente servicio, muy rápidos y honestos. Los recomiendo 100%! Llevo años viniendo aquí y siempre me tratan bien.',
    author: 'Maria G.',
    location: 'Royse City, TX',
  },
  {
    text: "Best tire shop in Royse City! Fixed my flat in 20 minutes. Great people, fair prices — won't go anywhere else.",
    author: 'Carlos R.',
    location: 'Rockwall, TX',
  },
  {
    text: "Wally and his team are the real deal. Fair price and fast service. My whole family comes here for all our tire needs.",
    author: 'Jesse M.',
    location: 'Fate, TX',
  },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="site-nav" style={scrolled ? { background: 'rgba(0,0,0,0.96)' } : {}}>
      <div className="nav-logo">
        <span className="nav-logo-name">Wally's Tires Shop</span>
        <span className="nav-logo-sub">Hablamos Español</span>
      </div>
      <ul className="nav-links">
        <li><a href="#services">Services</a></li>
        <li><a href="#brands">Brands</a></li>
        <li><a href="#reviews">Reviews</a></li>
        <li><a href="tel:+12146359189" className="nav-cta">📞 Call Now</a></li>
      </ul>
    </nav>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-bg-img" aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-badge">
            📍 Royse City, TX &nbsp;·&nbsp; Se Habla Español
          </div>

          <h1 className="hero-title">Your Community<br />Tire Shop</h1>
          <p className="hero-title-es">Tu Taller de Confianza</p>

          <p className="hero-sub">
            Serving Royse City & Rockwall County with honest prices,
            fast service, and bilingual staff. New & used tires,
            mounting, balancing, flat repair and more.
          </p>

          <div className="hero-actions">
            <a href="tel:+12146359189" className="btn btn-primary">
              📞 Call Now: (214) 635-9189
            </a>
            <a
              href="https://maps.google.com/?q=6960+TX-276+Royse+City+TX+75189"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              📍 Get Directions
            </a>
          </div>

          <div className="hero-hours">
            <div className="hours-badge">
              Mon–Sat &nbsp;<span>7:30AM – 8PM</span>
            </div>
            <div className="hours-badge">
              Sunday &nbsp;<span>10AM – 6PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="section" id="services">
        <div className="section-header">
          <span className="section-label">What We Do</span>
          <h2 className="section-title">Full-Service Tire Shop</h2>
          <p className="section-title-es">Todo lo que necesitas para tus llantas</p>
        </div>
        <div className="services-grid">
          {SERVICES.map(s => (
            <div key={s.title} className="service-card">
              <span className="service-icon">{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== BRANDS ===== */}
      <section className="section section-alt" id="brands">
        <div className="section-header">
          <span className="section-label">Tire Brands</span>
          <h2 className="section-title">Brands We Carry</h2>
          <p className="section-title-es">Las mejores marcas al mejor precio</p>
        </div>
        <div className="brands-grid">
          {BRANDS.map(b => (
            <div key={b} className="brand-card">{b}</div>
          ))}
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="section">
        <div className="section-header">
          <span className="section-label">Why Choose Us</span>
          <h2 className="section-title">More Than a Tire Shop</h2>
          <p className="section-title-es">Somos parte de tu comunidad</p>
        </div>
        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon">🇲🇽</div>
            <h3>Hablamos Español</h3>
            <p>Our bilingual staff makes everyone feel at home. English or Spanish — we've got you covered either way.</p>
          </div>
          <div className="why-card">
            <div className="why-icon">🏡</div>
            <h3>Community Roots</h3>
            <p>Family-owned and community-driven. We've been serving Rockwall County neighbors since day one — not a chain, not a franchise.</p>
          </div>
          <div className="why-card">
            <div className="why-icon">💵</div>
            <h3>Fair Prices</h3>
            <p>No dealership markups, no surprises. We quote it straight and charge what's fair. Used tires starting under $50.</p>
          </div>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section className="section section-alt" id="reviews">
        <div className="section-header">
          <span className="section-label">Customer Reviews</span>
          <h2 className="section-title">What People Are Saying</h2>
          <p className="section-title-es">Lo que dicen nuestros clientes</p>
        </div>
        <div className="reviews-grid">
          {REVIEWS.map(r => (
            <div key={r.author} className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"{r.text}"</p>
              <div className="review-author">{r.author}</div>
              <div className="review-source">{r.location} · Google Review</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FIND US ===== */}
      <section className="section" id="contact" style={{ background: '#fafafa' }}>
        <div className="section-header">
          <span className="section-label">Find Us</span>
          <h2 className="section-title">Come See Us</h2>
          <p className="section-title-es">Estamos aquí para ayudarte</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '32px',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gray-mid)' }}>Address</h4>
            <p style={{ fontSize: '1rem', lineHeight: 1.8 }}>
              6960 TX-276<br />
              Royse City, TX 75189
            </p>
            <a
              href="https://maps.google.com/?q=6960+TX-276+Royse+City+TX+75189"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-small"
              style={{ marginTop: 16, display: 'inline-flex', textDecoration: 'none' }}
            >
              📍 Open in Google Maps
            </a>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gray-mid)' }}>Hours</h4>
            <table style={{ borderCollapse: 'collapse', fontSize: '0.92rem' }}>
              <tbody>
                {[
                  ['Monday – Saturday', '7:30 AM – 8:00 PM'],
                  ['Sunday', '10:00 AM – 6:00 PM'],
                ].map(([day, hrs]) => (
                  <tr key={day}>
                    <td style={{ paddingRight: 20, paddingBottom: 6, fontWeight: 600 }}>{day}</td>
                    <td style={{ paddingBottom: 6, color: 'var(--gray-mid)' }}>{hrs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gray-mid)' }}>Contact</h4>
            <p style={{ lineHeight: 2 }}>
              <a href="tel:+12146359189" style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--red)' }}>
                (214) 635-9189
              </a><br />
              <span style={{ fontSize: '0.88rem', color: 'var(--gray-mid)' }}>Hablamos Español 🇲🇽</span>
            </p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-brand">
              <div className="footer-brand-name">Wally's Tires Shop</div>
              <div className="footer-brand-tagline">Hablamos Español 🇲🇽</div>
            </div>
            <p>Family-owned tire shop serving Royse City and Rockwall County. New & used tires, mounting, balancing, flat repair.</p>
            <a
              href="https://maps.google.com/?q=6960+TX-276+Royse+City+TX+75189"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-maps-btn"
            >
              📍 Get Directions
            </a>
          </div>

          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              {['New & Used Tires', 'Mounting & Balancing', 'Flat Repair', 'Tire Rotation', 'Rim & Wheel Sales', 'TPMS Service'].map(s => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Hours</h4>
            <p>Mon–Sat: 7:30AM – 8:00PM</p>
            <p>Sunday: 10:00AM – 6:00PM</p>
            <h4 style={{ marginTop: 24 }}>Phone</h4>
            <p><a href="tel:+12146359189">(214) 635-9189</a></p>
            <h4 style={{ marginTop: 24 }}>Address</h4>
            <p>6960 TX-276<br />Royse City, TX 75189</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Wally's Tires Shop. All rights reserved.</p>
          <p>Royse City, TX · Rockwall County · Se Habla Español</p>
        </div>
      </footer>
    </>
  );
}
