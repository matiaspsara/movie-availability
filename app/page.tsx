
"use client";
import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import RegionSelector from '../components/RegionSelector';
import { useTranslations } from '../lib/useTranslations';

const platforms = [
  { name: 'Netflix',    color: '#e50914' },
  { name: 'Prime',      color: '#00a8e1' },
  { name: 'Disney+',    color: '#0063e5' },
  { name: 'Hulu',       color: '#1ce783' },
  { name: 'HBO Max',    color: '#a855f7' },
  { name: 'Apple TV+',  color: '#a0a0a0' },
  { name: 'Paramount+', color: '#0064ff' },
  { name: 'Crunchyroll',color: '#f47521' },
];

export default function Homepage() {
	const t = useTranslations();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className="min-h-screen bg-[#0f0f0f]" />;
	}

	return (
		<div className="relative min-h-screen bg-[#0f0f0f] flex flex-col overflow-hidden">
			{/* Radial glow */}
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					background: 'radial-gradient(ellipse 80% 50% at 50% 40%, #1e1e1e 0%, #0f0f0f 70%)',
				}}
			/>

			{/* Header */}
			<header className="relative z-10 w-full px-6 py-6 flex justify-between items-center">
				<div className="flex items-center gap-3">
					<span className="text-2xl">🎬</span>
					<h1 className="text-lg font-semibold text-white tracking-tight">DóndeVer</h1>
				</div>
				<RegionSelector />
			</header>

			{/* Main Content */}
			<main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-24">
				<div className="w-full max-w-2xl mx-auto text-center">
					<h2 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
						{t('homeHeading')}
					</h2>
					<p className="text-[#a1a1a1] text-lg mb-10">
						{t('homeSubtitle')}
					</p>

					<SearchBar />

					{/* Platform strip */}
					<div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
						{platforms.map((p, i) => (
							<span
								key={p.name}
								className="text-sm font-medium flex items-center gap-1.5"
								style={{ color: p.color, opacity: 0.55 }}
							>
								{i > 0 && (
									<span className="text-[#2a2a2a] select-none mr-1">·</span>
								)}
								{p.name}
							</span>
						))}
						<span className="text-sm text-[#333333] flex items-center">
							<span className="mr-1">·</span> and more
						</span>
					</div>
				</div>
			</main>
		</div>
	);
}
