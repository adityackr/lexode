'use client';

import { env } from '@/config/env.config';
import { AuthLoadingView } from '@/features/auth/components/auth-loading-view';
import { UnauthenticatedView } from '@/features/auth/components/unauthenticated-view';
import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { dark } from '@clerk/ui/themes';
import {
	Authenticated,
	AuthLoading,
	ConvexReactClient,
	Unauthenticated,
} from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';
import { TooltipProvider } from './ui/tooltip';

const convex = new ConvexReactClient(env.convexUrl);

export const Providers = ({ children }: { children: ReactNode }) => {
	return (
		<ClerkProvider
			appearance={{
				theme: dark,
			}}
		>
			<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<TooltipProvider>
						<Authenticated>{children}</Authenticated>
						<Unauthenticated>
							<UnauthenticatedView />
						</Unauthenticated>
						<AuthLoading>
							<AuthLoadingView />
						</AuthLoading>
					</TooltipProvider>
				</ThemeProvider>
			</ConvexProviderWithClerk>
		</ClerkProvider>
	);
};
