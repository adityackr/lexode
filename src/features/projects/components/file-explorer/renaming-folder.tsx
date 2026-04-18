import { Doc, Id } from '../../../../../convex/_generated/dataModel';
import { LoadingRow } from './loading-row';
import { RenameInput } from './rename-input';
import { Tree } from './tree';

interface RenamingFolderProps {
	item: Doc<'files'>;
	level: number;
	projectId: Id<'projects'>;
	folderContents: Doc<'files'>[] | undefined;
	isOpen: boolean;
	onRename: (newName: string) => void;
	onCancel: () => void;
}

export const RenamingFolder = ({
	item,
	level,
	projectId,
	folderContents,
	isOpen,
	onRename,
	onCancel,
}: RenamingFolderProps) => {
	const folderName = item.name;

	return (
		<>
			<RenameInput
				type="folder"
				level={level}
				onSubmit={onRename}
				onCancel={onCancel}
				defaultValue={folderName}
				isOpen={isOpen}
			/>

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
