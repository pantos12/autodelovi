'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { vehicleData, getModels, getEngines, getYears } from '../lib/data';

const steps = ['Marka', 'Model', 'Godište', 'Motor'];

export default function VehicleSelection() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [engine, setEngine] = useState('');

  const makes = Object.keys(vehicleData);
  const models = make ? getModels(make) : [];
  const engines = make && model ? getEngines(make, model) : [];
  const years = getYears();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (make) params.set('make', make);
    if (model) params.set('model', model);
    if (year) params.set('year', year);
    if (engine) params.set('engine', engine);
    router.push('/marketplace?' + params.toString());
  };

  const canProceed = () => {
    if (step === 0) return !!make;
    if (step === 1) return !!model;
    if (step === 2) return !!year;
    return !!engine;
  };

  const s = {
    page: { background: '#0c0d0f', minHeight: '100vh', padding: '40px 16px' } as React.CSSProperties,
    container: { maxWidth: '600px', margin: '0 auto' } as React.CSSProperties,
    card: { background: '#1a1b1f', borderRadius: '16px', padding: '32px', border: '1px solid #252629' } as React.CSSProperties,
    stepBtn: (active: boolean, done: boolean): React.CSSProperties => ({
      width: '32px', height: '32px', borderRadius: '50%', border: 'none', cursor: 'pointer',
      background: done ? '#22c55e' : active ? '#f9372c' : '#333',
      color: '#fff', fontWeight: 700, fontSize: '14px',
    }),
    optionBtn: (selected: boolean): React.CSSProperties => ({
      width: '100%', padding: '14px 16px', background: selected ? '#f9372c' : '#252629',
      border: selected ? '2px solid #f9372c' : '2px solid transparent',
      borderRadius: '10px', color: '#fff', cursor: 'pointer', textAlign: 'left', fontSize: '15px',
      fontWeight: selected ? 600 : 400, marginBottom: '8px',
    }),
    navBtn: (primary: boolean): React.CSSProperties => ({
      padding: '12px 24px', background: primary ? '#f9372c' : '#333',
      border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer',
      fontSize: '15px', fontWeight: 600, opacity: primary && !canProceed() ? 0.5 : 1,
    }),
  };

  const renderOptions = (items: string[], selected: string, onSelect: (v: string) => void) => (
    <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
      {items.map(item => (
        <button key={item} style={s.optionBtn(selected === item)} onClick={() => onSelect(item)}>
          {item}
        </button>
      ))}
    </div>
  );

  const getStepContent = () => {
    if (step === 0) return renderOptions(makes, make, v => { setMake(v); setModel(''); setEngine(''); });
    if (step === 1) return renderOptions(models, model, v => { setModel(v); setEngine(''); });
    if (step === 2) return renderOptions(years, year, setYear);
    if (step === 3) return renderOptions(engines, engine, setEngine);
    return null;
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
            Odaberite <span style={{ color: '#f9372c' }}>Vaše Vozilo</span>
          </h1>
          <p style={{ color: '#aaa', fontSize: '15px' }}>Pronađite delove koji odgovaraju vašem automobilu</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', gap: '0' }}>
          {steps.map((s_label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <button style={s.stepBtn(i === step, i < step)} onClick={() => i < step && setStep(i)}>
                  {i < step ? '✓' : i + 1}
                </button>
                <span style={{ color: i === step ? '#f9372c' : i < step ? '#22c55e' : '#555', fontSize: '11px' }}>{s_label}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: '48px', height: '2px', background: i < step ? '#22c55e' : '#333', margin: '0 4px 16px' }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={s.card}>
          <h2 style={{ color: '#fff', fontSize: '20px', marginBottom: '20px' }}>
            {step === 0 && 'Odaberite marku vozila'}
            {step === 1 && `Odaberite model za ${make}`}
            {step === 2 && 'Odaberite godište'}
            {step === 3 && 'Odaberite motor'}
          </h2>
          {getStepContent()}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            {step > 0 ? (
              <button style={s.navBtn(false)} onClick={() => setStep(s => s - 1)}>← Nazad</button>
            ) : <div />}
            {step < 3 ? (
              <button style={s.navBtn(true)} disabled={!canProceed()} onClick={() => setStep(s => s + 1)}>
                Dalje →
              </button>
            ) : (
              <button style={s.navBtn(true)} disabled={!canProceed()} onClick={handleSearch}>
                🔍 Nađi delove
              </button>
            )}
          </div>
        </div>

        {/* Summary */}
        {(make || model || year || engine) && (
          <div style={{ marginTop: '20px', background: '#1a1b1f', borderRadius: '12px', padding: '16px', border: '1px solid #333' }}>
            <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '8px' }}>Vaš izbor:</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[make, model, year, engine].filter(Boolean).map((v, i) => (
                <span key={i} style={{ background: '#f9372c', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '13px' }}>{v}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
