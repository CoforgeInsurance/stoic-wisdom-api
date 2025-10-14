import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="border-b-2 border-[var(--border)] bg-[var(--card-bg)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-[var(--primary)] font-serif">
              Stoic Wisdom
            </span>
            <span className="text-[var(--secondary)] text-2xl">❦</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/philosophers" 
              className="text-[var(--foreground)] hover:text-[var(--primary)] font-sans uppercase tracking-wide text-sm font-semibold transition-colors"
            >
              Philosophers
            </Link>
            <Link 
              href="/quotes" 
              className="text-[var(--foreground)] hover:text-[var(--primary)] font-sans uppercase tracking-wide text-sm font-semibold transition-colors"
            >
              Quotes
            </Link>
            <Link 
              href="/themes" 
              className="text-[var(--foreground)] hover:text-[var(--primary)] font-sans uppercase tracking-wide text-sm font-semibold transition-colors"
            >
              Themes
            </Link>
            <Link 
              href="/timeline" 
              className="text-[var(--foreground)] hover:text-[var(--primary)] font-sans uppercase tracking-wide text-sm font-semibold transition-colors"
            >
              Timeline
            </Link>
            <Link 
              href="/surprise" 
              className="vintage-button text-sm"
            >
              Surprise Me
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link href="/surprise" className="vintage-button text-xs px-3 py-2">
              Surprise Me
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
