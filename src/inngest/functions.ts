// src/inngest/functions.ts
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { inngest } from './client';

export const demoGenerate = inngest.createFunction(
	{ id: 'demo-generate', triggers: { event: 'demo/generate' } },
	async ({ step }) => {
		await step.run('generate-text', async () => {
			return await generateText({
				model: google('gemini-2.5-flash'),
				prompt: 'Write a vegetarian lasagna recipe for 4 people.',
			});
		});
	},
);
