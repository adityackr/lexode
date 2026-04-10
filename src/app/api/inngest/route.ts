import { inngest } from '@/inngest/client';
import { demoError, demoGenerate } from '@/inngest/functions';
import { serve } from 'inngest/next';

export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [demoGenerate, demoError],
});
