import Link from 'next/link';
import { getSuppliers } from '@/lib/supabase';

export const metadata = {
  title: 'Dobavljači | AutoDelovi.sale',
  description: 'Proverite listu verifikovanih dobavljača auto delova u Srbiji.',
};

export default async function SuppliersPage() {
  const suppliers = await getSuppliers(true).catch(() => []);

  const stats = [
    { value: suppliers.length > 0 ? suppliers.length + '+' : '200+', label: 'Verifikovanih dobavljača' },
    { value: '50K+', label: 'Auto delova' },
    { value: '15+', label: 'Gradova' },
  ];

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1a1b1f 0%, #0c0d0f 100%)', padding: '60px 16px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>
          Naši <span style={{ color: '#ff4d00' }}>Dobavljači</span>
        </h1>
        <p style={{ color: '#aaa', fontSize: '16px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Sarađujemo isključivo sa proverenim dobavljačima koji garantuju kvalitet i originalnost delova.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
          {stats.map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ color: '#ff4d00', fontSize: '32px', fontWeight: 800 }}>{stat.value}</div>
              <div style={{ color: '#aaa', fontSize: '14px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Suppliers grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px' }}>
        {suppliers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '48px' }}>🏪</p>
            <p style={{ color: '#aaa', fontSize: '16px', marginBottom: '16px' }}>Nema dobavljača trenutno</p>
            <Link href="/marketplace" style={{ color: '#ff4d00', textDecoration: 'none' }}>← Pogledaj delove</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {suppliers.map(supplier => (
              <div key={supplier.id} style={{ background: '#1a1b1f', borderRadius: '12px', padding: '24px', border: '1px solid #252629' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{supplier.name}</h3>
                    <p style={{ color: '#aaa', fontSize: '13px' }}>📍 {supplier.city}</p>
                  </div>
                  {supplier.is_verified && (
                    <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>
                      ✓ Verifikovan
                    </span>
                  )}
                </div>
                <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.5, marginBottom: '16px' }}>{supplier.description_sr || supplier.description || 'Provereni dobavljač auto delova.'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div>
                      <div style={{ color: '#fff', fontSize: '18px', fontWeight: 700 }}>⭐ {supplier.rating?.toFixed(1) || '5.0'}</div>
                      <div style={{ color: '#aaa', fontSize: '12px' }}>Ocena</div>
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontSize: '18px', fontWeight: 700 }}>{supplier.review_count || 0}</div>
                      <div style={{ color: '#aaa', fontSize: '12px' }}>Recenzija</div>
                    </div>
                  </div>
                  <Link
                    href={`/marketplace?supplier=${supplier.slug || supplier.id}`}
                    style={{ padding: '8px 16px', background: '#ff4d00', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}
                  >
                    Pogledaj delove
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Partner CTA */}
        <div style={{ marginTop: '60px', background: 'linear-gradient(135deg, #ff4d00 0%, #cc3d00 100%)', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>
            Postanite naš partner
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
            Pridružite se mreži vodećih dobavljača auto delova u Srbiji i povećajte svoju prodaju.
          </p>
          <a
            href="mailto:dobavljaci@autodelovi.sale"
            style={{ display: 'inline-block', padding: '12px 32px', background: '#fff', color: '#ff4d00', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '16px' }}
          >
            Kontaktirajte nas
          </a>
        </div>
      </div>
    </div>
  );
}
