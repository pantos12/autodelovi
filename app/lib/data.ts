export const vehicleData: Record<string, Record<string, string[]>> = {
  'Volkswagen': {
    'Golf': ['1.2 TSI 85ks', '1.4 TSI 125ks', '1.6 TDI 105ks', '2.0 TDI 150ks', '2.0 GTI 245ks'],
    'Passat': ['1.6 TDI 120ks', '2.0 TDI 150ks', '2.0 TDI 190ks', '1.8 TSI 180ks'],
    'Polo': ['1.0 MPI 65ks', '1.0 TSI 95ks', '1.6 TDI 80ks', '1.6 TDI 95ks'],
    'Tiguan': ['1.4 TSI 150ks', '2.0 TDI 150ks', '2.0 TDI 190ks', '2.0 TSI 220ks'],
    'Caddy': ['1.6 TDI 102ks', '2.0 TDI 102ks', '2.0 TDI 150ks'],
    'T5': ['1.9 TDI 102ks', '2.0 TDI 102ks', '2.0 TDI 140ks'],
  },
  'BMW': {
    '3 Serija': ['316d', '318d', '320d', '325d', '330d', '318i', '320i', '328i', '330i'],
    '5 Serija': ['520d', '525d', '530d', '535d', '520i', '528i', '530i'],
    'X5': ['xDrive25d', 'xDrive30d', 'xDrive35d', 'xDrive40d', 'xDrive30i'],
    'X3': ['xDrive20d', 'xDrive25d', 'xDrive30d', 'xDrive20i', 'xDrive30i'],
    '1 Serija': ['116d', '118d', '120d', '116i', '118i', '120i'],
    '7 Serija': ['730d', '740d', '750d', '730i', '740i', '750i'],
  },
  'Mercedes': {
    'C Klasa': ['C180', 'C200', 'C220d', 'C250d', 'C300', 'C43 AMG'],
    'E Klasa': ['E200', 'E220d', 'E250', 'E300', 'E350d', 'E63 AMG'],
    'A Klasa': ['A160', 'A180', 'A200', 'A220', 'A250'],
    'GLC': ['GLC200', 'GLC220d', 'GLC250', 'GLC300', 'GLC350d'],
    'Sprinter': ['211 CDI', '213 CDI', '216 CDI', '311 CDI', '313 CDI', '316 CDI'],
    'Vito': ['109 CDI', '111 CDI', '114 CDI', '116 CDI', '119 CDI'],
  },
  'Audi': {
    'A4': ['1.8 TFSI 120ks', '2.0 TFSI 180ks', '2.0 TDI 120ks', '2.0 TDI 150ks', '3.0 TDI 218ks'],
    'A6': ['2.0 TDI 136ks', '2.0 TDI 190ks', '3.0 TDI 218ks', '2.0 TFSI 180ks', '3.0 TFSI 300ks'],
    'A3': ['1.2 TFSI 105ks', '1.4 TFSI 125ks', '1.6 TDI 105ks', '2.0 TDI 150ks'],
    'Q5': ['2.0 TDI 150ks', '2.0 TDI 190ks', '3.0 TDI 218ks', '2.0 TFSI 225ks'],
    'Q7': ['3.0 TDI 218ks', '3.0 TDI 272ks', '3.0 TFSI 333ks'],
    'A5': ['1.8 TFSI 177ks', '2.0 TFSI 225ks', '2.0 TDI 177ks', '3.0 TDI 218ks'],
  },
  'Opel': {
    'Astra': ['1.4 Turbo 100ks', '1.4 Turbo 140ks', '1.6 CDTI 110ks', '2.0 CDTI 165ks'],
    'Vectra': ['1.8 16V 122ks', '2.2 DTI 125ks', '1.9 CDTI 120ks', '1.9 CDTI 150ks'],
    'Insignia': ['1.6 Turbo 170ks', '2.0 Turbo 220ks', '2.0 CDTI 130ks', '2.0 CDTI 163ks'],
    'Corsa': ['1.0 Turbo 90ks', '1.2 85ks', '1.4 90ks', '1.3 CDTI 75ks', '1.7 CDTI 100ks'],
    'Zafira': ['1.8 140ks', '2.0 Turbo 200ks', '1.9 CDTI 120ks', '1.9 CDTI 150ks'],
  },
  'Renault': {
    'Megane': ['1.2 TCe 115ks', '1.5 dCi 90ks', '1.5 dCi 110ks', '2.0 dCi 150ks'],
    'Clio': ['0.9 TCe 90ks', '1.2 75ks', '1.5 dCi 75ks', '1.5 dCi 90ks'],
    'Laguna': ['1.5 dCi 110ks', '2.0 dCi 150ks', '2.0 dCi 175ks', '2.0 Turbo 170ks'],
    'Kangoo': ['1.5 dCi 75ks', '1.5 dCi 90ks', '1.6 110ks'],
    'Trafic': ['1.6 dCi 90ks', '1.6 dCi 120ks', '2.0 dCi 90ks', '2.0 dCi 115ks'],
  },
  'Peugeot': {
    '308': ['1.2 PureTech 110ks', '1.5 BlueHDi 100ks', '1.5 BlueHDi 130ks', '2.0 BlueHDi 150ks'],
    '207': ['1.4 VTi 95ks', '1.6 THP 120ks', '1.6 HDi 92ks', '1.6 HDi 112ks'],
    '406': ['1.8 116ks', '2.0 136ks', '2.0 HDi 90ks', '2.0 HDi 110ks', '2.2 HDi 136ks'],
    '3008': ['1.2 PureTech 130ks', '1.5 BlueHDi 130ks', '2.0 BlueHDi 150ks', '2.0 BlueHDi 180ks'],
    '508': ['1.6 PureTech 180ks', '2.0 BlueHDi 150ks', '2.0 BlueHDi 180ks'],
  },
  'Fiat': {
    'Punto': ['1.2 69ks', '1.4 77ks', '1.3 JTD 70ks', '1.3 JTD 90ks', '1.9 JTD 130ks'],
    'Bravo': ['1.4 T-Jet 120ks', '1.6 Multijet 105ks', '1.9 Multijet 120ks', '2.0 Multijet 165ks'],
    '500': ['0.9 TwinAir 85ks', '1.2 69ks', '1.4 100ks', '1.3 Multijet 75ks', '1.3 Multijet 95ks'],
    'Ducato': ['2.0 JTD 84ks', '2.3 Multijet 110ks', '2.3 Multijet 130ks', '3.0 Multijet 160ks'],
    'Stilo': ['1.2 80ks', '1.6 103ks', '1.8 133ks', '1.9 JTD 80ks', '1.9 JTD 115ks'],
  },
  'Toyota': {
    'Corolla': ['1.4 D-4D 90ks', '1.6 132ks', '1.8 Hybrid 122ks', '2.0 Hybrid 180ks'],
    'Yaris': ['1.0 VVT-i 69ks', '1.3 VVT-i 101ks', '1.4 D-4D 90ks', '1.5 Hybrid 100ks'],
    'Avensis': ['1.6 D-4D 112ks', '2.0 D-4D 124ks', '2.2 D-4D 150ks', '1.8 VVT-i 147ks'],
    'RAV4': ['2.0 VVT-i 150ks', '2.2 D-4D 136ks', '2.2 D-4D 177ks', '2.5 Hybrid 218ks'],
    'Hilux': ['2.4 D-4D 150ks', '2.8 D-4D 204ks'],
  },
  'Ford': {
    'Focus': ['1.0 EcoBoost 100ks', '1.5 EcoBoost 150ks', '1.5 TDCi 120ks', '2.0 TDCi 150ks'],
    'Mondeo': ['1.5 EcoBoost 160ks', '2.0 TDCi 150ks', '2.0 TDCi 180ks', '2.0 Hybrid 187ks'],
    'Fiesta': ['1.0 EcoBoost 80ks', '1.0 EcoBoost 100ks', '1.5 TDCi 85ks', '1.5 TDCi 120ks'],
    'Transit': ['2.0 EcoBlue 105ks', '2.0 EcoBlue 130ks', '2.0 EcoBlue 170ks'],
    'Ranger': ['2.0 EcoBlue 130ks', '2.0 EcoBlue 170ks', '3.2 TDCi 200ks'],
  },
  'Skoda': {
    'Octavia': ['1.0 TSI 115ks', '1.5 TSI 150ks', '1.6 TDI 115ks', '2.0 TDI 150ks', '2.0 TDI 184ks'],
    'Fabia': ['1.0 MPI 60ks', '1.0 TSI 95ks', '1.0 TSI 110ks', '1.4 TDI 90ks'],
    'Superb': ['1.5 TSI 150ks', '2.0 TSI 280ks', '2.0 TDI 150ks', '2.0 TDI 190ks'],
    'Kodiaq': ['1.5 TSI 150ks', '2.0 TSI 190ks', '2.0 TDI 150ks', '2.0 TDI 190ks'],
    'Yeti': ['1.2 TSI 105ks', '1.4 TSI 122ks', '1.6 TDI 105ks', '2.0 TDI 140ks'],
  },
  'Seat': {
    'Leon': ['1.0 TSI 115ks', '1.5 TSI 150ks', '1.6 TDI 115ks', '2.0 TDI 150ks', '2.0 TSI Cupra 300ks'],
    'Ibiza': ['1.0 MPI 65ks', '1.0 TSI 95ks', '1.0 TSI 115ks', '1.6 TDI 95ks'],
    'Ateca': ['1.0 TSI 115ks', '1.5 TSI 150ks', '2.0 TDI 115ks', '2.0 TDI 150ks', '2.0 TSI 190ks'],
    'Toledo': ['1.2 TSI 105ks', '1.6 TDI 90ks', '1.6 TDI 105ks', '2.0 TDI 150ks'],
  },
};

export const vehicleMakes = Object.keys(vehicleData);

export function getModels(make: string): string[] {
  return make ? Object.keys(vehicleData[make] || {}) : [];
}

export function getEngines(make: string, model: string): string[] {
  return make && model ? (vehicleData[make]?.[model] || []) : [];
}

export function getYears(): string[] {
  const years: string[] = [];
  for (let y = 2026; y >= 1995; y--) {
    years.push(y.toString());
  }
  return years;
}

export interface Part {
  id: string;
  name: string;
  nameSr: string;
  category: string;
  categorySlug: string;
  make: string;
  model: string;
  yearFrom: number;
  yearTo: number;
  oem: string;
  price: number;
  supplier: string;
  inStock: boolean;
  image: string;
  description: string;
}

export const mockParts: Part[] = [
  { id: '1', name: 'Brake Disc Front', nameSr: 'Prednji Kocioni Disk', category: 'Kocnice', categorySlug: 'kocnice', make: 'Volkswagen', model: 'Golf', yearFrom: 2012, yearTo: 2020, oem: '5Q0615301', price: 4800, supplier: 'Brembo Serbia', inStock: true, image: '', description: 'Originalni prednji kocioni disk za VW Golf 7' },
  { id: '2', name: 'Oil Filter', nameSr: 'Filter Ulja', category: 'Motor', categorySlug: 'motor', make: 'Volkswagen', model: 'Golf', yearFrom: 2008, yearTo: 2020, oem: '06J115403Q', price: 850, supplier: 'Mann Filter Serbia', inStock: true, image: '', description: 'Filter ulja za VW Golf motore 1.2, 1.4 TSI' },
  { id: '3', name: 'Alternator', nameSr: 'Alternator', category: 'Elektronika', categorySlug: 'elektronika', make: 'BMW', model: '3 Serija', yearFrom: 2005, yearTo: 2012, oem: '12317552980', price: 18500, supplier: 'Bosch Auto', inStock: true, image: '', description: 'Remanufakturisani alternator 150A za BMW E90' },
  { id: '4', name: 'Front Bumper', nameSr: 'Prednji Branik', category: 'Karoserija', categorySlug: 'karoserija', make: 'Mercedes', model: 'C Klasa', yearFrom: 2014, yearTo: 2021, oem: 'A2058800140', price: 32000, supplier: 'Karoserija Pro', inStock: false, image: '', description: 'Prednji branik za Mercedes C Klasu W205' },
  { id: '5', name: 'Timing Belt Kit', nameSr: 'Komplet Zupcastog Remena', category: 'Motor', categorySlug: 'motor', make: 'Audi', model: 'A4', yearFrom: 2004, yearTo: 2012, oem: '06B198119D', price: 12400, supplier: 'Gates Serbia', inStock: true, image: '', description: 'Komplet zupcastog remena sa tensioner-om za Audi A4 2.0 TDI' },
  { id: '6', name: 'Shock Absorber Front', nameSr: 'Prednji Amortizer', category: 'Karoserija', categorySlug: 'karoserija', make: 'Opel', model: 'Astra', yearFrom: 2010, yearTo: 2018, oem: '13369503', price: 6900, supplier: 'KYB Serbia', inStock: true, image: '', description: 'Prednji amortizer za Opel Astra J' },
  { id: '7', name: 'Brake Pads Front', nameSr: 'Prednje Kocione Plocice', category: 'Kocnice', categorySlug: 'kocnice', make: 'Toyota', model: 'Corolla', yearFrom: 2013, yearTo: 2019, oem: '04465-02370', price: 3200, supplier: 'Textar Serbia', inStock: true, image: '', description: 'Prednje kocione plocice za Toyota Corolla E170' },
  { id: '8', name: 'Air Filter', nameSr: 'Filter Vazduha', category: 'Motor', categorySlug: 'motor', make: 'Skoda', model: 'Octavia', yearFrom: 2012, yearTo: 2020, oem: '1K0129620', price: 1200, supplier: 'Mann Filter Serbia', inStock: true, image: '', description: 'Filter vazduha za Skoda Octavia 3' },
  { id: '9', name: 'Lambda Sensor', nameSr: 'Lambda Sonda', category: 'Elektronika', categorySlug: 'elektronika', make: 'Ford', model: 'Focus', yearFrom: 2011, yearTo: 2018, oem: 'DV6A-9F472-AA', price: 7800, supplier: 'Bosch Auto', inStock: true, image: '', description: 'Lambda sonda za Ford Focus 1.0 EcoBoost' },
  { id: '10', name: 'Radiator', nameSr: 'Hladnjak Vode', category: 'Motor', categorySlug: 'motor', make: 'Renault', model: 'Megane', yearFrom: 2009, yearTo: 2016, oem: '214100006R', price: 9500, supplier: 'Valeo Serbia', inStock: false, image: '', description: 'Hladnjak vode za Renault Megane 3' },
  { id: '11', name: 'Clutch Kit', nameSr: 'Komplet Kvacila', category: 'Motor', categorySlug: 'motor', make: 'Peugeot', model: '308', yearFrom: 2013, yearTo: 2021, oem: '2052.A3', price: 15600, supplier: 'Valeo Serbia', inStock: true, image: '', description: 'Komplet kvacila 3 dela za Peugeot 308 1.6 HDi' },
  { id: '12', name: 'ABS Sensor', nameSr: 'ABS Senzor', category: 'Elektronika', categorySlug: 'elektronika', make: 'Seat', model: 'Leon', yearFrom: 2012, yearTo: 2020, oem: '1K0927807', price: 4100, supplier: 'Bosch Auto', inStock: true, image: '', description: 'ABS senzor prednji levi za Seat Leon 3' },
  { id: '13', name: 'Door Handle Outer', nameSr: 'Spoljna Kvaka Vrata', category: 'Karoserija', categorySlug: 'karoserija', make: 'Fiat', model: 'Punto', yearFrom: 2005, yearTo: 2012, oem: '735423698', price: 1850, supplier: 'Karoserija Pro', inStock: true, image: '', description: 'Spoljna kvaka desnih prednjih vrata za Fiat Punto 3' },
  { id: '14', name: 'Brake Disc Rear', nameSr: 'Zadnji Kocioni Disk', category: 'Kocnice', categorySlug: 'kocnice', make: 'BMW', model: '5 Serija', yearFrom: 2010, yearTo: 2017, oem: '34206870299', price: 5600, supplier: 'Brembo Serbia', inStock: true, image: '', description: 'Zadnji kocioni disk za BMW F10/F11' },
  { id: '15', name: 'Fuel Pump', nameSr: 'Pumpa Goriva', category: 'Motor', categorySlug: 'motor', make: 'Mercedes', model: 'E Klasa', yearFrom: 2009, yearTo: 2016, oem: 'A2124700394', price: 22000, supplier: 'Bosch Auto', inStock: false, image: '', description: 'Pumpa goriva za Mercedes E Klasa W212' },
];

export const categories = [
  { slug: 'motor', name: 'Motor', icon: 'M', description: 'Delovi motora, filteri, pumpe, zupcasti remeni i sve sto pokrece vas automobil', count: 1240 },
  { slug: 'kocnice', name: 'Kocnice', icon: 'K', description: 'Kocioni diskovi, plocice, celjusti i kompletni sistemi za bezbedno zaustavljanje', count: 840 },
  { slug: 'elektronika', name: 'Elektronika', icon: 'E', description: 'Senzori, alternatori, starteri, lambda sonde i sva elektronika vozila', count: 960 },
  { slug: 'karoserija', name: 'Karoserija', icon: 'C', description: 'Branici, amortizeri, vrata, stakla i svi delovi karoserije vaseg vozila', count: 1100 },
];

export const suppliers = [
  { id: 's1', name: 'Bosch Auto', city: 'Beograd', rating: 4.9, parts: 3240, verified: true, description: 'Zvanicni distributer Bosch auto delova za Srbiju' },
  { id: 's2', name: 'Brembo Serbia', city: 'Novi Sad', rating: 4.8, parts: 1120, verified: true, description: 'Specijalizovani uvoznik Brembo kocionih sistema' },
  { id: 's3', name: 'Mann Filter Serbia', city: 'Beograd', rating: 4.7, parts: 890, verified: true, description: 'Filteri i potrosni materijal Mann+Hummel grupe' },
  { id: 's4', name: 'Valeo Serbia', city: 'Kragujevac', rating: 4.6, parts: 2100, verified: true, description: 'Distributer Valeo delova za Srbiju i region' },
  { id: 's5', name: 'Karoserija Pro', city: 'Beograd', rating: 4.5, parts: 760, verified: false, description: 'Specijalizovana prodavnica delova karoserije' },
  { id: 's6', name: 'Gates Serbia', city: 'Nis', rating: 4.7, parts: 540, verified: true, description: 'Remeni, creva i sistem prenosa snage Gates' },
  { id: 's7', name: 'Textar Serbia', city: 'Subotica', rating: 4.6, parts: 680, verified: true, description: 'Kocioni sistemi i plocice Textar brenda' },
  { id: 's8', name: 'KYB Serbia', city: 'Beograd', rating: 4.5, parts: 420, verified: false, description: 'Amortizeri i oslanjanje KYB brenda' },
];
