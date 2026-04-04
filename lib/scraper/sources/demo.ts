import { BaseScraper } from '../base';
import type { ScrapedPart, ScrapeConfig } from '../../types';

const DEMO_CONFIG: ScrapeConfig = { type: 'api', base_url: 'internal://demo', rate_limit_ms: 0 };

const BRANDS = ['Bosch','SKF','Monroe','Brembo','NGK','Febi','Mann','Mahle','Sachs','TRW'];
const MAKES = ['Volkswagen','Audi','BMW','Mercedes-Benz','Toyota','Renault','Peugeot','Ford','Opel','Škoda'];

const PART_TEMPLATES = [
  { name: 'Filter ulja', brand: 'Mann', category: 'filters', basePrice: 800, suffix: 'W719' },
  { name: 'Filter vazduha', brand: 'Mann', category: 'filters', basePrice: 1200, suffix: 'C3698' },
  { name: 'Filter goriva', brand: 'Bosch', category: 'filters', basePrice: 1500, suffix: 'F026403' },
  { name: 'Filter kabine', brand: 'Filtron', category: 'filters', basePrice: 900, suffix: 'K1187' },
  { name: 'Disk kočnice prednji', brand: 'Brembo', category: 'brakes', basePrice: 4500, suffix: '09.A850' },
  { name: 'Disk kočnice zadnji', brand: 'Brembo', category: 'brakes', basePrice: 3800, suffix: '09.A851' },
  { name: 'Pločice kočnica prednje', brand: 'TRW', category: 'brakes', basePrice: 2200, suffix: 'GDB3301' },
  { name: 'Amortizer prednji', brand: 'Monroe', category: 'suspension', basePrice: 7500, suffix: 'G16239' },
  { name: 'Amortizer zadnji', brand: 'Monroe', category: 'suspension', basePrice: 6800, suffix: 'G16240' },
  { name: 'Svećica paljenja', brand: 'NGK', category: 'ignition', basePrice: 450, suffix: 'BKR6E' },
  { name: 'Remen razvodnog mehanizma', brand: 'Gates', category: 'timing', basePrice: 3500, suffix: 'T38195' },
  { name: 'Komplet remen razvoda', brand: 'SKF', category: 'timing', basePrice: 8900, suffix: 'VKMA03257' },
  { name: 'Vodena pumpa', brand: 'Febi', category: 'cooling', basePrice: 4200, suffix: '17082' },
  { name: 'Termostat', brand: 'Gates', category: 'cooling', basePrice: 1800, suffix: 'TH44180G1' },
  { name: 'Kvačilo komplet', brand: 'Sachs', category: 'clutch', basePrice: 18500, suffix: '3000951740' },
];

export class DemoScraper extends BaseScraper {
  constructor(supplierId = 'demo-supplier', supplierName = 'Demo Dobavljač') {
    super(supplierId, supplierName, DEMO_CONFIG);
  }

  async fetchParts(count = 60): Promise<ScrapedPart[]> {
    const parts: ScrapedPart[] = [];
    const now = this.now();
    for (let i = 0; i < count; i++) {
      const t = PART_TEMPLATES[i % PART_TEMPLATES.length];
      const priceVariance = 1 + (Math.random() * 0.3 - 0.15);
      const price = Math.round(t.basePrice * priceVariance / 10) * 10;
      const partNumber = `${t.suffix}-${String(i + 1000).padStart(4,'0')}`;
      parts.push({
        raw_name: `${t.brand} ${t.name} ${partNumber}`,
        raw_price: `${price} RSD`,
        part_number: partNumber,
        brand: t.brand,
        category_hint: t.category,
        description: `Originalni rezervni deo ${t.brand} za ${MAKES[i % MAKES.length]}.`,
        image_urls: [],
        product_url: `https://autodelovi.sale/parts/${partNumber.toLowerCase().replace(/[^a-z0-9]/g,'-')}`,
        stock: i % 5 === 0 ? '0' : String(Math.floor(Math.random() * 50) + 1),
        supplier_id: this.supplierId,
        scraped_at: now,
      });
    }
    this.totalFetched = parts.length;
    this.log(`Demo: generated ${parts.length} parts`);
    return parts;
  }
}

export default DemoScraper;
