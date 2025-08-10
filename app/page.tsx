import AppLayout from '../components/AppLayout';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Find Your Next
            <span className="block text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              Favorite Show
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover where to watch your favorite movies and TV shows across all streaming platforms
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
              <span className="text-lg">🎬 50,000+ Movies</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
              <span className="text-lg">📺 20,000+ TV Shows</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
              <span className="text-lg">🌍 100+ Countries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Why Choose StreamFinder?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Smart Search</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Find any movie or TV show instantly with our intelligent search powered by TMDb
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Global Availability</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Check streaming availability across different regions and countries
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Always Accessible</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Works perfectly on desktop, tablet, and mobile with dark mode support
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Action', icon: '💥', color: 'bg-red-500' },
              { name: 'Comedy', icon: '😂', color: 'bg-yellow-500' },
              { name: 'Drama', icon: '🎭', color: 'bg-blue-500' },
              { name: 'Sci-Fi', icon: '🚀', color: 'bg-purple-500' },
              { name: 'Horror', icon: '👻', color: 'bg-gray-500' },
              { name: 'Romance', icon: '💕', color: 'bg-pink-500' },
              { name: 'Thriller', icon: '😱', color: 'bg-orange-500' },
              { name: 'Documentary', icon: '📹', color: 'bg-green-500' },
            ].map((category) => (
              <div key={category.name} className="group cursor-pointer">
                <div className={`${category.color} rounded-lg p-6 text-center text-white transform transition-transform group-hover:scale-105`}>
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <div className="font-semibold">{category.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Discover?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start searching for your favorite movies and TV shows right now
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <p className="text-white text-lg mb-4">
              Try searching for popular titles like:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Inception', 'The Matrix', 'Breaking Bad', 'Stranger Things', 'Avengers'].map((title) => (
                <span key={title} className="bg-white/20 rounded-full px-4 py-2 text-white text-sm">
                  {title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">🎬 StreamFinder</h3>
              <p className="text-gray-400">
                Your ultimate guide to finding where to watch movies and TV shows across all streaming platforms.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Smart Search</li>
                <li>Global Availability</li>
                <li>Dark Mode</li>
                <li>Mobile Friendly</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Data Sources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>TMDb API</li>
                <li>Real-time Updates</li>
                <li>Accurate Information</li>
                <li>Multiple Regions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StreamFinder. Made with ❤️ for movie lovers everywhere.</p>
          </div>
        </div>
      </footer>
    </AppLayout>
  );
}
