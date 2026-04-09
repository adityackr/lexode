'use client';

import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const Page = () => {
	const projects = useQuery(api.projects.get);
	const createProject = useMutation(api.projects.create);

	return (
		<div>
			<Button onClick={() => createProject({ name: 'Project 1' })}>
				Create Project
			</Button>
			<ul>
				{projects?.map((project) => (
					<li key={project._id}>
						{project.name}
						<p>Owner Id: {project.ownerId}</p>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Page;
