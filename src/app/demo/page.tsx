'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';
import * as Sentry from '@sentry/nextjs';
import { useState } from 'react';

const DemoPage = () => {
	const { userId } = useAuth();
	const [loading, setLoading] = useState(false);
	const [loadingBackground, setLoadingBackground] = useState(false);

	const handleBlocking = async () => {
		setLoading(true);
		await fetch('/api/demo/blocking', {
			method: 'POST',
		});
		setLoading(false);
	};

	const handleBackground = async () => {
		setLoadingBackground(true);
		await fetch('/api/demo/background', {
			method: 'POST',
		});
		setLoadingBackground(false);
	};

	// client error - throws in browser
	const handleClientError = () => {
		Sentry.logger.info('User attempting to trigger client error', { userId });
		throw new Error('Client error: Something went wrong on client side');
	};

	// API error - triggers server-side error
	const handleApiError = async () => {
		await fetch('/api/demo/error', {
			method: 'POST',
		});
	};

	// Inngest error - triggers error in background job
	const handleInngestError = async () => {
		await fetch('/api/demo/inngest-error', {
			method: 'POST',
		});
	};

	return (
		<div className="p-8 space-x-4">
			<Button disabled={loading} onClick={handleBlocking}>
				{loading ? 'Loading...' : 'Blocking'}
			</Button>
			<Button disabled={loadingBackground} onClick={handleBackground}>
				{loadingBackground ? 'Loading...' : 'Background'}
			</Button>
			<Button onClick={handleClientError} variant={'destructive'}>
				Client Error
			</Button>
			<Button onClick={handleApiError} variant={'destructive'}>
				API Error
			</Button>
			<Button onClick={handleInngestError} variant={'destructive'}>
				Inngest Error
			</Button>
		</div>
	);
};

export default DemoPage;
