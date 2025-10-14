'use client';

import useSWR from 'swr';
import Navigation from '@/components/Navigation';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import { timelineAPI, TimelineEvent } from '@/lib/api';

const fetcher = () => timelineAPI.list();

export default function TimelinePage() {
  const { data: timeline, error, isLoading } = useSWR<TimelineEvent[]>('timeline', fetcher);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-4 font-serif">
              Timeline of Stoicism
            </h1>
            <div className="vintage-divider my-6">
              <span className="text-[var(--secondary)] text-2xl">❦</span>
            </div>
            <p className="text-lg text-[var(--accent)] font-sans max-w-2xl mx-auto">
              A journey through the history of Stoic philosophy
            </p>
          </div>

          {isLoading ? (
            <Loading />
          ) : error ? (
            <ErrorDisplay message="Unable to load timeline. Please try again." />
          ) : timeline ? (
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-[var(--border)]"></div>

                {timeline.map((event, index) => (
                  <div key={event.id} className="relative mb-12">
                    {/* Timeline dot */}
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 -ml-2 rounded-full bg-[var(--primary)] border-4 border-[var(--card-bg)] z-10"></div>

                    {/* Content card - alternating sides on desktop */}
                    <div className={`ml-20 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                      <div className="vintage-card rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-[var(--primary)] font-serif">
                            {event.year > 0 ? `${event.year} CE` : `${Math.abs(event.year)} BCE`}
                          </span>
                          <span className="text-2xl">
                            {event.year < 0 && '🏛️'}
                            {event.year >= 0 && event.year < 100 && '📜'}
                            {event.year >= 100 && event.year < 200 && '👑'}
                            {event.year >= 200 && '⏳'}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">
                          {event.event}
                        </h3>
                        
                        <p className="text-base text-[var(--foreground)] mb-4">
                          {event.significance}
                        </p>
                        
                        {event.related_philosopher && (
                          <div className="bg-[var(--background)] rounded p-3">
                            <p className="text-xs font-sans font-semibold text-[var(--primary)] uppercase tracking-wide mb-1">
                              Related Philosopher
                            </p>
                            <p className="text-sm text-[var(--foreground)] font-semibold">
                              {event.related_philosopher}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </main>

      <footer className="border-t-2 border-[var(--border)] bg-[var(--card-bg)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-[var(--accent)] font-sans">
            "The whole future lies in uncertainty: live immediately."
          </p>
          <p className="text-xs text-[var(--secondary)] mt-2">
            — Seneca
          </p>
        </div>
      </footer>
    </div>
  );
}
