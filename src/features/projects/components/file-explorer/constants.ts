// Padding for the file explorer
export const BASE_PADDING = 12;

// Padding for each level of nesting
export const PADDING_PER_LEVEL = 12;

export const getItemPadding = (level: number, isFile: boolean) => {
	const fileOffset = isFile ? 16 : 0;
	return BASE_PADDING + level * PADDING_PER_LEVEL + fileOffset;
};
