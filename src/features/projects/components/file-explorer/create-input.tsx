import { Input } from '@/components/ui/input';
import { FileIcon, FolderIcon } from '@react-symbols/icons/utils';
import { ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';
import { getItemPadding } from './constants';

interface CreateInputProps {
	type: 'file' | 'folder';
	level: number;
	onSubmit: (name: string) => void;
	onCancel: () => void;
}

export const CreateInput = ({
	type,
	level,
	onSubmit,
	onCancel,
}: CreateInputProps) => {
	const [value, setValue] = useState('');

	const handleSubmit = () => {
		const trimmed = value.trim();

		if (trimmed) {
			onSubmit(trimmed);
		} else {
			onCancel();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSubmit();
		} else if (e.key === 'Escape') {
			onCancel();
		}
	};

	return (
		<div
			className="flex items-center gap-1 w-full h-5.5 bg-accent/30"
			style={{ paddingLeft: getItemPadding(level, type === 'file') }}
		>
			<div className="flex items-center gap-0.5">
				{type === 'folder' && (
					<ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
				)}

				{type === 'file' && (
					<FileIcon fileName={value} autoAssign className="size-4" />
				)}

				{type === 'folder' && (
					<FolderIcon className="size-4" folderName={value} />
				)}

				<Input
					autoFocus
					type="text"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onBlur={handleSubmit}
					onKeyDown={handleKeyDown}
					className="text-sm h-5 bg-transparent outline-none focus:ring-1 focus:ring-inset focus:ring-ring  focus-visible:ring-0 rounded-none"
				/>
			</div>
		</div>
	);
};
