
"use client";
import { useTranslations } from "../lib/useTranslations";
import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import RegionSelector from '../components/RegionSelector';
import FloatingParticles from '../components/FloatingParticles';

export default function Homepage() {
	const t = useTranslations();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />;
	}

	return (
		<div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
			{/* Animated Background */}
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-800/30 to-pink-900/30" />
				<div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse animation-delay-4000" />
			</div>
			<FloatingParticles />
			{/* Content */}
			<div className="relative z-10 min-h-screen flex flex-col">
				{/* Header */}
				<header className="w-full px-6 py-8 flex justify-between items-start">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
							<span className="text-2xl">🎬</span>
						</div>
						<div>
							<h1 className="text-xl font-bold text-white">WhereToWatch</h1>
							<p className="text-white/60 text-sm">{t("providersLabel")}</p>
						</div>
					</div>
					<RegionSelector />
				</header>
				{/* Main Content */}
				<main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
					<div className="w-full max-w-4xl mx-auto text-center">
						{/* Hero Section */}
						<div className="mb-16">
							<h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
								Where to
								<span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"> Watch</span>
							</h1>
							<p className="text-xl md:text-2xl text-white/70 font-medium mb-4 max-w-2xl mx-auto leading-relaxed">
								Discover where your favorite movies and TV shows are streaming
							</p>
							<div className="flex flex-wrap justify-center gap-4 text-white/50 text-sm">
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
									Netflix
								</div>
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-2000"></div>
									Prime Video
								</div>
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse animation-delay-4000"></div>
									Hulu
								</div>
								<div className="text-white/30">+ many more</div>
							</div>
						</div>
						{/* Search Section */}
						<div className="w-full max-w-2xl mx-auto mb-16">
							<SearchBar />
							<div className="mt-6 text-center">
								<p className="text-white/50 text-sm">
									Search across multiple streaming platforms in your region
								</p>
							</div>
						</div>
						{/* Features Grid */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
							<div className="group">
								<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
									<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl group-hover:shadow-blue-500/25">
										<svg width="32" height="32" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<circle cx="11" cy="11" r="8"/>
											<path d="m21 21-4.35-4.35"/>
										</svg>
									</div>
									<h3 className="text-xl font-bold text-white mb-4">Smart Search</h3>
									<p className="text-white/70 leading-relaxed">
										Intelligent search across all major streaming platforms with real-time availability
									</p>
								</div>
							</div>
              
							<div className="group">
								<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
									<div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl group-hover:shadow-purple-500/25">
										<svg width="32" height="32" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
											<path d="m10 7-3 3 3 3"/>
											<path d="m14 7 3 3-3 3"/>
										</svg>
									</div>
									<h3 className="text-xl font-bold text-white mb-4">Regional Support</h3>
									<p className="text-white/70 leading-relaxed">
										Get accurate streaming information for your specific region and country
									</p>
								</div>
							</div>
              
							<div className="group">
								<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
									<div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl group-hover:shadow-green-500/25">
										<svg width="32" height="32" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
										</svg>
									</div>
									<h3 className="text-xl font-bold text-white mb-4">Always Updated</h3>
									<p className="text-white/70 leading-relaxed">
										Real-time data ensures you always get the most current streaming availability
									</p>
								</div>
							</div>
						</div>
					</div>
				</main>
				{/* Footer */}
				<footer className="w-full py-8 text-center">
					<div className="text-white/40 text-sm">
						© {new Date().getFullYear()} WhereToWatch. Made with ❤️ for movie lovers everywhere.
					</div>
				</footer>
			</div>
		</div>
	);
}

