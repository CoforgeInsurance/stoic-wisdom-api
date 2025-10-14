'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import Navigation from '@/components/Navigation';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import { quotesAPI, Quote } from '@/lib/api';

const fetcher = () => quotesAPI.list();

export default function QuotesPage() {
  const { data: quotes, error, isLoading } = useSWR<Quote[]>('quotes', fetcher);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<string>('all');

  // Get unique philosophers from quotes
  const philosophers = useMemo(() => {
    if (!quotes) return [];
    const uniquePhilosophers = Array.from(
      new Set(quotes.map(q => q.philosopher_name))
    ).sort();
    return uniquePhilosophers;
  }, [quotes]);

  // Filter quotes based on search and philosopher selection
  const filteredQuotes = useMemo(() => {
    if (!quotes) return [];
    
    return quotes.filter(quote => {
      const matchesPhilosopher = selectedPhilosopher === 'all' || 
        quote.philosopher_name === selectedPhilosopher;
      
      const matchesSearch = searchTerm === '' || 
        quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.modern_interpretation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.source.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesPhilosopher && matchesSearch;
    });
  }, [quotes, selectedPhilosopher, searchTerm]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-4 font-serif">
              Stoic Quotes
            </h1>
            <div className="vintage-divider my-6">
              <span className="text-[var(--secondary)] text-2xl">❦</span>
            </div>
            <p className="text-lg text-[var(--accent)] font-sans max-w-2xl mx-auto">
              Timeless wisdom from the great Stoic philosophers
            </p>
          </div>

          {/* Filters */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="vintage-card rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-sans font-semibold text-[var(--primary)] uppercase tracking-wide mb-2">
                    Search Quotes
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search in quotes..."
                    className="w-full px-4 py-2 border-2 border-[var(--border)] rounded bg-[var(--card-bg)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-semibold text-[var(--primary)] uppercase tracking-wide mb-2">
                    Filter by Philosopher
                  </label>
                  <select
                    value={selectedPhilosopher}
                    onChange={(e) => setSelectedPhilosopher(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-[var(--border)] rounded bg-[var(--card-bg)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                  >
                    <option value="all">All Philosophers</option>
                    {philosophers.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredQuotes && (
                <p className="mt-4 text-sm text-[var(--accent)] font-sans">
                  Showing {filteredQuotes.length} of {quotes?.length || 0} quotes
                </p>
              )}
            </div>
          </div>

          {/* Quotes Display */}
          {isLoading ? (
            <Loading />
          ) : error ? (
            <ErrorDisplay message="Unable to load quotes. Please try again." />
          ) : filteredQuotes && filteredQuotes.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {filteredQuotes.map((quote) => (
                <div key={quote.id} className="vintage-card rounded-lg p-6 md:p-8">
                  <div className="text-3xl text-[var(--secondary)] mb-2">"</div>
                  <blockquote className="text-xl md:text-2xl font-serif text-[var(--foreground)] leading-relaxed mb-4">
                    {quote.text}
                  </blockquote>
                  <div className="text-3xl text-[var(--secondary)] text-right mb-4">"</div>
                  
                  <div className="border-t border-[var(--border)] pt-4">
                    <p className="text-base font-semibold text-[var(--primary)] mb-2">
                      — {quote.philosopher_name}
                    </p>
                    <p className="text-sm text-[var(--accent)] italic mb-4">
                      {quote.source}
                    </p>
                    
                    {quote.context && (
                      <div className="bg-[var(--background)] rounded p-4 mb-4">
                        <p className="text-xs font-sans font-semibold text-[var(--primary)] uppercase tracking-wide mb-2">
                          Historical Context
                        </p>
                        <p className="text-sm text-[var(--foreground)]">
                          {quote.context}
                        </p>
                      </div>
                    )}
                    
                    <div className="bg-[var(--background)] rounded p-4">
                      <p className="text-xs font-sans font-semibold text-[var(--primary)] uppercase tracking-wide mb-2">
                        Modern Interpretation
                      </p>
                      <p className="text-sm text-[var(--foreground)]">
                        {quote.modern_interpretation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-[var(--accent)]">
                No quotes found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t-2 border-[var(--border)] bg-[var(--card-bg)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-[var(--accent)] font-sans">
            "He who fears death will never do anything worth of a man who is alive."
          </p>
          <p className="text-xs text-[var(--secondary)] mt-2">
            — Seneca
          </p>
        </div>
      </footer>
    </div>
  );
}
