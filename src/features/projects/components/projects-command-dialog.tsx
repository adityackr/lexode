import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { useRouter } from 'next/navigation';
import { useProjects } from '../hooks/use-projects';
import { getProjectIcon } from '../utils/get-project-icon';

interface ProjectsCommandDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const ProjectsCommandDialog = ({
	open,
	onOpenChange,
}: ProjectsCommandDialogProps) => {
	const router = useRouter();
	const projects = useProjects();

	const handleSelect = (projectId: string) => {
		router.push(`/projects/${projectId}`);
		onOpenChange(false);
	};

	return (
		<CommandDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Search Projects"
			description="Search for projects to continue working on them."
		>
			<CommandInput placeholder="Search projects..." />
			<CommandList>
				<CommandEmpty>No projects found.</CommandEmpty>
				<CommandGroup heading="Projects">
					{projects?.map((project) => (
						<CommandItem
							key={project._id}
							value={`${project.name}-${project._id}`}
							onSelect={() => handleSelect(project._id)}
						>
							{getProjectIcon(project, 4)}
							<span className="truncate">{project.name}</span>
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
};
