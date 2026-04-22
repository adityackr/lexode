import { v } from 'convex/values';
import { Doc, Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { verifyAuth } from './auth';

export const getFiles = query({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		const identity = await verifyAuth(ctx);

		const project = await ctx.db.get('projects', args.projectId);

		if (!project) {
			throw new Error('Project not found');
		}

		if (project.ownerId !== identity.subject) {
			throw new Error('Unauthorized');
		}

		return await ctx.db
			.query('files')
			.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
			.collect();
	},
});

export const getFile = query({
	args: { id: v.id('files') },
	handler: async (ctx, args) => {
		const identity = await verifyAuth(ctx);

		const file = await ctx.db.get('files', args.id);

		if (!file) {
			throw new Error('File not found');
		}

		const project = await ctx.db.get('projects', file.projectId);

		if (!project) {
			throw new Error('Project not found');
		}

		if (project.ownerId !== identity.subject) {
			throw new Error('Unauthorized');
		}

		return file;
	},
});

export const getFilePath = query({
	args: { fileId: v.id('files') },
	handler: async (ctx, args) => {
		const identity = await verifyAuth(ctx);

		const file = await ctx.db.get('files', args.fileId);

		if (!file) {
			throw new Error('File not found');
		}

		const project = await ctx.db.get('projects', file.projectId);

		if (!project) {
			throw new Error('Project not found');
		}

		if (project.ownerId !== identity.subject) {
			throw new Error('Unauthorized');
		}

		const path: { _id: Id<'files'>; name: string }[] = [];
		const seen = new Set<Id<'files'>>();
		let currentId: Id<'files'> | undefined = args.fileId;
		while (currentId) {
			if (seen.has(currentId)) {
				throw new Error('Invalid file path');
			}
			seen.add(currentId);
			const currentFile = (await ctx.db.get('files', currentId)) as
				| Doc<'files'>
				| undefined;
			if (!currentFile) {
				throw new Error('File not found');
			}
			if (currentFile.projectId !== file.projectId) {
				throw new Error('Invalid file path');
			}
			path.unshift({ _id: currentFile._id, name: currentFile.name });
			currentId = currentFile.parentId;
		}

		return path;
	},
});

export const getFolderContents = query({
	args: { projectId: v.id('projects'), parentId: v.optional(v.id('files')) },
	handler: async (ctx, args) => {
		const identity = await verifyAuth(ctx);

		const project = await ctx.db.get('projects', args.projectId);

		if (!project) {
			throw new Error('Project not found');
		}

		if (project.ownerId !== identity.subject) {
			throw new Error('Unauthorized');
		}

		const files = await ctx.db
			.query('files')
			.withIndex('by_project_parent', (q) =>
				q.eq('projectId', args.projectId).eq('parentId', args.parentId),
			)
			.collect();

		// Sort: folders first, then files, alphabetically within each group
		return files.sort((a, b) => {
			if (a.type === 'folder' && b.type === 'file') {
				return -1;
			}
			if (a.type === 'file' && b.type === 'folder') {
				return 1;
			}
			return a.name.localeCompare(b.name);
		});
	},
});

export const createFile = mutation({
	args: {
		projectId: v.id('projects'),
		parentId: v.optional(v.id('files')),
		name: v.string(),
		content: v.string(),
	},
	handler: async (ctx, args) => {
		const identity = await verifyAuth(ctx);

		const project = await ctx.db.get('projects', args.projectId);

		if (!project) {
			throw new Error('Project not found');
		}

		if (project.ownerId !== identity.subject) {
			throw new Error('Unauthorized');
		}

		// check if file with same name already exists in this parent folder
		const files = await ctx.db
			.query('files')
			.withIndex('by_project_parent', (q) =>
				q.eq('projectId', args.projectId).eq('parentId', args.parentId),
			)
			.collect();

		const existing = files.find(
			(file) => file.name === args.name && file.type === 'file',
		);

		if (existing) {
			throw new Error('File with this name already exists');
		}

		const now = Date.now();

		await ctx.db.insert('files', {
			projectId: args.projectId,
			parentId: args.parentId,
			name: args.name,
			content: args.content,
			type: 'file',
			updatedAt: now,
		});

		await ctx.db.patch('projects', args.projectId, {
			updatedAt: now,
		});
	},
});

export const createFolder = mutation({
	args: {
		projectId: v.id('projects'),
		parentId: v.optional(v.id('files')),
		name: v.string(),
	},
	handler: async (ctx, args) => {
		const identity = await verifyAuth(ctx);

		const project = await ctx.db.get('projects', args.projectId);

		if (!project) {
			throw new Error('Project not found');
		}

		if (project.ownerId !== identity.subject) {
			throw new Error('Unauthorized');
		}

		// check if folder with same name already exists in this parent folder
		const files = await ctx.db
			.query('files')
			.withIndex('by_project_parent', (q) =>
				q.eq('projectId', args.projectId).eq('parentId', args.parentId),
			)
			.collect();

		const existing = files.find(
			(file) => file.name === args.name && file.type === 'folder',
		);

		if (existing) {
			throw new Error('Folder with this name already exists');
		}

		const now = Date.now();

		await ctx.db.insert('files', {
			projectId: args.projectId,
			parentId: args.parentId,
			name: args.name,
			type: 'folder',
			updatedAt: now,
		});

		await ctx.db.patch('projects', args.projectId, {
			updatedAt: now,
		});
	},
});

export const renameFile = mutation({
	args: {
		id: v.id('files'),
		newName: v.string(),
	},
	handler: async (ctx, args) => {
		const identity = await verifyAuth(ctx);

		const file = await ctx.db.get('files', args.id);

		if (!file) {
			throw new Error('File not found');
		}

		const project = await ctx.db.get('projects', file.projectId);

		if (!project) {
			throw new Error('Project not found');
		}

		if (project.ownerId !== identity.subject) {
			throw new Error('Unauthorized');
		}

		// check if file with same name already exists in this parent folder
		const siblings = await ctx.db
			.query('files')
			.withIndex('by_project_parent', (q) =>
				q.eq('projectId', file.projectId).eq('parentId', file.parentId),
			)
			.collect();

		const existing = siblings.find(
			(sibling) =>
				sibling.name === args.newName &&
				sibling.type === file.type &&
				sibling._id !== args.id,
		);

		if (existing) {
			throw new Error(
				`A ${file.type} with this name already exists in this location`,
			);
		}

		const now = Date.now();

		await ctx.db.patch('files', args.id, {
			name: args.newName,
			updatedAt: now,
		});

		await ctx.db.patch('projects', file.projectId, {
			updatedAt: now,
		});
	},
});

export const deleteFile = mutation({
	args: {
		id: v.id('files'),
	},
	handler: async (ctx, args) => {
		const identity = await verifyAuth(ctx);

		const file = await ctx.db.get('files', args.id);

		if (!file) {
			throw new Error('File not found');
		}

		const project = await ctx.db.get('projects', file.projectId);

		if (!project) {
			throw new Error('Project not found');
		}

		if (project.ownerId !== identity.subject) {
			throw new Error('Unauthorized');
		}

		// Recursively delete file/folder and all descendants
		const deleteRecursive = async (fileId: Id<'files'>) => {
			const file = await ctx.db.get('files', fileId);

			if (!file) {
				return;
			}

			if (file.type === 'folder') {
				const children = await ctx.db
					.query('files')
					.withIndex('by_project_parent', (q) =>
						q.eq('projectId', file.projectId).eq('parentId', fileId),
					)
					.collect();

				for (const child of children) {
					await deleteRecursive(child._id);
				}
			}

			if (file.storageId) {
				await ctx.storage.delete(file.storageId);
			}

			await ctx.db.delete('files', fileId);
		};

		await deleteRecursive(args.id);

		await ctx.db.patch('projects', file.projectId, {
			updatedAt: Date.now(),
		});
	},
});

export const updateFile = mutation({
	args: {
		id: v.id('files'),
		content: v.string(),
	},
	handler: async (ctx, args) => {
		const identity = await verifyAuth(ctx);

		const file = await ctx.db.get('files', args.id);

		if (!file) {
			throw new Error('File not found');
		}

		const project = await ctx.db.get('projects', file.projectId);

		if (!project) {
			throw new Error('Project not found');
		}

		if (project.ownerId !== identity.subject) {
			throw new Error('Unauthorized');
		}

		const now = Date.now();

		await ctx.db.patch('files', args.id, {
			content: args.content,
			updatedAt: now,
		});

		await ctx.db.patch('projects', file.projectId, {
			updatedAt: now,
		});
	},
});
