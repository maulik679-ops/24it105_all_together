import React from 'react';

function RouteLoader() {
  return (
    <div className="flex-grow flex items-center justify-center min-h-[60vh] w-full px-4">
      <div className="bento-card rounded-2xl p-8 max-w-sm w-full mx-auto text-center border border-outline-variant/20 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Subtle decorative radial grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #e5e1e4 1px, transparent 0)`,
            backgroundSize: `20px 20px`,
          }}
        ></div>

        <div className="relative z-10 flex flex-col items-center justify-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping"></div>
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <span className="material-symbols-outlined text-[18px] text-primary absolute">
              deployed_code
            </span>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-outline-variant/20 bg-surface-container-low font-label-sm text-[11px] uppercase tracking-wider text-primary mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Code Splitting Active
            </div>
            <h4 className="font-headline-md text-base text-on-surface font-semibold">
              Loading Route Chunk
            </h4>
            <p className="font-body-md text-xs text-on-surface-variant mt-1">
              Fetching dynamic component module...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteLoader;
