/**
 * API Client for Stoic Wisdom API
 * Handles all backend communication with configurable base URL
 */

// Base API URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// Type definitions
export interface Philosopher {
  id: number;
  name: string;
  era: string;
  birth_year: number;
  death_year: number;
  biography: string;
  key_works: string;
  core_teachings: string;
}

export interface Quote {
  id: number;
  philosopher_id: number;
  philosopher_name: string;
  text: string;
  source: string;
  context: string;
  modern_interpretation: string;
}

export interface Theme {
  id: number;
  name: string;
  principle: string;
  modern_application: string;
  scientific_basis: string;
  practice_method: string;
}

export interface TimelineEvent {
  id: number;
  year: number;
  event: string;
  significance: string;
  related_philosopher?: string;
}

export interface Incident {
  id: number;
  title: string;
  philosopher_id: number;
  philosopher_name: string;
  year: number;
  description: string;
  stoic_response: string;
  lesson: string;
  modern_parallel: string;
}

export interface PhilosopherWithQuotes extends Philosopher {
  quotes: Quote[];
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Philosophers API
 */
export const philosophersAPI = {
  list: () => apiFetch<Philosopher[]>('/philosophers'),
  get: (id: number) => apiFetch<Philosopher>(`/philosophers/${id}`),
  getWithQuotes: (id: number) => apiFetch<PhilosopherWithQuotes>(`/philosophers/${id}/quotes`),
};

/**
 * Quotes API
 */
export const quotesAPI = {
  list: () => apiFetch<Quote[]>('/quotes'),
  random: () => apiFetch<Quote>('/quotes/random'),
  daily: () => apiFetch<Quote>('/quotes/daily'),
  byPhilosopher: (name: string) => apiFetch<Quote[]>(`/quotes?philosopher=${encodeURIComponent(name)}`),
  byTheme: (theme: string) => apiFetch<Quote[]>(`/quotes?theme=${encodeURIComponent(theme)}`),
  search: (term: string) => apiFetch<Quote[]>(`/quotes?search=${encodeURIComponent(term)}`),
};

/**
 * Themes API
 */
export const themesAPI = {
  list: () => apiFetch<Theme[]>('/themes'),
  get: (id: number) => apiFetch<Theme>(`/themes/${id}`),
};

/**
 * Timeline API
 */
export const timelineAPI = {
  list: () => apiFetch<TimelineEvent[]>('/timeline'),
};

/**
 * Incidents API
 */
export const incidentsAPI = {
  list: () => apiFetch<Incident[]>('/incidents'),
  get: (id: number) => apiFetch<Incident>(`/incidents/${id}`),
};

/**
 * Health Check API
 */
export const healthAPI = {
  check: () => apiFetch<{ status: string }>('/health'),
  ready: () => apiFetch<string>('/ready'),
};
