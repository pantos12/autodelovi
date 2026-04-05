/**
 * ProdajaDelova.rs Scraper
 * Targets: https://www.prodajadelova.rs — Inspira Grupa's auto parts platform
 *
 * URL patterns (from indexed pages):
 *   Listing: /auto-delovi (or similar category pages)
 *   Parts typically organized by category and vehicle compatibility
 *
 * This scraper uses multiple parsing strategies to handle both
 * SSR-rendered content and embedded JSON/structured data.
 */

import { BaseScraper, fetchHTML, extractPrice, slugify } from '../base';
import type { ScrapedPart, ScrapeConfig } from '../../types';

const CONFIG: ScrapeConfig = {
  type: 'html',
  base_url: 'https://www.prodajadelova.rs',
  rate_limit_ms: 2000,
  pagination: { type: 'page_number', param: 'page', max_pages: 10 },
};