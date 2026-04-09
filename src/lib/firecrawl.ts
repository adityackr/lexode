import { env } from '@/config/env.config';
import Firecrawl from '@mendable/firecrawl-js';

export const firecrawl = new Firecrawl({ apiKey: env.firecrawlApiKey });
