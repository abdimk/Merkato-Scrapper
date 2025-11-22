'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MOCK_DATABASE } from './data/mockData';
import { DirectorySearchForm } from './components/DirectorySearchForm';
import { SearchResultItem } from './components/SearchResultItem';
import { SearchResult, SearchResponse, StatsResponse } from './types/types';
import './globals.css';


const useDebounce = (callback: Function, delay: number) => {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  return useCallback((...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => callback(...args), delay);
    setTimeoutId(id);
  }, [callback, delay, timeoutId]);
};

const Page: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>(MOCK_DATABASE);
  const [isLoading, setIsLoading] = useState(false);
  const [searchSource, setSearchSource] = useState<'mock' | 'backend' | null>(null);
  const [responseLimit, setResponseLimit] = useState<number>(10);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchTime, setSearchTime] = useState<number>(0);
  const [searchStartTime, setSearchStartTime] = useState<number>(0);
  const [totalRequests, setTotalRequests] = useState<number>(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const resultsRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats`);
        if (response.ok) {
          const data: StatsResponse = await response.json();
          setTotalRequests(data.total_requests);
        } else {
          console.error('Failed to fetch stats, status:', response.status);
          setTotalRequests(50);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setTotalRequests(50);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();

    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);


  const quickMockSearch = useCallback((term: string) => {
    setHasSearched(true);

    if (!term.trim()) {
      setSearchResults(MOCK_DATABASE);
      setSearchSource(null);
      return;
    }

    const lowerTerm = term.toLowerCase();
    const filteredResults = MOCK_DATABASE.filter(
      (item) =>
        item.company_name.toLowerCase().includes(lowerTerm) ||
        item.primary_category?.toLowerCase().includes(lowerTerm) ||
        item.location?.toLowerCase().includes(lowerTerm)
    );
    setSearchResults(filteredResults);
    setSearchSource('mock');
  }, []);

  const backendSearch = useCallback(async (term: string, limit: number) => {
    if (!term.trim()) return;

    const startTime = performance.now();
    setIsLoading(true);
    setSearchStartTime(startTime);

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          term: term,
          response_limit: limit
        }),
      });

      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      setSearchTime(duration);

      if (response.ok) {
        const data: SearchResponse = await response.json();
        if (data.results && data.results.length > 0) {
          setSearchResults(data.results);
          setSearchSource('backend');
        } else {

          console.log('Backend returned no results, keeping mock data');
        }
      } else {
        throw new Error('Backend failed');
      }
    } catch (error) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      setSearchTime(duration);
      console.log('Backend failed, using mock data');

    } finally {
      setIsLoading(false);
    }
  }, []);


  const debouncedBackendSearch = useDebounce(backendSearch, 800);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setSearchTime(0);

    quickMockSearch(searchTerm);


    if (searchTerm.trim()) {
      const startTime = performance.now();
      setSearchStartTime(startTime);
      debouncedBackendSearch(searchTerm, responseLimit);
    } else {

      setSearchResults(MOCK_DATABASE);
      setSearchSource(null);
    }


    if (resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleToggle = (url: string) => {
    setExpandedId(prev => prev === url ? null : url);
  };


  const currentSearchTime = isLoading
    ? Math.round(performance.now() - searchStartTime)
    : searchTime;


  const displayResults = searchResults;
  const showNoResults = hasSearched && searchTerm.trim() && displayResults.length === 0;

  return (
    <div style={{
      backgroundColor: '#e5e5e5',
      minHeight: '100vh',
      fontFamily: 'Courier New, Courier, monospace',
      color: '#000',
      paddingBottom: '60px'
    }}>

      <DirectorySearchForm
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearchSubmit={handleSearch}
        isLoading={isLoading}
        responseLimit={responseLimit}
        setResponseLimit={setResponseLimit}
        searchTime={currentSearchTime}
        totalRequests={statsLoading ? undefined : totalRequests}
      />


      <div ref={resultsRef} style={{ maxWidth: '900px', margin: '0 auto', padding: '30px 20px' }}>


        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '15px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: '0.8rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <span>Results: {displayResults.length}</span>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span>Status: {isLoading ? `Searching... (${currentSearchTime}ms)` : 'Ready'}</span>
            {searchSource && (
              <span style={{
                padding: '2px 8px',
                backgroundColor: searchSource === 'backend' ? '#000' : '#666',
                color: '#fff',
                fontSize: '0.7rem',
                borderRadius: '2px'
              }}>
                {searchSource === 'backend' ? 'LIVE DATA' : 'MOCK DATA'}
              </span>
            )}
            {searchTime > 0 && !isLoading && (
              <span style={{
                padding: '2px 8px',
                backgroundColor: '#00ff00',
                color: '#000',
                fontSize: '0.7rem',
                borderRadius: '2px',
                fontWeight: 'bold',
                fontFamily: 'monospace'
              }}>
                TIME: {searchTime}ms
              </span>
            )}
            {totalRequests > 0 && (
              <span style={{
                padding: '2px 8px',
                backgroundColor: '#ff4444',
                color: '#fff',
                fontSize: '0.7rem',
                borderRadius: '2px',
                fontWeight: 'bold',
                fontFamily: 'monospace'
              }}>
                REQUESTS: {totalRequests.toLocaleString()}
              </span>
            )}
            {searchTerm && (
              <span style={{
                padding: '2px 8px',
                backgroundColor: '#333',
                color: '#fff',
                fontSize: '0.7rem',
                borderRadius: '2px'
              }}>
                LIMIT: {responseLimit}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {showNoResults ? (
            <div style={{
              padding: '40px',
              border: '3px dashed #000',
              textAlign: 'center',
              backgroundColor: '#f0f0f0',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              NO RESULTS FOUND FOR "{searchTerm}"
            </div>
          ) : displayResults.length > 0 ? (
            displayResults.map((result) => (
              <SearchResultItem
                key={result.url}
                result={result}
                isExpanded={expandedId === result.url}
                onToggle={handleToggle}
              />
            ))
          ) : (

            <div style={{
              padding: '40px',
              border: '3px dashed #000',
              textAlign: 'center',
              backgroundColor: '#f0f0f0',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              NO DATA AVAILABLE
            </div>
          )}
        </div>
      </div>

      
    </div>
  );
};

export default Page;