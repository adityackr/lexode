import { useState } from 'react';
import { Doc, Id } from '../../../../../convex/_generated/dataModel';
import {
	useCreateFile,
	useCreateFolder,
	useDeleteFile,
	useFolderContents,
	useRenameFile,
} from '../../hooks/use-files';
import { CreatingFolder } from './creating-folder';
import { DefaultFolder } from './default-folder';
import { FileTreeItem } from './file-tree-item';
import { RenamingFolder } from './renaming-folder';

interface TreeProps {
	item: Doc<'files'>;
	level?: number;
	projectId: Id<'projects'>;
}

export const Tree = ({ item, level = 0, projectId }: TreeProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [creating, setCreating] = useState<'file' | 'folder' | null>(null);
	const [renaming, setRenaming] = useState(false);

	const createFile = useCreateFile();
	const createFolder = useCreateFolder();
	const deleteFile = useDeleteFile();
	const renameFile = useRenameFile();

	const folderContents = useFolderContents({
		projectId,
		parentId: item._id,
		enabled: item.type === 'folder' && isOpen,
	});

	const handleRename = (newName: string) => {
		setRenaming(false);

		if (newName === item.name) return;

		renameFile({
			id: item._id,
			newName,
		});
	};

	const handleCreate = (name: string) => {
		setCreating(null);

		if (creating === 'file') {
			createFile({
				projectId,
				name,
				content: '',
				parentId: item._id,
			});
		} else {
			createFolder({
				projectId,
				name,
				parentId: item._id,
			});
		}
	};

	const startCreating = (type: 'file' | 'folder') => {
		setIsOpen(true);
		setCreating(type);
	};

	if (item.type === 'file') {
		return (
			<FileTreeItem
				item={item}
				level={level}
				isRenaming={renaming}
				onRename={handleRename}
				onCancelRename={() => setRenaming(false)}
				onDelete={() => {
					deleteFile({ id: item._id });
				}}
			/>
		);
	}

	if (creating) {
		return (
			<CreatingFolder
				item={item}
				level={level}
				projectId={projectId}
				folderContents={folderContents}
				isOpen={isOpen}
				creating={creating}
				onToggle={() => setIsOpen((prev) => !prev)}
				onCreate={handleCreate}
				onCancel={() => setCreating(null)}
			/>
		);
	}

	if (renaming) {
		return (
			<RenamingFolder
				item={item}
				level={level}
				projectId={projectId}
				folderContents={folderContents}
				isOpen={isOpen}
				onRename={handleRename}
				onCancel={() => setRenaming(false)}
			/>
		);
	}

	return (
		<DefaultFolder
			item={item}
			level={level}
			projectId={projectId}
			folderContents={folderContents}
			isOpen={isOpen}
			onToggle={() => setIsOpen((prev) => !prev)}
			onRename={() => setRenaming(true)}
			onDelete={() => {
				deleteFile({ id: item._id });
			}}
			onCreateFile={() => startCreating('file')}
			onCreateFolder={() => startCreating('folder')}
		/>
	);
};