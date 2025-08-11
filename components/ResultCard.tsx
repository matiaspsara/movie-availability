import Image from 'next/image';

type Props = {
  id: number;
  title: string;
  year: number;
  poster: string;
  providers: string[];
};

export default function ResultCard({ poster, title }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
      <Image src={poster} alt={title} width={300} height={450} className="w-full object-contain" />
    </div>
  );
}
