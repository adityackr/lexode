import { env } from '@/config/env.config';
import { AuthConfig } from 'convex/server';

export default {
	providers: [
		{
			domain: env.clerkJwtIssuerDomain,
			applicationID: 'convex',
		},
	],
} satisfies AuthConfig;
