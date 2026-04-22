import { useFile, useUpdateFile } from '@/features/projects/hooks/use-files';
import Image from 'next/image';
import { useRef } from 'react';
import { Id } from '../../../../convex/_generated/dataModel';
import { useEditor } from '../hooks/use-editor';
import { CodeEditor } from './code-editor';
import { FileBreadcrumbs } from './file-breadcrumbs';
import { TopNavigation } from './top-navigation';

const DEBOUNCE_DELAY = 1500;

interface EditorViewProps {
	projectId: Id<'projects'>;
}

export const EditorView = ({ projectId }: EditorViewProps) => {
	const { activeTabId } = useEditor(projectId);
	const activeFile = useFile(activeTabId!);
	const updateFile = useUpdateFile();
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const activeFileForTab =
		activeFile?._id === activeTabId ? activeFile : undefined;

	const isActiveFileBinary = activeFileForTab?.storageId;
	const isActiveFileText = activeFileForTab && !activeFileForTab.storageId;

	return (
		<div className="h-full flex flex-col">
			<div className="flex items-center">
				<TopNavigation projectId={projectId} />
			</div>

			{activeTabId && <FileBreadcrumbs projectId={projectId} />}

			<div className="flex-1 min-h-0 bg-background">
				{!activeFileForTab && (
					<div className="size-full flex items-center justify-center">
						<Image
							src="/logo-alt.svg"
							alt="Lexode"
							width={100}
							height={100}
							className="opacity-25"
						/>
					</div>
				)}

				{isActiveFileText && (
					<CodeEditor
						key={activeFileForTab._id}
						fileName={activeFileForTab.name}
						initialValue={activeFileForTab.content}
						onChange={(content: string) => {
							if (timeoutRef.current) {
								clearTimeout(timeoutRef.current);
							}

							timeoutRef.current = setTimeout(() => {
								updateFile({
									id: activeFileForTab._id,
									content,
								});
							}, DEBOUNCE_DELAY);
						}}
					/>
				)}

				{isActiveFileBinary && (
					<p>{/* TODO: Implement binary file preview */}</p>
				)}
			</div>
		</div>
	);
};
