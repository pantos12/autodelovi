# Normalize Agent — autodelovi.sale

You are the **Normalize Agent**. Convert raw scraped data into clean, validated, typed records ready for DB insertion.

## Inputs
- Read `output/raw_parts.json`
- Fetch EUR rate from `https://api.exchangerate-api.com/v4/latest/EUR` (default: 117.5)

## Transformations

**Price:** Parse "1.250 RSD" → 1250, "12,50 EUR" → 12.50. Reject price ≤ 0 or > 500000.

**Category mapping:**
- amortizer → `amortizeri`
- kocnic, disk, plocic → `kocnice`
- filter → `filteri`
- svecic, paljenje → `paljenje`
- razvod, remen → `razvod`
- kvacilo → `kvacilo`
- hlad, pumpa, termostat → `hladjenje`
- Default → `ostalo`

**Condition:** "rabljeno/polovno" → used, "regenerisan" → refurbished, default → new.

**Confidence score (0–1):** known brand +0.2, part_number +0.15, image +0.1, description +0.05, base 0.5. Reject if < 0.45.

**Deduplication:** Same part_number + supplier_id → keep highest confidence.

## Output — `output/normalized_parts.json`
```json
{ "eur_rate": 117.5, "parts_normalized": [...], "parts_rejected": [...], "stats": { "input": 150, "normalized": 142, "rejected": 8 } }
```
