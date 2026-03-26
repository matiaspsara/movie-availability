"use client";

const LANGUAGES = [
	{ code: "en", label: "English" },
	{ code: "es", label: "Español" },
];

export default function LanguageSelector({ value, onChange }: { value: string; onChange: (lang: string) => void }) {
	return (
		<div className="flex items-center">
			<select
				className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none hover:bg-[#222222] hover:border-[#3a3a3a] transition-colors duration-200 cursor-pointer"
				value={value}
				onChange={e => onChange(e.target.value)}
			>
				{LANGUAGES.map(lang => (
					<option key={lang.code} value={lang.code} className="bg-[#1a1a1a]">
						{lang.label}
					</option>
				))}
			</select>
		</div>
	);
}
