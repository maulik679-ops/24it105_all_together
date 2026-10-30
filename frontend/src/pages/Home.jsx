import { Link } from "react-router-dom";
import About from "../components/About";
import Skills from "../components/Skills";

function Home() {
  return (
    <main className="flex-grow pt-32 pb-16 px-margin-mobile md:px-gutter max-w-container-max mx-auto w-full flex flex-col gap-12 md:gap-24">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 md:py-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        <h1 className="font-display text-display mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-on-surface to-on-surface-variant">
          Maulik Vaghela
        </h1>
        <p className="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg text-primary-fixed mb-8 max-w-2xl">
          React Developer | IT Student
        </p>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mb-12">
          Building modern, high-performance web experiences with a focus on clean architecture and intuitive user interfaces. Passionate about turning complex problems into elegant digital solutions.
        </p>
        <div className="flex gap-4">
          <Link
            to="/projects"
            className="bg-primary text-on-primary font-label-sm text-label-sm px-8 py-4 rounded-full shadow-[0_0_20px_rgba(216,226,255,0.2)] hover:shadow-[0_0_30px_rgba(216,226,255,0.3)] transition-all duration-300 active:scale-95"
          >
            View Projects
          </Link>
          <Link
            to="/contact"
            className="bg-transparent border border-outline-variant/20 text-on-surface font-label-sm text-label-sm px-8 py-4 rounded-full hover:bg-outline-variant/10 transition-all duration-300 active:scale-95"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-bento-gap">
        <About />

        {/* Visual / Decorative Card (Span 5) */}
        <div className="col-span-1 md:col-span-5 bg-surface rounded-xl border border-outline-variant/10 p-2 relative overflow-hidden hidden md:block">
          <div
            className="w-full h-full rounded-lg bg-surface-container-low flex items-center justify-center bg-cover bg-center"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAG_8CMqoSNkIW9xdTVxwhD4SZ0WKdLaxVSVHd9iuuV_3kf_77Vvy7ZaAA2sIxbC4e2lMGa7lye_6XYaqBzE0Gi9zWHsf3VrMjCxigPSkrR1AK3i8wmzNDXmuihudiRiri6ozQ8FStj9VQZoJ5iHzXktUF_Ts0TtcPTXMFr-Jz4wZ9HJQHmvrBLaipxBBd8wsmKwly1wJiB606HgAag5Htd22fNO_hV0Ogwuv12NYM19LSoA_IPuBLkqQ')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent pointer-events-none"></div>
          </div>
        </div>

        <Skills />
      </div>
    </main>
  );
}

export default Home;
