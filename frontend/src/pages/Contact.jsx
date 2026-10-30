import { useState } from "react";

function Contact() {
  const [message, setMessage] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  return (
    <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-gutter py-12 pt-32 relative overflow-x-hidden w-full max-w-container-max mx-auto">
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-secondary/5 rounded-full blur-[100px] mix-blend-screen opacity-30"></div>
      </div>

      <div className="w-full max-w-2xl">
        <header className="mb-12 text-center">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4 tracking-tight">
            Contact Me
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto">
            Have a project in mind or just want to say hello? Drop a message below and I'll get back to you.
          </p>
        </header>

        <div className="bg-surface border border-outline-variant/10 rounded-xl p-8 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Decorative subtle grid background inside card */}
          <div
            className="absolute inset-0 pointer-events-none opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #e5e1e4 1px, transparent 0)`,
              backgroundSize: `24px 24px`,
            }}
          ></div>

          <form className="relative z-10 flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider" htmlFor="name">
                  Name
                </label>
                <input
                  className="form-input w-full rounded-lg px-4 py-3 font-body-md text-body-md border focus:ring-0 transition-colors"
                  id="name"
                  placeholder="Jane Doe"
                  type="text"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider" htmlFor="email">
                  Email
                </label>
                <input
                  className="form-input w-full rounded-lg px-4 py-3 font-body-md text-body-md border focus:ring-0 transition-colors"
                  id="email"
                  placeholder="jane@example.com"
                  type="email"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 relative">
              <div className="flex justify-between items-end mb-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider" htmlFor="message">
                  Message
                </label>
                <button
                  type="button"
                  onClick={() => setShowHelp(!showHelp)}
                  className="text-primary/70 hover:text-primary transition-colors text-xs flex items-center gap-1 font-label-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">help</span> Toggle Help
                </button>
              </div>

              {showHelp && (
                <div className="text-xs text-on-surface-variant/70 mb-2 bg-surface-container-low p-3 rounded border border-outline-variant/20 font-body-md">
                  Consider including project details, timeline expectations, or specific technical requirements you'd like to discuss.
                </div>
              )}

              <textarea
                className="form-textarea w-full rounded-lg px-4 py-3 font-body-md text-body-md border focus:ring-0 transition-colors resize-none"
                id="message"
                placeholder="Enter your message here..."
                rows="6"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>

              <div className="flex justify-between items-center mt-2">
                <p className="font-body-md text-sm text-on-surface-variant">
                  Preview: <span className="text-on-surface">{message || "(empty)"}</span>
                </p>

                <span className="inline-flex items-center rounded-full bg-surface-container-high px-2.5 py-0.5 font-label-sm text-label-sm font-medium text-on-surface-variant border border-outline-variant/20">
                  Character Count: <span className="ml-1 text-primary">{message.length}</span>
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                className="bg-primary text-on-primary font-label-sm text-label-sm px-8 py-4 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:bg-primary-fixed transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                type="submit"
              >
                Send Message
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Contact;
