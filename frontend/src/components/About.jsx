function About() {
  return (
    <section className="col-span-1 md:col-span-7 bg-surface rounded-xl border border-outline-variant/10 p-8 md:p-12 relative overflow-hidden group hover:border-outline-variant/30 transition-colors">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">person</span>
        About Me
      </h2>
      <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
        I am an IT student learning React. My journey in software development is driven by a deep curiosity for how digital ecosystems function and a desire to build tools that matter. I thrive in environments that challenge me to solve architectural puzzles and refine my coding practices.
      </p>
    </section>
  );
}

export default About;
