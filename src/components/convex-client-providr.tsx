'use client';

import { env } from '@/config/env.config';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ReactNode } from 'react';

const convex = new ConvexReactClient(env.convexUrl);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
	return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
