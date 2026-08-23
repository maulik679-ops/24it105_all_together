function Skills() {
  const skillList = ["HTML", "CSS", "JavaScript", "React"];

  return (
    <section className="bento-card skills-card">
      <h2 className="section-title">Skills</h2>

      <ul className="skills-list">
        {skillList.map((skill) => (
          <li key={skill} className="skill-chip">{skill}</li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;