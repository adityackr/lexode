'use client';

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';

const Page = () => {
	const projects = useQuery(api.projects.get);
	const createProject = useMutation(api.projects.create);

	return (
		<div>
			<Button onClick={() => createProject({ name: 'Test' })}>
				Create Project
			</Button>
			{projects?.map((project) => (
				<div key={project._id}>
					<p>{project.name}</p>
					<p>{project.ownerId}</p>
				</div>
			))}
		</div>
	);
};

export default Page;
