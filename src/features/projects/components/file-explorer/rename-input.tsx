import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FileIcon, FolderIcon } from '@react-symbols/icons/utils';
import { ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';
import { getItemPadding } from './constants';

interface RenameInputProps {
	type: 'file' | 'folder';
	level: number;
	onSubmit: (name: string) => void;
	onCancel: () => void;
	defaultValue: string;
	isOpen?: boolean;
}

export const RenameInput = ({
	type,
	level,
	onSubmit,
	onCancel,
	defaultValue,
	isOpen,
}: RenameInputProps) => {
	const [value, setValue] = useState(defaultValue);

	const handleSubmit = () => {
		const trimmed = value.trim() || defaultValue;

		onSubmit(trimmed);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSubmit();
		} else if (e.key === 'Escape') {
			onCancel();
		}
	};

	const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		if (type === 'folder') {
			e.currentTarget.select();
		} else {
			const value = e.currentTarget.value;
			const lastDotIndex = value.lastIndexOf('.');
			if (lastDotIndex > 0) {
				e.currentTarget.setSelectionRange(0, lastDotIndex);
			} else {
				e.currentTarget.select();
			}
		}
	};

	return (
		<div
			className="flex items-center gap-1 w-full h-5.5 bg-accent/30"
			style={{ paddingLeft: getItemPadding(level, type === 'file') }}
		>
			<div className="flex items-center gap-0.5">
				{type === 'folder' && (
					<ChevronRightIcon
						className={cn(
							'size-4 shrink-0 text-muted-foreground',
							isOpen ? 'rotate-90' : '',
						)}
					/>
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
					onFocus={handleFocus}
					className="text-sm h-5 bg-transparent outline-none focus:ring-1 focus:ring-inset focus:ring-ring  focus-visible:ring-0 rounded-none"
				/>
			</div>
		</div>
	);
};
