function Projects() {
  const projects = [
    { id: 1, title: "Portfolio Website", description: "Personal developer portfolio built with React and Vite." },
    { id: 2, title: "Task Manager API", description: "RESTful API built with Express and MongoDB." }
  ];

  return (
    <div className="projects-container">
      <h2>My Projects</h2>
      <div className="project-list">
        {projects.map((proj) => (
          <div key={proj.id} className="project-card">
            <h3>{proj.title}</h3>
            <p>{proj.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
