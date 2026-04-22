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

export default function HeroSearch() {
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
    <>
      {/* Text search */}
      <form
        onSubmit={e => {
          e.preventDefault();
          if (textSearch.trim().length >= 2)
            router.push('/marketplace?q=' + encodeURIComponent(textSearch.trim()));
        }}
        style={{ marginBottom: '16px' }}
      >
        <div
          style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <input
            type="text"
            value={textSearch}
            onChange={e => setTextSearch(e.target.value)}
            placeholder="Pretrazi po nazivu, broju dela, brendu..."
            style={{
              flex: 1,
              padding: '14px 16px',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '15px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            data-testid="hero-search-btn"
            style={{
              padding: '14px 24px',
              background: '#f9372c',
              border: 'none',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '1px',
            }}
          >
            PRETRAZI
          </button>
        </div>
      </form>

      {/* Vehicle search */}
      <div
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '20px',
        }}
      >
        <p
          style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          Ili izaberite vozilo
        </p>
        <div
          className="search-bar"
          style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}
        >
          <select
            value={make}
            onChange={e => { setMake(e.target.value); setModel(''); setEngine(''); }}
            style={{ ...sel, color: make ? '#fff' : '#888' }}
            data-testid="hero-make"
          >
            <option value="">MARKA</option>
            {vehicleMakes.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select
            value={model}
            onChange={e => { setModel(e.target.value); setEngine(''); }}
            style={{ ...sel, color: model ? '#fff' : '#888' }}
            disabled={!make}
            data-testid="hero-model"
          >
            <option value="">MODEL</option>
            {models.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select
            value={year}
            onChange={e => setYear(e.target.value)}
            style={{ ...sel, color: year ? '#fff' : '#888' }}
            data-testid="hero-year"
          >
            <option value="">GODISTE</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select
            value={engine}
            onChange={e => setEngine(e.target.value)}
            style={{ ...sel, color: engine ? '#fff' : '#888' }}
            disabled={!model}
            data-testid="hero-engine"
          >
            <option value="">MOTOR</option>
            {engines.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <button
            onClick={handleSearch}
            data-testid="hero-vehicle-search-btn"
            style={{
              background: '#f9372c',
              color: '#fff',
              border: 'none',
              padding: '0 32px',
              height: '48px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#e02a20')}
            onMouseLeave={e => (e.currentTarget.style.background = '#f9372c')}
          >
            PRETRAGA
          </button>
        </div>
      </div>
    </>
  );
}
