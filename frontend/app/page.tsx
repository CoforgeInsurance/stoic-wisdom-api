'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import { quotesAPI, Quote } from '@/lib/api';

const fetcher = () => quotesAPI.random();

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: quote, error, isLoading } = useSWR<Quote>(['quote', refreshKey], fetcher);

  const getNewQuote = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-b from-[var(--card-bg)] to-[var(--background)] border-b-2 border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <div className="text-center mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-3 font-serif">
                Stoic Wisdom
              </h1>
              <div className="vintage-divider my-3">
                <span className="text-[var(--secondary)] text-xl">❦</span>
              </div>
              <p className="text-lg text-[var(--accent)] font-sans">
                Ancient Philosophy for Modern Life
              </p>
            </div>

            {/* Quote Display */}
            <div className="max-w-4xl mx-auto">
              {isLoading ? (
                <Loading />
              ) : error ? (
                <ErrorDisplay message="Unable to load quote. Please try again." />
              ) : quote ? (
                <div className="vintage-card rounded-lg p-6 md:p-8">
                  <div className="text-3xl text-[var(--secondary)] mb-2">"</div>
                  <blockquote className="text-xl md:text-2xl font-serif text-[var(--foreground)] leading-relaxed mb-4">
                    {quote.text}
                  </blockquote>
                  <div className="text-3xl text-[var(--secondary)] text-right mb-4">"</div>
                  
                  <div className="border-t border-[var(--border)] pt-4 mt-4">
                    <p className="text-base font-semibold text-[var(--primary)] mb-1">
                      — {quote.philosopher_name}
                    </p>
                    <p className="text-sm text-[var(--accent)] italic mb-3">
                      {quote.source}
                    </p>
                    
                    <div className="bg-[var(--background)] rounded p-3 mt-3">
                      <p className="text-xs font-sans font-semibold text-[var(--primary)] uppercase tracking-wide mb-1">
                        Modern Interpretation
                      </p>
                      <p className="text-sm text-[var(--foreground)]">
                        {quote.modern_interpretation}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="text-center mt-4">
                <button 
                  onClick={getNewQuote}
                  className="vintage-button text-sm"
                  disabled={isLoading}
                >
                  New Quote
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <h2 className="text-2xl font-bold text-[var(--primary)] text-center mb-6 ornamental-header">
            Explore Ancient Wisdom
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/philosophers" className="vintage-card rounded-lg p-4 text-center hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">📜</div>
              <h3 className="text-base font-bold text-[var(--primary)] mb-1">Philosophers</h3>
              <p className="text-xs text-[var(--foreground)]">
                Meet the great Stoic masters
              </p>
            </Link>

            <Link href="/quotes" className="vintage-card rounded-lg p-4 text-center hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">💭</div>
              <h3 className="text-base font-bold text-[var(--primary)] mb-1">Quotes</h3>
              <p className="text-xs text-[var(--foreground)]">
                Timeless wisdom to ponder
              </p>
            </Link>

            <Link href="/themes" className="vintage-card rounded-lg p-4 text-center hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="text-base font-bold text-[var(--primary)] mb-1">Themes</h3>
              <p className="text-xs text-[var(--foreground)]">
                Core principles of Stoicism
              </p>
            </Link>

            <Link href="/timeline" className="vintage-card rounded-lg p-4 text-center hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">⏳</div>
              <h3 className="text-base font-bold text-[var(--primary)] mb-1">Timeline</h3>
              <p className="text-xs text-[var(--foreground)]">
                Journey through history
              </p>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[var(--border)] bg-[var(--card-bg)] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-[var(--accent)] font-sans">
            "The happiness of your life depends upon the quality of your thoughts."
          </p>
          <p className="text-xs text-[var(--secondary)] mt-1">
            — Marcus Aurelius
          </p>
        </div>
      </footer>
    </div>
  );
}
