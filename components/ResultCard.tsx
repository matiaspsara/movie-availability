import Image from 'next/image';

type Props = {
  id: number;
  title: string;
  year: number;
  poster: string;
  providers: string[];
};

export default function ResultCard({ title, year, poster, providers }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
      <Image src={poster} alt={title} width={300} height={240} className="w-full h-60 object-cover" />
      <div className="p-3">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{year}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {providers.map(p => (
            <span
              key={p}
              className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
