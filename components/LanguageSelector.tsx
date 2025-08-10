"use client";
import { useState, useEffect } from "react";

const LANGUAGES = [
	{ code: "en", label: "English" },
	{ code: "es", label: "Español" },
];

export default function LanguageSelector({ value, onChange }: { value: string; onChange: (lang: string) => void }) {
	return (
		<div className="flex items-center gap-2">
			<span className="text-sm font-medium">🌐</span>
			<select
				className="bg-transparent border rounded px-2 py-1 text-sm focus:outline-none"
				value={value}
				onChange={e => onChange(e.target.value)}
			>
				{LANGUAGES.map(lang => (
					<option key={lang.code} value={lang.code}>
						{lang.label}
					</option>
				))}
			</select>
		</div>
	);
}
