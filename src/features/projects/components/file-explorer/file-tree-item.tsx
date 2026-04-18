import { FileIcon } from '@react-symbols/icons/utils';
import { Doc } from '../../../../../convex/_generated/dataModel';
import { RenameInput } from './rename-input';
import { TreeItemWrapper } from './tree-item-wrapper';

interface FileTreeItemProps {
	item: Doc<'files'>;
	level: number;
	isRenaming: boolean;
	onRename: (newName: string) => void;
	onCancelRename: () => void;
	onDelete: () => void;
}

export const FileTreeItem = ({
	item,
	level,
	isRenaming,
	onRename,
	onCancelRename,
	onDelete,
}: FileTreeItemProps) => {
	const fileName = item.name;

	if (isRenaming) {
		return (
			<RenameInput
				type="file"
				level={level}
				onSubmit={onRename}
				onCancel={onCancelRename}
				defaultValue={fileName}
				isOpen={false}
			/>
		);
	}

	return (
		<TreeItemWrapper
			item={item}
			level={level}
			isActive={false}
			onClick={() => {}}
			onDoubleClick={() => {}}
			onRename={() => {}}
			onDelete={onDelete}
		>
			<FileIcon fileName={fileName} autoAssign className="size-4" />
			<span className="text-sm truncate">{fileName}</span>
		</TreeItemWrapper>
	);
};
