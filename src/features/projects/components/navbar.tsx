import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { UserButton } from '@clerk/nextjs';
import { formatDistanceToNow } from 'date-fns';
import { CloudCheck } from 'lucide-react';
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Id } from '../../../../convex/_generated/dataModel';
import { useProject, useRenameProject } from '../hooks/use-projects';

const font = Poppins({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700', '800', '900'],
});

interface NavbarProps {
	projectId: Id<'projects'>;
}

export const Navbar = ({ projectId }: NavbarProps) => {
	const project = useProject(projectId);
	const renameProject = useRenameProject(projectId);
	const [isRenaming, setIsRenaming] = useState(false);
	const [name, setName] = useState('');

	const handleStartRename = () => {
		if (!project) return;
		setName(project.name);
		setIsRenaming(true);
	};

	const handleSubmit = () => {
		if (!project) return;
		setIsRenaming(false);

		const trimmedName = name.trim();
		if (!trimmedName || trimmedName === project.name) return;

		renameProject({ name: trimmedName, id: projectId });
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSubmit();
		} else if (e.key === 'Escape') {
			setIsRenaming(false);
		}
	};

	return (
		<div className="flex justify-between items-center gap-x-2 p-2 bg-sidebar border-b">
			<div className="flex items-center gap-x-2">
				<Breadcrumb>
					<BreadcrumbList className="gap-0!">
						<BreadcrumbItem>
							<BreadcrumbLink className="flex items-center gap-1.5" asChild>
								<Button variant="ghost" asChild className="w-fit! p-1.5! h-7!">
									<Link href={'/'}>
										<Image
											src={'/logo.svg'}
											alt="Logo"
											width={20}
											height={20}
										/>
										<span className={cn('text-sm font-medium', font.className)}>
											Lexode
										</span>
									</Link>
								</Button>
							</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbSeparator className="ml-0! mr-1" />

						<BreadcrumbItem>
							{isRenaming ? (
								<Input
									autoFocus
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									onFocus={(e) => e.currentTarget.select()}
									onBlur={handleSubmit}
									onKeyDown={handleKeyDown}
									className="text-sm bg-transparent text-foreground outline-none focus:ring-1 focus:ring-inset font-medium focus:ring-ring  focus-visible:ring-0 max-w-40 truncate"
								/>
							) : (
								<BreadcrumbPage
									onClick={handleStartRename}
									className="text-sm cursor-pointer hover:text-primary font-medium max-w-40 truncate"
								>
									{project?.name ?? 'Loading...'}
								</BreadcrumbPage>
							)}
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				{project?.importStatus === 'importing' ? (
					<Tooltip>
						<TooltipTrigger>
							<Spinner className="size-4 text-muted-foreground" />
						</TooltipTrigger>
						<TooltipContent>Importing...</TooltipContent>
					</Tooltip>
				) : (
					<Tooltip>
						<TooltipTrigger>
							<CloudCheck className="size-4 text-green-500" />
						</TooltipTrigger>
						<TooltipContent>
							Saved{' '}
							{project?.updatedAt
								? formatDistanceToNow(project.updatedAt, {
										addSuffix: true,
									})
								: '...'}
						</TooltipContent>
					</Tooltip>
				)}
			</div>

			<div className="flex items-center gap-2">
				<UserButton />
			</div>
		</div>
	);
};
