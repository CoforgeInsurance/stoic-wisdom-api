'use client';

import useSWR from 'swr';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import { philosophersAPI, Philosopher } from '@/lib/api';

const fetcher = () => philosophersAPI.list();

export default function PhilosophersPage() {
  const { data: philosophers, error, isLoading } = useSWR<Philosopher[]>('philosophers', fetcher);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-4 font-serif">
              The Great Stoics
            </h1>
            <div className="vintage-divider my-6">
              <span className="text-[var(--secondary)] text-2xl">❦</span>
            </div>
            <p className="text-lg text-[var(--accent)] font-sans max-w-2xl mx-auto">
              Meet the three pillars of Stoic philosophy whose wisdom has endured through the ages
            </p>
          </div>

          {isLoading ? (
            <Loading />
          ) : error ? (
            <ErrorDisplay message="Unable to load philosophers. Please try again." />
          ) : philosophers ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {philosophers.map((philosopher) => (
                <Link 
                  key={philosopher.id}
                  href={`/philosophers/${philosopher.id}`}
                  className="vintage-card rounded-lg p-6 hover:scale-105 transition-transform"
                >
                  <div className="text-5xl text-center mb-4">
                    {philosopher.name === 'Marcus Aurelius' && '👑'}
                    {philosopher.name === 'Seneca' && '🎭'}
                    {philosopher.name === 'Epictetus' && '⛓️'}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-[var(--primary)] text-center mb-2">
                    {philosopher.name}
                  </h2>
                  
                  <p className="text-sm text-[var(--accent)] text-center mb-4 font-sans">
                    {philosopher.era} ({philosopher.birth_year}–{philosopher.death_year} CE)
                  </p>
                  
                  <div className="border-t border-[var(--border)] pt-4 mt-4">
                    <p className="text-sm text-[var(--foreground)] line-clamp-3 mb-4">
                      {philosopher.biography}
                    </p>
                    
                    <div className="bg-[var(--background)] rounded p-3">
                      <p className="text-xs font-sans font-semibold text-[var(--primary)] uppercase tracking-wide mb-1">
                        Key Works
                      </p>
                      <p className="text-sm text-[var(--foreground)] italic">
                        {philosopher.key_works}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <span className="text-sm text-[var(--primary)] font-sans font-semibold uppercase tracking-wide">
                      Learn More →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </main>

      <footer className="border-t-2 border-[var(--border)] bg-[var(--card-bg)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-[var(--accent)] font-sans">
            "Waste no more time arguing about what a good man should be. Be one."
          </p>
          <p className="text-xs text-[var(--secondary)] mt-2">
            — Marcus Aurelius
          </p>
        </div>
      </footer>
    </div>
  );
}
