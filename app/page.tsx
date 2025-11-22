'use client';

import React, { useState, useMemo, useRef } from 'react';

// --- 1. Type Definitions ---

interface SearchResult {
  url: string;
  company_name: string;
  logo_url?: string;
  phone_main?: string;
  location?: string;
  primary_category?: string;
  website?: string;
  email?: string;
  description_full?: string;
  products_and_services?: string[];
}

// --- 2. Mock Data ---

const MOCK_DATABASE: SearchResult[] = [
  {
    "url": "https://www.2merkato.com/directory/41254-midea",
    "company_name": "K.MIKEDEM GENERAL IMPORT & EXPORT",
    "logo_url": "https://www.2merkato.com/images/mtree/listings/m/38481.jpg",
    "phone_main": "+251 99 0171 211",
    "location": "Bole Medhanialem, Addis Ababa",
    "primary_category": "Electro-Mechanical Appliances",
    "website": "https://kmikedem.com",
    "email": "MideaB2B@outlook.com",
    "description_full": "Established in 1995, K.Mikedem is a dynamic Ethiopian company engaged in export, import, real estate, and food processing. Backed by decades of experience and strong international partnerships, the company is known for delivering high-quality products and trusted services across sectors...",
    "products_and_services": ["https://www.2merkato.com/images/mtree/listings/s/38483.png", "https://www.2merkato.com/images/mtree/listings/s/38484.jpg"],
  },
  {
    "url": "https://www.2merkato.com/directory/41278-lubaba-granite-marble-and-art-stone",
    "company_name": "LUBABA GRANITE MARBLE & ART STONE",
    "logo_url": "https://www.2merkato.com/images/mtree/listings/m/38830.jpg",
    "phone_main": "09 66 702 367",
    "location": "Tulu dimtu alem bank, Addis Ababa",
    "primary_category": "Building Materials",
    "website": "N/A",
    "email": "Lubabaeibre2367@Gmail.com",
    "description_full": "Lubaba Granite Marble and Art Stone is a dynamic, client-focused company in Addis Ababa, Ethiopia, specializing in high-quality finishing work and premium construction materials...",
    "products_and_services": ["https://www.2merkato.com/images/mtree/listings/s/38831.jpg", "https://www.2merkato.com/images/mtree/listings/s/38832.jpg"],
  },
  {
    "url": "https://www.2merkato.com/directory/41049-eureka-consulting-services-pvtltdco",
    "company_name": "EUREKA CONSULTING SERVICES",
    "logo_url": "https://www.2merkato.com/images/mtree/listings/m/35667.png",
    "phone_main": "(+251)-911-51-62-62",
    "location": "Gullele Sub City, Addis Ababa",
    "primary_category": "Consultancy",
    "website": "N/A",
    "email": "N/A",
    "description_full": "Eureka Consulting Services Pvt.Ltd.Co. established in 2010 according to the Ethiopian trade law... (Full description preserved in logic)...",
    "products_and_services": [],
  },
];

// --- 3. Icons ---

const Icons = {
  Search: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2 }}>
      <path strokeLinecap="square" strokeLinejoin="miter" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2 }}>
      <path strokeLinecap="square" strokeLinejoin="miter" d="M12 4v16m8-8H4" />
    </svg>
  ),
  Minus: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2 }}>
      <path strokeLinecap="square" strokeLinejoin="miter" d="M20 12H4" />
    </svg>
  ),
  External: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2 }}>
      <path strokeLinecap="square" strokeLinejoin="miter" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2 }}>
      <path strokeLinecap="square" strokeLinejoin="miter" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
};

// --- 4. Tag Component ---

const NeoTag = ({ children, onClick, active }: any) => (
  <button
    onClick={onClick}
    style={{
      background: active ? '#000' : '#fff',
      color: active ? '#fff' : '#000',
      border: '2px solid #000',
      padding: '6px 16px',
      fontWeight: '600',
      fontFamily: 'monospace',
      cursor: 'pointer',
      marginRight: '8px',
      marginBottom: '8px',
      textTransform: 'uppercase',
      fontSize: '0.8rem',
      boxShadow: active ? 'inset 2px 2px 0px #333' : '3px 3px 0px #ccc',
      transition: 'all 0.1s'
    }}
  >
    {children}
  </button>
);

// --- 5. Main Component ---

const BusinessDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const filteredResults = useMemo(() => {
    if (!searchTerm) return MOCK_DATABASE;
    const lower = searchTerm.toLowerCase();
    return MOCK_DATABASE.filter(
      (item) =>
        item.company_name.toLowerCase().includes(lower) ||
        item.primary_category?.toLowerCase().includes(lower) ||
        item.location?.toLowerCase().includes(lower)
    );
  }, [searchTerm]);

  const handleToggle = (url: string) => {
    setExpandedId(prev => prev === url ? null : url);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "Courier New, Courier, monospace",
        color: "#000",
        paddingBottom: "60px",
        backgroundColor: "#e5e5e5",
        backgroundImage: `
          radial-gradient(#000 1px, transparent 1px),
          radial-gradient(#000 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 10px 10px",
      }}
    >

      {/* ---------------- HEADER ---------------- */}
      <div style={{
        borderBottom: '4px solid #000',
        backgroundColor: '#fff',
        padding: '50px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          fontWeight: '900',
          marginBottom: '30px',
          textTransform: 'uppercase',
          letterSpacing: '-2px',
          backgroundColor: '#000',
          color: '#fff',
          padding: '10px 20px',
          transform: 'rotate(-1deg)',
          boxShadow: '6px 6px 0px #000'
        }}>
          Directory_V2
        </h1>

        {/* SEARCH BAR */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            maxWidth: '800px',
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px'
          }}
        >
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <input
              type="text"
              placeholder="TYPE TO SEARCH INDEX..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '20px 20px 20px 50px',
                fontSize: '1.1rem',
                border: '3px solid #000',
                boxShadow: '6px 6px 0px rgba(0,0,0,1)',
                outline: 'none',
                fontWeight: 'bold',
                backgroundColor: '#fff',
              }}
            />
            <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }}>
              <Icons.Search />
            </div>
          </div>

          {/* SEARCH BUTTON */}
          <button
            type="submit"
            style={{
              backgroundColor: '#000',
              color: '#fff',
              border: '3px solid #000',
              padding: '0 40px',
              fontSize: '1.1rem',
              fontWeight: '900',
              cursor: 'pointer',
              boxShadow: '6px 6px 0px rgba(0,0,0,.6)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textTransform: 'uppercase',
              minHeight: '60px'
            }}
          >
            Search <Icons.ArrowRight />
          </button>
        </form>

        {/* TAGS */}
        <div style={{ marginTop: '25px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Construction', 'Consultancy', 'Addis Ababa'].map(tag => (
            <NeoTag key={tag} onClick={() => setSearchTerm(tag)} active={searchTerm === tag}>
              {tag}
            </NeoTag>
          ))}
          {searchTerm && <NeoTag onClick={() => setSearchTerm('')}>CLEAR [X]</NeoTag>}
        </div>
      </div>

      {/* ---------------- RESULTS ---------------- */}

      <div ref={resultsRef} style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: '0.8rem'
        }}>
          <span>Query Results: {filteredResults.length}</span>
          <span>Status: Ready</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

          {/* LOOP RESULTS */}
          {filteredResults.map((result, i) => {
            const isExpanded = expandedId === result.url;

            return (
              <div
                key={i}
                style={{
                  border: '3px solid #000',
                  backgroundColor: '#fff',
                  boxShadow: isExpanded ? '8px 8px 0px #000' : '4px 4px 0px #000',
                  transition: 'all .2s ease',
                }}
              >
                {/* HEADER */}
                <div
                  onClick={() => handleToggle(result.url)}
                  style={{
                    padding: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: isExpanded ? '#000' : '#fff',
                    color: isExpanded ? '#fff' : '#000'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#fff',
                      border: '2px solid #000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      <img src={result.logo_url} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 'bold', fontSize: '1rem', margin: 0, textTransform: 'uppercase' }}>
                        {result.company_name}
                      </h3>
                      {!isExpanded && (
                        <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{result.primary_category}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    {isExpanded ? <Icons.Minus /> : <Icons.Plus />}
                  </div>
                </div>

                {/* CONTENT */}
                {isExpanded && (
                  <div style={{ padding: '30px', borderTop: '3px solid #000', backgroundColor: '#fff' }}>

                    {/* META ROW */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '20px',
                      marginBottom: '30px'
                    }}>
                      {/* CATEGORY */}
                      <div style={{ border: '2px solid #000', padding: '15px', flex: 1, minWidth: '200px' }}>
                        <strong style={{
                          display: 'inline-block',
                          background: '#000',
                          color: '#fff',
                          padding: '2px 5px',
                          marginBottom: '10px'
                        }}>CATEGORY</strong>
                        {result.primary_category}
                      </div>

                      {/* CONTACT */}
                      <div style={{ border: '2px solid #000', padding: '15px', flex: 1, minWidth: '200px' }}>
                        <strong style={{
                          display: 'inline-block',
                          background: '#000',
                          color: '#fff',
                          padding: '2px 5px',
                          marginBottom: '10px'
                        }}>CONTACT</strong>
                        <div>TEL: {result.phone_main}</div>
                        <div>LOC: {result.location}</div>
                      </div>

                      {/* CONNECT */}
                      <div style={{ border: '2px solid #000', padding: '15px', flex: 1, minWidth: '200px' }}>
                        <strong style={{
                          display: 'inline-block',
                          background: '#000',
                          color: '#fff',
                          padding: '2px 5px',
                          marginBottom: '10px'
                        }}>CONNECT</strong>

                        {result.website !== 'N/A' ? (
                          <a href={result.website} target="_blank" style={{ color: 'blue', textDecoration: 'underline', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            VISIT WEBSITE <Icons.External />
                          </a>
                        ) : 'No Website'}
                      </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div style={{ marginBottom: '30px' }}>
                      <h4 style={{
                        fontSize: '1.1rem',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        marginBottom: '10px'
                      }}>/// Description</h4>
                      <p style={{ lineHeight: '1.6' }}>
                        {result.description_full}
                      </p>
                    </div>

                    {/* IMAGE GRID */}
                    {result.products_and_services.length > 0 && (
                      <div>
                        <h4 style={{
                          fontSize: '1.1rem',
                          fontWeight: '900',
                          textTransform: 'uppercase',
                          marginBottom: '15px'
                        }}>/// Visual Assets</h4>

                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                          gap: '15px'
                        }}>
                          {result.products_and_services.map((img, idx) => (
                            <div key={idx} style={{ border: '2px solid #000', height: '150px', position: 'relative' }}>
                              <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} />
                              <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#000', color: '#fff', fontSize: '0.7rem', padding: '2px 6px' }}>
                                IMG_0{idx + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default BusinessDirectory;
