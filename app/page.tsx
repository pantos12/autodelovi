export default function Home() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', 'Helvetica Neue', sans-serif", position: 'relative' }}>

      {/* Dotted background */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'radial-gradient(circle, #2a2a2a 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: 0.4, pointerEvents: 'none', zIndex: 0
      }} />

      {/* NAV */}
      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 48px', borderBottom: '1px solid #1e2023' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <span style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '0.02em' }}>
            <span style={{ color: '#fff' }}>Auto</span><span style={{ color: '#e63946' }}>Delovi</span><span style={{ color: '#fff' }}>.sale</span>
          </span>
          <div style={{ display: 'flex', gap: '28px', fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em' }}>
            <a href="#" style={{ color: '#e63946', textDecoration: 'none', borderBottom: '2px solid #e63946', paddingBottom: '2px' }}>MARKETPLACE</a>
            <a href="#" style={{ color: '#888', textDecoration: 'none' }}>SUPPLIERS</a>
            <a href="#" style={{ color: '#888', textDecoration: 'none' }}>VEHICLE SELECTION</a>
            <a href="#" style={{ color: '#888', textDecoration: 'none' }}>COMPARISON</a>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', color: '#888' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 17H5a3 3 0 0 1-3-3V8a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v6a3 3 0 0 1-3 3z"/><circle cx="12" cy="17" r="1"/></svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 48px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.25)', borderRadius: '4px', padding: '6px 18px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', color: '#e63946', marginBottom: '32px' }}>
          PREMIUM DETAIL
        </div>
        <h1 style={{ fontSize: 'clamp(42px, 6vw, 76px)', fontWeight: 900, lineHeight: 1.0, marginBottom: '22px', letterSpacing: '-0.02em' }}>
          <span style={{ color: '#fff', display: 'block' }}>SVI DELOVI NA</span>
          <em style={{ color: '#e63946', display: 'block', fontStyle: 'italic' }}>JEDNOM MESTU.</em>
        </h1>
        <p style={{ color: '#777', fontSize: '15px', maxWidth: '460px', margin: '0 auto 44px', lineHeight: 1.65 }}>
          Pronađite najbolje cene iz 18+ izvora u Srbiji uz inženjersku preciznost i real-time proveru zaliha.
        </p>

        {/* Search Bar */}
        <div style={{ display: 'flex', maxWidth: '780px', margin: '0 auto', background: '#141618', border: '1px solid #252829', borderRadius: '8px', overflow: 'hidden' }}>
          {[
            { label: 'MARKA', placeholder: 'Odaberi Marku' },
            { label: 'MODEL', placeholder: 'Odaberi Model' },
            { label: 'GODIŠTE', placeholder: 'Godina' },
            { label: 'MOTOR', placeholder: 'Tip Motora' },
          ].map((f, i) => (
            <div key={i} style={{ flex: 1, padding: '14px 20px', borderRight: '1px solid #252829', cursor: 'pointer' }}>
              <div style={{ fontSize: '10px', color: '#555', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '5px' }}>{f.label}</div>
              <div style={{ fontSize: '13px', color: '#888', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{f.placeholder}</span>
                <span style={{ color: '#444', fontSize: '10px' }}>▾</span>
              </div>
            </div>
          ))}
          <button style={{ background: '#e63946', color: '#fff', border: 'none', padding: '0 28px', fontWeight: 700, fontSize: '12px', letterSpacing: '0.1em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            PRETRAGA
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ position: 'relative', zIndex: 1, padding: '20px 48px 60px', maxWidth: '1140px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {[
          { icon: '☰', title: 'Agregirano pretraživanje', desc: 'Pristupite bazama podataka preko 18 najvećih dobavljača u Srbiji u jednoj sekundi. Nema više zvanja telefonom.' },
          { icon: '↻', title: 'Real-time provera zaliha', desc: 'Naš sistem se sinhronizuje u realnom vremenu. Ono što vidite na ekranu je dostupno odmah za slanje.' },
          { icon: '⇄', title: 'OE Cross-referencing', desc: 'Pametno mapiranje originalnih brojeva sa zamenskim delovima uz 99.9% preciznosti kompatibilnosti.' },
        ].map((f, i) => (
          <div key={i} style={{ background: '#101213', border: '1px solid #1c1f22', borderRadius: '14px', padding: '28px' }}>
            <div style={{ width: '42px', height: '42px', background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.18)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '18px', color: '#e63946' }}>
              {f.icon}
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px', color: '#fff' }}>{f.title}</h3>
            <p style={{ fontSize: '13px', color: '#5a5e63', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CATEGORIES */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 48px 90px', maxWidth: '1140px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', color: '#444', marginBottom: '8px' }}>KATEGORIJE</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <h2 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
            PRONAĐI PO <em style={{ color: '#e63946' }}>SISTEMU.</em>
          </h2>
          <a href="#" style={{ color: '#e63946', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Sve kategorije <span>→</span>
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* MOTOR - large */}
          <div style={{ background: 'linear-gradient(160deg, #161819 0%, #0d0e10 100%)', border: '1px solid #1c1f22', borderRadius: '18px', padding: '36px', minHeight: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -60%)', fontSize: '160px', opacity: 0.06, lineHeight: 1 }}>⚙</div>
            <div style={{ fontSize: '12px', color: '#e63946', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '6px' }}>Klipovi, ventili, zaptivke, kaiševi.</div>
            <div style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.02em' }}>MOTOR</div>
            <button style={{ marginTop: '18px', alignSelf: 'flex-start', background: 'transparent', border: '1px solid #e63946', color: '#e63946', padding: '9px 22px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.08em' }}>
              ISTRAŽI
            </button>
          </div>

          {/* 3 smaller cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { name: 'KOČNICE', sub: 'Pločice, Diskovi, ABS senzori', emoji: '🐕' },
              { name: 'ELEKTRONIKA', sub: 'Senzori, ECU, Akumulatori', emoji: '⚡' },
              { name: 'KAROSERIJA', sub: 'Farovi, Branici, Retrovizori', emoji: '◈' },
            ].map((cat, i) => (
              <div key={i} style={{ background: 'linear-gradient(160deg, #161819 0%, #0d0e10 100%)', border: '1px solid #1c1f22', borderRadius: '18px', padding: '24px 28px', minHeight: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative', overflow: 'hidden', cursor: 'pointer', gridColumn: i === 2 ? '1 / -1' : undefined }}>
                <div style={{ position: 'absolute', top: '14px', right: '18px', fontSize: '28px', opacity: 0.25 }}>{cat.emoji}</div>
                <div style={{ fontSize: '11px', color: '#444', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '5px' }}>{cat.sub}</div>
                <div style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.01em' }}>{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
