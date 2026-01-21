'use client';

import { AuthLoadingView } from '@/features/auth/components/auth-loading-view';
import { UnauthenticatedView } from '@/features/auth/components/unauthenticated-view';
import { UserButton } from '@clerk/nextjs';
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import { ReactNode } from 'react';

export const AuthenticatedProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	return (
		<>
			<Authenticated>
				<UserButton />
				{children}
			</Authenticated>
			<Unauthenticated>
				<UnauthenticatedView />
			</Unauthenticated>
			<AuthLoading>
				<AuthLoadingView />
			</AuthLoading>
		</>
	);
};
