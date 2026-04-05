import { normalizeAll, setEurRate } from './normalizer';
import { DemoScraper } from './sources/demo';
import { AutoHubScraper } from './sources/autohub';
import { HaloOglasiScraper } from './sources/halooglasi';
import { ProdajaDelovaScraper } from './sources/prodajadelova';
import type { BaseScraper } from './base';
import type { PipelineResult, Supplier } from '../types';
import { upsertPart, recordPriceHistory, detectPriceChanges, createScrapingJob, updateScrapingJob } from '../supabase';