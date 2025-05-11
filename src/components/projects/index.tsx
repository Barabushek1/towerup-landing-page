
import React, { useEffect, useState } from 'react';
import ProjectsSection from './ProjectsSection';
import { fetchProjects } from '@/utils/project-helpers';
import { Project } from '@/types/project';

const ProjectsSectionContainer = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(data);
      setLoading(false);
    };
    loadProjects();
  }, []);

  return <ProjectsSection customProjects={projects} loading={loading} />;
};

export default ProjectsSectionContainer;
