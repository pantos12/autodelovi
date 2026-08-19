'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { vehicleMakes, getModels, getEngines, getYears } from '../lib/data';

const sel: React.CSSProperties = {
  background: '#1a1c1e',
  border: '1px solid #2a2c2e',
  color: '#888',
  padding: '0 16px',
  height: '48px',
  borderRadius: '8px',
  fontSize: '14px',
  flex: 1,
  minWidth: '120px',
  cursor: 'pointer',
  outline: 'none',
  appearance: 'none',
  WebkitAppearance: 'none',
};

export default function HomeHero() {
  const router = useRouter();
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [engine, setEngine] = useState('');
  const [textSearch, setTextSearch] = useState('');

  const models = getModels(make);
  const engines = getEngines(make, model);
  const years = getYears();

  function handleSearch() {
    const params = new URLSearchParams();
    if (make) params.set('make', make);
    if (model) params.set('model', model);
    if (year) params.set('year', year);
    if (engine) params.set('engine', engine);
    router.push('/marketplace?' + params.toString());
  }

  return (
    <main className="hero-pad" style={{ position: 'relative', zIndex: 5, maxWidth: '900px', margin: '0 auto', padding: '80px 24px 60px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(249,55,44,0.1)', border: '1px solid rgba(249,55,44,0.25)', borderRadius: '20px', padding: '6px 16px', marginBottom: '32px' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f9372c', display: 'inline-block' }} />
        <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1.5px', color: '#f9372c', textTransform: 'uppercase' }}>Premium Marketplace</span>
      </div>
      <h1 className="hero-title" style={{ fontSize: 'clamp(42px, 8vw, 80px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '8px' }}>
        <span style={{ color: 'rgba(255,255,255,0.45)', display: 'block' }}>SVI DELOVI NA</span>
        <span style={{ color: '#fff', display: 'block' }}>JEDNOM MESTU.</span>
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', marginBottom: '40px', maxWidth: '480px', lineHeight: 1.6 }}>
        Agregiramo delimicno skladiste od 50,000+ delova od 200+ proverenih dobavljaca sirom Srbije.
      </p>

      <form onSubmit={e => { e.preventDefault(); if (textSearch.trim().length >= 2) router.push('/marketplace?q=' + encodeURIComponent(textSearch.trim())); }} style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
          <input
            type="text"
            value={textSearch}
            onChange={e => setTextSearch(e.target.value)}
            placeholder="Pretrazi po nazivu, broju dela, brendu..."
            style={{ flex: 1, padding: '14px 16px', background: 'transparent', border: 'none', color: '#fff', fontSize: '15px', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '14px 24px', background: '#f9372c', border: 'none', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', letterSpacing: '1px' }}>
            PRETRAZI
          </button>
        </div>
      </form>

      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Ili izaberite vozilo</p>
        <div className="search-bar" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={make} onChange={e => { setMake(e.target.value); setModel(''); setEngine(''); }} style={{ ...sel, color: make ? '#fff' : '#888' }}>
            <option value="">MARKA</option>
            {vehicleMakes.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={model} onChange={e => { setModel(e.target.value); setEngine(''); }} style={{ ...sel, color: model ? '#fff' : '#888' }} disabled={!make}>
            <option value="">MODEL</option>
            {models.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={year} onChange={e => setYear(e.target.value)} style={{ ...sel, color: year ? '#fff' : '#888' }}>
            <option value="">GODISTE</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={engine} onChange={e => setEngine(e.target.value)} style={{ ...sel, color: engine ? '#fff' : '#888' }} disabled={!model}>
            <option value="">MOTOR</option>
            {engines.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <button onClick={handleSearch} style={{ background: '#f9372c', color: '#fff', border: 'none', padding: '0 32px', height: '48px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', flexShrink: 0 }}
            onMouseEnter={e => (e.currentTarget.style.background = '#e02a20')}
            onMouseLeave={e => (e.currentTarget.style.background = '#f9372c')}>
            PRETRAGA
          </button>
        </div>
      </div>
    </main>
  );
}
