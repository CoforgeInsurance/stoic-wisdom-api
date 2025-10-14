'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Navigation from '@/components/Navigation';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import { 
  quotesAPI, 
  incidentsAPI, 
  themesAPI,
  Quote, 
  Incident, 
  Theme 
} from '@/lib/api';

type ContentType = 'quote' | 'incident' | 'theme';

interface SurpriseContent {
  type: ContentType;
  data: Quote | Incident | Theme;
}

export default function SurprisePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentContent, setCurrentContent] = useState<SurpriseContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch all data
  const { data: quotes } = useSWR<Quote[]>('quotes-surprise', () => quotesAPI.list());
  const { data: incidents } = useSWR<Incident[]>('incidents-surprise', () => incidentsAPI.list());
  const { data: themes } = useSWR<Theme[]>('themes-surprise', () => themesAPI.list());

  const isLoading = !quotes || !incidents || !themes;

  // Generate random content
  const generateSurprise = () => {
    if (!quotes || !incidents || !themes) return;

    setIsGenerating(true);
    
    // Simulate a brief loading animation
    setTimeout(() => {
      const contentTypes: ContentType[] = ['quote', 'incident', 'theme'];
      const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
      
      let randomData: Quote | Incident | Theme;
      
      switch (randomType) {
        case 'quote':
          randomData = quotes[Math.floor(Math.random() * quotes.length)];
          break;
        case 'incident':
          randomData = incidents[Math.floor(Math.random() * incidents.length)];
          break;
        case 'theme':
          randomData = themes[Math.floor(Math.random() * themes.length)];
          break;
      }
      
      setCurrentContent({ type: randomType, data: randomData });
      setIsGenerating(false);
    }, 600);
  };

  // Generate initial content on load
  useEffect(() => {
    if (quotes && incidents && themes && !currentContent) {
      generateSurprise();
    }
  }, [quotes, incidents, themes, currentContent]);

  const renderQuote = (quote: Quote) => (
    <div className="vintage-card rounded-lg p-8 md:p-12">
      <div className="text-center mb-6">
        <span className="inline-block px-4 py-2 bg-[var(--primary)] text-[var(--card-bg)] rounded-full text-sm font-sans font-bold uppercase tracking-wide">
          💭 Random Quote
        </span>
      </div>
      
      <div className="text-4xl text-[var(--secondary)] mb-4">"</div>
      <blockquote className="text-2xl md:text-3xl font-serif text-[var(--foreground)] leading-relaxed mb-6 text-center">
        {quote.text}
      </blockquote>
      <div className="text-4xl text-[var(--secondary)] text-right mb-6">"</div>
      
      <div className="border-t border-[var(--border)] pt-6 mt-6">
        <p className="text-lg font-semibold text-[var(--primary)] mb-2 text-center">
          — {quote.philosopher_name}
        </p>
        <p className="text-sm text-[var(--accent)] italic mb-4 text-center">
          {quote.source}
        </p>
        
        <div className="bg-[var(--background)] rounded p-4 mt-6">
          <p className="text-sm font-sans font-semibold text-[var(--primary)] uppercase tracking-wide mb-2">
            Modern Interpretation
          </p>
          <p className="text-base text-[var(--foreground)]">
            {quote.modern_interpretation}
          </p>
        </div>
      </div>
    </div>
  );

  const renderIncident = (incident: Incident) => (
    <div className="vintage-card rounded-lg p-8 md:p-12">
      <div className="text-center mb-6">
        <span className="inline-block px-4 py-2 bg-[var(--primary)] text-[var(--card-bg)] rounded-full text-sm font-sans font-bold uppercase tracking-wide">
          📖 Historical Incident
        </span>
      </div>
      
      <h2 className="text-3xl font-bold text-[var(--primary)] mb-4 text-center font-serif">
        {incident.title}
      </h2>
      
      <p className="text-lg text-[var(--accent)] mb-6 text-center font-sans">
        {incident.philosopher_name} • {incident.year > 0 ? `${incident.year} CE` : `${Math.abs(incident.year)} BCE`}
      </p>
      
      <div className="space-y-6">
        <div className="bg-[var(--background)] rounded p-4">
          <p className="text-sm font-sans font-semibold text-[var(--primary)] uppercase tracking-wide mb-2">
            What Happened
          </p>
          <p className="text-base text-[var(--foreground)]">
            {incident.description}
          </p>
        </div>
        
        <div className="bg-[var(--background)] rounded p-4">
          <p className="text-sm font-sans font-semibold text-[var(--primary)] uppercase tracking-wide mb-2">
            Stoic Response
          </p>
          <p className="text-base text-[var(--foreground)]">
            {incident.stoic_response}
          </p>
        </div>
        
        <div className="bg-[var(--background)] rounded p-4">
          <p className="text-sm font-sans font-semibold text-[var(--primary)] uppercase tracking-wide mb-2">
            Lesson
          </p>
          <p className="text-base text-[var(--foreground)]">
            {incident.lesson}
          </p>
        </div>
        
        <div className="bg-[var(--background)] rounded p-4">
          <p className="text-sm font-sans font-semibold text-[var(--primary)] uppercase tracking-wide mb-2">
            Modern Parallel
          </p>
          <p className="text-base text-[var(--foreground)]">
            {incident.modern_parallel}
          </p>
        </div>
      </div>
    </div>
  );

  const renderTheme = (theme: Theme) => (
    <div className="vintage-card rounded-lg p-8 md:p-12">
      <div className="text-center mb-6">
        <span className="inline-block px-4 py-2 bg-[var(--primary)] text-[var(--card-bg)] rounded-full text-sm font-sans font-bold uppercase tracking-wide">
          🎯 Stoic Theme
        </span>
      </div>
      
      <h2 className="text-3xl font-bold text-[var(--primary)] mb-4 text-center font-serif">
        {theme.name}
      </h2>
      
      <p className="text-xl text-[var(--foreground)] italic mb-8 text-center">
        {theme.principle}
      </p>
      
      <div className="space-y-6">
        <div className="bg-[var(--background)] rounded p-4">
          <p className="text-sm font-sans font-semibold text-[var(--primary)] uppercase tracking-wide mb-2">
            Modern Application
          </p>
          <p className="text-base text-[var(--foreground)]">
            {theme.modern_application}
          </p>
        </div>
        
        <div className="bg-[var(--background)] rounded p-4">
          <p className="text-sm font-sans font-semibold text-[var(--primary)] uppercase tracking-wide mb-2">
            Practice Method
          </p>
          <p className="text-base text-[var(--foreground)]">
            {theme.practice_method}
          </p>
        </div>
        
        {theme.scientific_basis && (
          <div className="bg-[var(--background)] rounded p-4">
            <p className="text-sm font-sans font-semibold text-[var(--primary)] uppercase tracking-wide mb-2">
              Scientific Basis
            </p>
            <p className="text-base text-[var(--foreground)]">
              {theme.scientific_basis}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-4 font-serif">
              Surprise Me!
            </h1>
            <div className="vintage-divider my-6">
              <span className="text-[var(--secondary)] text-2xl">❦</span>
            </div>
            <p className="text-lg text-[var(--accent)] font-sans max-w-2xl mx-auto">
              Discover random wisdom, stories, and teachings from ancient philosophy
            </p>
          </div>

          {isLoading ? (
            <Loading />
          ) : (
            <>
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                  <div className="vintage-spinner mb-4"></div>
                  <p className="text-[var(--primary)] font-sans uppercase tracking-wide text-sm">
                    Generating surprise...
                  </p>
                </div>
              ) : currentContent ? (
                <div className="max-w-4xl mx-auto">
                  {currentContent.type === 'quote' && renderQuote(currentContent.data as Quote)}
                  {currentContent.type === 'incident' && renderIncident(currentContent.data as Incident)}
                  {currentContent.type === 'theme' && renderTheme(currentContent.data as Theme)}
                </div>
              ) : null}

              <div className="text-center mt-8">
                <button 
                  onClick={generateSurprise}
                  className="vintage-button text-base"
                  disabled={isGenerating}
                >
                  🎲 Surprise Me Again!
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="border-t-2 border-[var(--border)] bg-[var(--card-bg)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-[var(--accent)] font-sans">
            "Luck is what happens when preparation meets opportunity."
          </p>
          <p className="text-xs text-[var(--secondary)] mt-2">
            — Seneca
          </p>
        </div>
      </footer>
    </div>
  );
}
