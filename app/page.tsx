
"use client";
import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import RegionSelector from '../components/RegionSelector';

export default function Homepage() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className="min-h-screen bg-[#0f0f0f]" />;
	}

	return (
		<div className="min-h-screen bg-[#0f0f0f] flex flex-col">
			{/* Header */}
			<header className="w-full px-6 py-6 flex justify-between items-center">
				<div className="flex items-center gap-3">
					<span className="text-2xl">🎬</span>
					<h1 className="text-lg font-semibold text-white tracking-tight">WhereToWatch</h1>
				</div>
				<RegionSelector />
			</header>

			{/* Main Content */}
			<main className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
				<div className="w-full max-w-2xl mx-auto text-center">
					<h2 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
						Where to Watch
					</h2>
					<p className="text-[#a1a1a1] text-lg mb-10">
						Search any movie or TV show to find where it&apos;s streaming.
					</p>
					<SearchBar />
				</div>
			</main>
		</div>
	);
}
