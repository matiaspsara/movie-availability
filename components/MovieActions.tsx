import React from "react";

const MovieActions: React.FC = () => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12l2 2 4-4"/>
          <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
          <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
        </svg>
      </div>
      More Options
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-white transition-all duration-300 hover:scale-105">
        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        </div>
        <div className="text-left">
          <div className="font-semibold">Watch Trailer</div>
          <div className="text-sm text-white/60">View on YouTube</div>
        </div>
      </button>
      <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-white transition-all duration-300 hover:scale-105">
        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"/>
          </svg>
        </div>
        <div className="text-left">
          <div className="font-semibold">Add to Watchlist</div>
          <div className="text-sm text-white/60">Save for later</div>
        </div>
      </button>
      <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-white transition-all duration-300 hover:scale-105">
        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </div>
        <div className="text-left">
          <div className="font-semibold">Share</div>
          <div className="text-sm text-white/60">Tell friends</div>
        </div>
      </button>
    </div>
  </div>
);

export default MovieActions;
