import ResultCard from './ResultCard';

const mockResults = [
  {
    id: 1,
    title: 'Inception',
    year: 2010,
    poster: 'https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
    providers: ['Netflix', 'Prime Video'],
  },
  {
    id: 2,
    title: 'The Matrix',
    year: 1999,
    poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    providers: ['HBO Max'],
  },
];

export default function ResultsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {mockResults.map(item => (
        <ResultCard key={item.id} {...item} />
      ))}
    </div>
  );
}
