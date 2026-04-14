'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { Id } from '../../../../convex/_generated/dataModel';

interface ProjectViewProps {
	projectId: Id<'projects'>;
}

export const ProjectView = ({ projectId }: ProjectViewProps) => {
	const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

	return (
		<div className="flex flex-col h-full">
			<nav className="h-[35px] flex items-center sbg-sidebar border-b">
				<Tab
					label="Code"
					isActive={activeTab === 'editor'}
					onClick={() => setActiveTab('editor')}
				/>
				<Tab
					label="Preview"
					isActive={activeTab === 'preview'}
					onClick={() => setActiveTab('preview')}
				/>

				<div className="flex-1 flex justify-end h-full">
					<div className="flex items-center gap-1.5 h-full px-3 cursor-pointer text-muted-foreground border-l hover:bg-accent/30">
						<FaGithub className="size-3.5" />
						<span className="text-sm">Export</span>
					</div>
				</div>
			</nav>

			<div className="flex-1 relative">
				<div
					className={cn(
						'absolute inset-0',
						activeTab === 'editor' ? 'visible' : 'invisible',
					)}
				>
					<div>Editor</div>
				</div>
				<div
					className={cn(
						'absolute inset-0',
						activeTab === 'preview' ? 'visible' : 'invisible',
					)}
				>
					<div>Preview</div>
				</div>
			</div>
		</div>
	);
};

interface TavProps {
	label: string;
	isActive: boolean;
	onClick: () => void;
}

const Tab = ({ label, isActive, onClick }: TavProps) => {
	return (
		<div
			onClick={onClick}
			className={cn(
				'flex items-center gap-2 h-full px-3 cursor-pointer text-muted-foreground border-r hover:bg-accent/30',
				isActive && 'bg-background text-foreground',
			)}
		>
			<span className="text-sm">{label}</span>
		</div>
	);
};
