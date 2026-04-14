import { ProjectView } from '@/features/projects/components/project-view';
import { Id } from '../../../../convex/_generated/dataModel';

interface ProjectPageProps {
	params: Promise<{ projectId: Id<'projects'> }>;
}

const ProjectPage = async ({ params }: ProjectPageProps) => {
	const { projectId } = await params;

	return <ProjectView projectId={projectId} />;
};

export default ProjectPage;
