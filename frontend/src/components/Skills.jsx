function Skills() {
  const skillList = ["HTML5", "CSS3 / Tailwind", "JavaScript (ES6+)", "React.js", "Git / GitHub"];

  return (
    <section className="col-span-1 md:col-span-12 bg-surface rounded-xl border border-outline-variant/10 p-8 md:p-12 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <h2 className="font-headline-md text-headline-md text-on-surface mb-8 flex items-center gap-3">
        <span className="material-symbols-outlined text-secondary">code</span>
        Technical Arsenal
      </h2>
      <div className="flex flex-wrap gap-4">
        {skillList.map((skill) => (
          <div
            key={skill}
            className="px-6 py-3 rounded-full border border-outline-variant/20 font-code-block text-code-block text-on-surface-variant hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all duration-300 cursor-default"
          >
            {skill}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;