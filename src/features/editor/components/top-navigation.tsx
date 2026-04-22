import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Id } from '../../../../convex/_generated/dataModel';
import { useEditor } from '../hooks/use-editor';
import { Tab } from './tab';

interface TopNavigationProps {
	projectId: Id<'projects'>;
}

export const TopNavigation = ({ projectId }: TopNavigationProps) => {
	const { openTabs } = useEditor(projectId);

	return (
		<ScrollArea className="flex-1">
			<nav className="bg-sidebar flex items-center h-8.75 border-b">
				{openTabs.map((fileId, index) => (
					<Tab
						key={fileId}
						fileId={fileId}
						isFirst={index === 0}
						projectId={projectId}
					/>
				))}
			</nav>

			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	);
};
