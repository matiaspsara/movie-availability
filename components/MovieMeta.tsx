import React from "react";

interface MovieMetaProps {
  year?: string;
  runtime?: number;
  seasons?: number;
  rating: string;
  voteAverage: number;
}

const MovieMeta: React.FC<MovieMetaProps> = ({ year, runtime, seasons, rating, voteAverage }) => (
  <div className="flex flex-wrap gap-5 mb-6 text-[#a1a1a1]">
    {year && (
      <div className="flex items-center gap-1.5">
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="6" cy="6" r="5"/>
          <line x1="6" y1="1" x2="6" y2="6"/>
        </svg>
        <span className="text-sm">{year}</span>
      </div>
    )}
    {runtime && (
      <div className="flex items-center gap-1.5">
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="6" cy="6" r="5"/>
          <polyline points="6,3 6,6 8,8"/>
        </svg>
        <span className="text-sm">{Math.floor(runtime / 60)}h {runtime % 60}m</span>
      </div>
    )}
    {seasons && (
      <div className="flex items-center gap-1.5">
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="8" height="6" rx="1"/>
          <line x1="4" y1="21" x2="4" y2="9"/>
          <line x1="8" y1="21" x2="8" y2="9"/>
        </svg>
        <span className="text-sm">{seasons} seasons</span>
      </div>
    )}
    <div className="flex items-center gap-1.5">
      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="6,1 7.5,4.5 11,4.5 8.25,7 9.75,10.5 6,8.5 2.25,10.5 3.75,7 1,4.5 4.5,4.5"/>
      </svg>
      <span className="text-sm">{rating}/5</span>
      <span className="text-[#555555] text-xs">({voteAverage.toFixed(1)}/10)</span>
    </div>
  </div>
);

export default MovieMeta;
