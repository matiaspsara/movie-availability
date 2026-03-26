import React from "react";

const MovieActions: React.FC = () => (
  <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-8">
    <h3 className="text-sm font-semibold text-[#555555] uppercase tracking-wider mb-6">More Options</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <button className="flex items-center gap-3 bg-[#1a1a1a] hover:bg-[#222222] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-xl p-4 text-white transition-colors duration-200">
        <div className="w-10 h-10 bg-[#222222] rounded-lg flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        </div>
        <div className="text-left">
          <div className="font-medium text-sm">Watch Trailer</div>
          <div className="text-xs text-[#555555]">View on YouTube</div>
        </div>
      </button>
      <button className="flex items-center gap-3 bg-[#1a1a1a] hover:bg-[#222222] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-xl p-4 text-white transition-colors duration-200">
        <div className="w-10 h-10 bg-[#222222] rounded-lg flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"/>
          </svg>
        </div>
        <div className="text-left">
          <div className="font-medium text-sm">Add to Watchlist</div>
          <div className="text-xs text-[#555555]">Save for later</div>
        </div>
      </button>
      <button className="flex items-center gap-3 bg-[#1a1a1a] hover:bg-[#222222] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-xl p-4 text-white transition-colors duration-200">
        <div className="w-10 h-10 bg-[#222222] rounded-lg flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </div>
        <div className="text-left">
          <div className="font-medium text-sm">Share</div>
          <div className="text-xs text-[#555555]">Tell friends</div>
        </div>
      </button>
    </div>
  </div>
);

export default MovieActions;
