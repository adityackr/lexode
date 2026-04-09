import { Button } from '@/components/ui/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@/components/ui/item';
import { SignInButton } from '@clerk/nextjs';
import { ShieldAlertIcon } from 'lucide-react';

export const UnauthenticatedView = () => {
	return (
		<div className="flex h-screen bg-background items-center justify-center">
			<div className="w-full max-w-lg bg-muted">
				<Item variant="outline">
					<ItemMedia variant="icon">
						<ShieldAlertIcon />
					</ItemMedia>

					<ItemContent>
						<ItemTitle>Unauthorized Access</ItemTitle>
						<ItemDescription>
							You are not authorized to access this resource. Please login to
							continue.
						</ItemDescription>
					</ItemContent>

					<ItemActions>
						<SignInButton>
							<Button variant={'outline'} size={'sm'}>
								Sign In
							</Button>
						</SignInButton>
					</ItemActions>
				</Item>
			</div>
		</div>
	);
};
