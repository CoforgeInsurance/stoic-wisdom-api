'use client';

import { use } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import { philosophersAPI, PhilosopherWithQuotes } from '@/lib/api';

const fetcher = (id: number) => philosophersAPI.getWithQuotes(id);

export default function PhilosopherDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const unwrappedParams = use(params);
  const philosopherId = parseInt(unwrappedParams.id);
  
  const { data: philosopher, error, isLoading } = useSWR<PhilosopherWithQuotes>(
    philosopherId ? `philosopher-${philosopherId}` : null,
    () => fetcher(philosopherId)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {isLoading ? (
          <Loading />
        ) : error ? (
          <ErrorDisplay message="Unable to load philosopher details. Please try again." />
        ) : philosopher ? (
          <>
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-[var(--card-bg)] to-[var(--background)] border-b-2 border-[var(--border)]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8">
                  <div className="text-7xl mb-6">
                    {philosopher.name === 'Marcus Aurelius' && '👑'}
                    {philosopher.name === 'Seneca' && '🎭'}
                    {philosopher.name === 'Epictetus' && '⛓️'}
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-4 font-serif">
                    {philosopher.name}
                  </h1>
                  
                  <p className="text-xl text-[var(--accent)] font-sans">
                    {philosopher.era} • {philosopher.birth_year}–{philosopher.death_year} CE
                  </p>
                </div>

                <div className="max-w-4xl mx-auto vintage-card rounded-lg p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[var(--primary)] mb-4 font-serif">
                      Biography
                    </h2>
                    <p className="text-lg text-[var(--foreground)] leading-relaxed">
                      {philosopher.biography}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[var(--background)] rounded p-4">
                      <h3 className="text-sm font-sans font-semibold text-[var(--primary)] uppercase tracking-wide mb-2">
                        Key Works
                      </h3>
                      <p className="text-base text-[var(--foreground)]">
                        {philosopher.key_works}
                      </p>
                    </div>

                    <div className="bg-[var(--background)] rounded p-4">
                      <h3 className="text-sm font-sans font-semibold text-[var(--primary)] uppercase tracking-wide mb-2">
                        Core Teachings
                      </h3>
                      <p className="text-base text-[var(--foreground)]">
                        {philosopher.core_teachings}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quotes Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <h2 className="text-3xl font-bold text-[var(--primary)] text-center mb-12 ornamental-header">
                Quotes by {philosopher.name}
              </h2>

              <div className="space-y-6">
                {philosopher.quotes.map((quote) => (
                  <div key={quote.id} className="vintage-card rounded-lg p-6 md:p-8">
                    <div className="text-3xl text-[var(--secondary)] mb-2">"</div>
                    <blockquote className="text-xl md:text-2xl font-serif text-[var(--foreground)] leading-relaxed mb-4">
                      {quote.text}
                    </blockquote>
                    <div className="text-3xl text-[var(--secondary)] text-right mb-4">"</div>
                    
                    <div className="border-t border-[var(--border)] pt-4">
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

              <div className="text-center mt-12">
                <Link href="/philosophers" className="vintage-button">
                  ← Back to Philosophers
                </Link>
              </div>
            </div>
          </>
        ) : null}
      </main>

      <footer className="border-t-2 border-[var(--border)] bg-[var(--card-bg)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-[var(--accent)] font-sans">
            "We suffer more often in imagination than in reality."
          </p>
          <p className="text-xs text-[var(--secondary)] mt-2">
            — Seneca
          </p>
        </div>
      </footer>
    </div>
  );
}
