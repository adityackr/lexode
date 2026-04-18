import { Doc, Id } from '../../../../../convex/_generated/dataModel';
import { FolderRender } from './folder-render';
import { LoadingRow } from './loading-row';
import { Tree } from './tree';
import { TreeItemWrapper } from './tree-item-wrapper';

interface DefaultFolderProps {
	item: Doc<'files'>;
	level: number;
	projectId: Id<'projects'>;
	folderContents: Doc<'files'>[] | undefined;
	isOpen: boolean;
	onToggle: () => void;
	onRename: () => void;
	onDelete: () => void;
	onCreateFile: () => void;
	onCreateFolder: () => void;
}

export const DefaultFolder = ({
	item,
	level,
	projectId,
	folderContents,
	isOpen,
	onToggle,
	onRename,
	onDelete,
	onCreateFile,
	onCreateFolder,
}: DefaultFolderProps) => {
	const folderName = item.name;

	return (
		<>
			<TreeItemWrapper
				item={item}
				level={level}
				onClick={onToggle}
				onDoubleClick={() => {}}
				onRename={onRename}
				onDelete={onDelete}
				onCreateFile={onCreateFile}
				onCreateFolder={onCreateFolder}
			>
				<FolderRender folderName={folderName} isOpen={isOpen} />
			</TreeItemWrapper>

			{isOpen && (
				<>
					{folderContents === undefined && <LoadingRow level={level + 1} />}
					{folderContents?.map((subItem) => (
						<Tree
							key={subItem._id}
							item={subItem}
							level={level + 1}
							projectId={projectId}
						/>
					))}
				</>
			)}
		</>
	);
};
