# Changelog

## [3.1.0] - 2026-04-16

### Added
- Real product images for all 12 seed parts (MANN-FILTER, BOSCH, SACHS, NGK, ContiTech, LuK, VALEO, WALKER, TRW, INA, BLIC)
- Image URLs pulled from Spareto CDN, Autodoc CDN, Summit Racing, and AIBearing
- Standalone Next.js output for Docker deployment (`next.config.js`)
- `Dockerfile` for containerized production builds
- `.gitignore` to protect secrets and build artifacts
- `package-lock.json` for reproducible installs
- `CHANGELOG.md` for version tracking

### Changed
- Supabase queries updated to target `parts_v2` table (avoids collision with legacy schema)
- Scraper error handling — `partNum` variable now properly scoped for catch block

### Fixed
- `lib/scraper/index.ts` reference-out-of-scope compile error
- Full-text search `unaccent` function now wrapped as `immutable_unaccent` for index usability

## [3.0.x] - Prior
- Initial marketplace, supplier directory, vehicle selector, comparison tool
- 4 scraping sources (AutoHub, Halo Oglasi, ProdajaDelova, Demo)
- Vercel cron jobs for daily scraping
