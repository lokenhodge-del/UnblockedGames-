import { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, Filter, LayoutGrid, Trophy, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './data/games.json';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(gamesData.map(g => g.category))];
    return cats;
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#111] border-r border-white/5 hidden lg:flex flex-col p-6 z-20">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Gamepad2 className="text-black w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Arcade Hub</h1>
        </div>

        <nav className="space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4 px-2">Categories</p>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 group ${
                activeCategory === cat 
                  ? 'bg-emerald-500 text-black font-semibold' 
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {cat === 'All' && <LayoutGrid size={18} />}
              {cat === 'Puzzle' && <Zap size={18} />}
              {cat === 'Classic' && <Trophy size={18} />}
              {cat !== 'All' && cat !== 'Puzzle' && cat !== 'Classic' && <Filter size={18} />}
              {cat}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-xs text-zinc-400 leading-relaxed">
            Welcome to Arcade Hub. All games are unblocked and ready to play.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Discover Games</h2>
            <p className="text-zinc-500">Explore our collection of {gamesData.length} hand-picked titles.</p>
          </div>

          <div className="relative group max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
            />
          </div>
        </header>

        {/* Game Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <motion.div
              layout
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedGame(game)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <button className="w-full bg-emerald-500 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <Zap size={18} /> Play Now
                  </button>
                </div>
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10">
                  {game.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-1 group-hover:text-emerald-400 transition-colors">{game.title}</h3>
                <p className="text-zinc-500 text-sm line-clamp-2">{game.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Search size={32} className="text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">No games found</h3>
            <p className="text-zinc-500">Try adjusting your search or category filter.</p>
          </div>
        )}
      </main>

      {/* Game Player Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 lg:p-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl aspect-video bg-[#111] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
            >
              {/* Toolbar */}
              <div className="flex items-center justify-between px-6 py-4 border-bottom border-white/5 bg-[#181818]">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Gamepad2 size={18} className="text-black" />
                  </div>
                  <div>
                    <h3 className="font-bold">{selectedGame.title}</h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{selectedGame.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const iframe = document.querySelector('iframe');
                      if (iframe?.requestFullscreen) iframe.requestFullscreen();
                    }}
                    className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize2 size={20} />
                  </button>
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-red-500/20 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
                    title="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Iframe */}
              <div className="flex-1 bg-black relative">
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  allow="fullscreen; autoplay; encrypted-media"
                  title={selectedGame.title}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Nav Overlay */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#111]/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full flex items-center gap-8 z-40 shadow-2xl">
        <button onClick={() => setActiveCategory('All')} className={`p-2 ${activeCategory === 'All' ? 'text-emerald-500' : 'text-zinc-500'}`}>
          <LayoutGrid size={24} />
        </button>
        <button className="p-2 text-zinc-500">
          <Search size={24} />
        </button>
        <button className="p-2 text-zinc-500">
          <Filter size={24} />
        </button>
      </div>
    </div>
  );
}
