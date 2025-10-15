'use client';

import useSWR from 'swr';
import Navigation from '@/components/Navigation';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import { themesAPI, Theme } from '@/lib/api';

const fetcher = () => themesAPI.list();

export default function ThemesPage() {
  const { data: themes, error, isLoading } = useSWR<Theme[]>('themes', fetcher);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-4 font-serif">
              Stoic Themes
            </h1>
            <div className="vintage-divider my-6">
              <span className="text-[var(--secondary)] text-2xl">❦</span>
            </div>
            <p className="text-lg text-[var(--accent)] font-sans max-w-2xl mx-auto">
              Core principles and practices of Stoic philosophy
            </p>
          </div>

          {isLoading ? (
            <Loading />
          ) : error ? (
            <ErrorDisplay message="Unable to load themes. Please try again." />
          ) : themes ? (
            <div className="max-w-5xl mx-auto space-y-8">
              {themes.map((theme, index) => (
                <div key={theme.id} className="vintage-card rounded-lg p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-[var(--primary)] mb-2 font-serif">
                        {index + 1}. {theme.name}
                      </h2>
                      <p className="text-lg text-[var(--foreground)] italic">
                        {theme.principle}
                      </p>
                    </div>
                    <div className="text-5xl">
                      {index === 0 && '🎯'}
                      {index === 1 && '🧘'}
                      {index === 2 && '💪'}
                      {index === 3 && '🌊'}
                      {index === 4 && '⚖️'}
                      {index === 5 && '🏛️'}
                      {index === 6 && '🔄'}
                      {index === 7 && '☀️'}
                      {index === 8 && '🌱'}
                      {index > 8 && '✨'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[var(--background)] rounded p-4">
                      <h3 className="text-sm font-sans font-semibold text-[var(--primary)] uppercase tracking-wide mb-2">
                        Modern Application
                      </h3>
                      <p className="text-base text-[var(--foreground)]">
                        {theme.modern_application}
                      </p>
                    </div>

                    <div className="bg-[var(--background)] rounded p-4">
                      <h3 className="text-sm font-sans font-semibold text-[var(--primary)] uppercase tracking-wide mb-2">
                        Practice Method
                      </h3>
                      <p className="text-base text-[var(--foreground)]">
                        {theme.practice_method}
                      </p>
                    </div>
                  </div>

                  {theme.scientific_basis && (
                    <div className="mt-6 border-t border-[var(--border)] pt-6">
                      <h3 className="text-sm font-sans font-semibold text-[var(--primary)] uppercase tracking-wide mb-2">
                        Scientific Basis
                      </h3>
                      <p className="text-base text-[var(--foreground)]">
                        {theme.scientific_basis}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </main>

      <footer className="border-t-2 border-[var(--border)] bg-[var(--card-bg)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-[var(--accent)] font-sans">
            "It is not that we have a short time to live, but that we waste a lot of it."
          </p>
          <p className="text-xs text-[var(--secondary)] mt-2">
            — Seneca
          </p>
        </div>
      </footer>
    </div>
  );
}
