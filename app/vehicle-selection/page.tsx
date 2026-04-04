'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { vehicleMakes, getModels, getEngines, getYears } from '../lib/data';

type Step = 1 | 2 | 3 | 4;

export default function VehicleSelection() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [engine, setEngine] = useState('');

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

  const stepLabels = ['Marka', 'Model', 'Godiste', 'Motor'];
  const stepValues = [make, model, year, engine];

  const cardStyle = (active: boolean, selected: boolean, value: string): React.CSSProperties => ({
    padding: '14px 20px',
    borderRadius: '10px',
    border: '1px solid',
    borderColor: selected ? '#f9372c' : active ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)',
    background: selected ? 'rgba(249,55,44,0.1)' : 'transparent',
    color: selected ? '#f9372c' : active ? '#fff' : 'rgba(255,255,255,0.5)',
    cursor: active ? 'pointer' : 'default',
    fontSize: '14px',
    fontWeight: selected ? 600 : 400,
    transition: 'all 0.15s',
  });

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: '64px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(12,13,15,0.95)', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>AutoDelovi<span style={{ color: '#f9372c' }}>.sale</span></span>
        </Link>
        <div style={{ display: 'flex', gap: '32px' }}>
          <Link href="/marketplace" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', letterSpacing: '1px', textDecoration: 'none' }}>MARKETPLACE</Link>
          <Link href="/suppliers" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', letterSpacing: '1px', textDecoration: 'none' }}>DOBAVLJACI</Link>
          <Link href="/vehicle-selection" style={{ color: '#f9372c', fontWeight: 600, fontSize: '13px', letterSpacing: '1px', textDecoration: 'none', borderBottom: '2px solid #f9372c', paddingBottom: '2px' }}>IZBOR VOZILA</Link>
          <Link href="/comparison" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', letterSpacing: '1px', textDecoration: 'none' }}>POREDENJE</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>Izbor vozila</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>Odaberite vase vozilo korak po korak kako bismo pronasli tacno prave delove.</p>
        </div>

        {/* Step progress */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '40px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '4px', border: '1px solid rgba(255,255,255,0.08)' }}>
          {stepLabels.map((label, i) => {
            const stepNum = (i + 1) as Step;
            const isActive = step === stepNum;
            const isCompleted = stepValues[i] !== '';
            return (
              <button key={i} onClick={() => { if (i === 0 || stepValues[i-1]) setStep(stepNum); }} style={{ flex: 1, padding: '12px 8px', borderRadius: '8px', border: 'none', background: isActive ? 'rgba(249,55,44,0.15)' : 'transparent', color: isActive ? '#f9372c' : isCompleted ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)', fontSize: '13px', fontWeight: isActive ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
                <div style={{ fontSize: '10px', marginBottom: '2px', letterSpacing: '1px', textTransform: 'uppercase' }}>Korak {i+1}</div>
                <div>{isCompleted && !isActive ? stepValues[i] : label}</div>
              </button>
            );
          })}
        </div>

        {/* Step content */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px' }}>
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Izaberite marku vozila</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
                {vehicleMakes.map(m => (
                  <button key={m} onClick={() => { setMake(m); setModel(''); setEngine(''); setStep(2); }} style={cardStyle(true, make === m, m)}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Izaberite model — <span style={{ color: '#f9372c' }}>{make}</span></h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                {models.map(m => (
                  <button key={m} onClick={() => { setModel(m); setEngine(''); setStep(3); }} style={cardStyle(true, model === m, m)}>
                    {m}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} style={{ marginTop: '20px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '13px' }}>← Nazad</button>
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Izaberite godiste — <span style={{ color: '#f9372c' }}>{make} {model}</span></h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                {years.map(y => (
                  <button key={y} onClick={() => { setYear(y); setStep(4); }} style={cardStyle(true, year === y, y)}>
                    {y}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} style={{ marginTop: '20px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '13px' }}>← Nazad</button>
            </div>
          )}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Izaberite motor — <span style={{ color: '#f9372c' }}>{make} {model} {year}</span></h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px', marginBottom: '28px' }}>
                {engines.map(e => (
                  <button key={e} onClick={() => setEngine(e)} style={cardStyle(true, engine === e, e)}>
                    {e}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <button onClick={handleSearch} style={{ flex: 1, background: '#f9372c', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.5px' }}>
                  Nadji delove za {make} {model}
                </button>
                <button onClick={() => setStep(3)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', padding: '14px 20px', borderRadius: '10px', fontSize: '13px', cursor: 'pointer' }}>← Nazad</button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        {(make || model || year || engine) && (
          <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px 20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1px' }}>Odabrano:</span>
            {[make, model, year, engine].filter(Boolean).map((v, i) => (
              <span key={i} style={{ fontSize: '13px', color: '#fff', background: 'rgba(255,255,255,0.07)', padding: '4px 12px', borderRadius: '20px' }}>{v}</span>
            ))}
            {make && model && (
              <button onClick={handleSearch} style={{ marginLeft: 'auto', background: '#f9372c', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                Trazi delove →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
