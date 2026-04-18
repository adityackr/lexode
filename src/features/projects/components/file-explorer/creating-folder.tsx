import { Doc, Id } from '../../../../../convex/_generated/dataModel';
import { CreateInput } from './create-input';
import { FolderRender } from './folder-render';
import { getItemPadding } from './constants';
import { LoadingRow } from './loading-row';
import { Tree } from './tree';

interface CreatingFolderProps {
	item: Doc<'files'>;
	level: number;
	projectId: Id<'projects'>;
	folderContents: Doc<'files'>[] | undefined;
	isOpen: boolean;
	creating: 'file' | 'folder';
	onToggle: () => void;
	onCreate: (name: string) => void;
	onCancel: () => void;
}

export const CreatingFolder = ({
	item,
	level,
	projectId,
	folderContents,
	isOpen,
	creating,
	onToggle,
	onCreate,
	onCancel,
}: CreatingFolderProps) => {
	const folderName = item.name;

	return (
		<>
			<button
				onClick={onToggle}
				className="group flex items-center gap-1 w-full h-5.5 hover:bg-accent/30"
				style={{ paddingLeft: getItemPadding(level, false) }}
			>
				<FolderRender folderName={folderName} isOpen={isOpen} />
			</button>

			{isOpen && (
				<>
					{folderContents === undefined && <LoadingRow level={level + 1} />}
					<CreateInput
						type={creating}
						level={level + 1}
						onSubmit={onCreate}
						onCancel={onCancel}
					/>
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