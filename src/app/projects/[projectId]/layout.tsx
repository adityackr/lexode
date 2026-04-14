import { ProjectLayout } from '@/features/projects/components/project-layout';
import { ReactNode } from 'react';
import { Id } from '../../../../convex/_generated/dataModel';

interface LayoutProps {
	children: ReactNode;
	params: Promise<{ projectId: Id<'projects'> }>;
}

const Layout = async ({ children, params }: LayoutProps) => {
	const { projectId } = await params;

	return <ProjectLayout projectId={projectId}>{children}</ProjectLayout>;
};

export default Layout;
