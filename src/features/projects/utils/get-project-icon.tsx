import { cn } from '@/lib/utils';
import { AlertCircleIcon, GlobeIcon, Loader2Icon } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { Doc } from '../../../../convex/_generated/dataModel';

export const getProjectIcon = (
	project: Doc<'projects'>,
	size: number = 3.5,
) => {
	if (project.importStatus === 'completed') {
		return <FaGithub className={cn(`size-${size}`, 'text-muted-foreground')} />;
	}

	if (project.importStatus === 'failed') {
		return (
			<AlertCircleIcon
				className={cn(`size-${size}`, 'text-muted-foreground')}
			/>
		);
	}

	if (project.importStatus === 'importing') {
		return (
			<Loader2Icon
				className={cn(`size-${size}`, 'text-muted-foreground', 'animate-spin')}
			/>
		);
	}

	return <GlobeIcon className={cn(`size-${size}`, 'text-muted-foreground')} />;
};
