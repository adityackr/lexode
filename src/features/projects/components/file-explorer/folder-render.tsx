import { cn } from '@/lib/utils';
import { FolderIcon } from '@react-symbols/icons/utils';
import { ChevronRightIcon } from 'lucide-react';

interface FolderRenderProps {
	folderName: string;
	isOpen: boolean;
}

export const FolderRender = ({ folderName, isOpen }: FolderRenderProps) => (
	<>
		<div className="flex items-center gap-0.5">
			<ChevronRightIcon
				className={cn(
					'size-4 shrink-0 text-muted-foreground',
					isOpen ? 'rotate-90' : '',
				)}
			/>
			<FolderIcon folderName={folderName} className="size-4" />
			<span className="text-sm truncate">{folderName}</span>
		</div>
	</>
);
