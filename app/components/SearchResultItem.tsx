import React from 'react';
import { SearchResult } from '../types/types';
import { Icons } from '../utils/icons';
import Image from "next/image";

interface SearchResultItemProps {
  result: SearchResult;
  isExpanded: boolean;
  onToggle: (url: string) => void;
}


const truncateDescription = (description: string, maxLength: number = 150): string => {
  if (!description) return '';
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + '...';
};


const getShortDescription = (description: string): string => {
  if (!description) return 'No description available.';
  

  const firstSentence = description.split('.')[0];
  if (firstSentence.length <= 200) {
    return firstSentence + '.';
  }
  

  return truncateDescription(description, 150);
};

export const SearchResultItem: React.FC<SearchResultItemProps> = ({ result, isExpanded, onToggle }) => {
  const shortDescription = getShortDescription(result.description_full || '');
  
  return (
    <div
      style={{
        border: '3px solid #000',
        backgroundColor: '#fff',
        boxShadow: isExpanded ? '8px 8px 0px #000' : '4px 4px 0px #000',
        transition: 'all 0.2s ease',
        transform: isExpanded ? 'translate(-2px, -2px)' : 'none'
      }}
    >

      <div
        onClick={() => onToggle(result.url)}
        style={{
          padding: '15px 20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: isExpanded ? '#000' : '#fff',
          color: isExpanded ? '#fff' : '#000',
          transition: 'background-color 0.2s'
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
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <Image
              src={result.logo_url || "/placeholder.png"}
              alt="icon"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.png";
              }}
              width={100}
              height={100}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3 style={{ 
              fontWeight: 'bold', 
              fontSize: '1rem', 
              margin: 0, 
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {result.company_name}
            </h3>
            {!isExpanded && (
              <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '4px' }}>
                <div>{result.primary_category}</div>
                <div style={{ 
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '400px'
                }}>
                  {shortDescription}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginLeft: '10px', flexShrink: 0 }}>
          {isExpanded ? <Icons.Minus /> : <Icons.Plus />}
        </div>
      </div>


      {isExpanded && (
        <div style={{
          padding: '20px',
          borderTop: '3px solid #000',
          backgroundColor: '#fff',
          animation: 'slideDown 0.2s ease-out'
        }}>


          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px', 
            marginBottom: '20px',
            fontSize: '0.9rem' 
          }}>
            <div style={{ border: '2px solid #000', padding: '12px' }}>
              <strong style={{ 
                display: 'block', 
                background: '#000', 
                color: '#fff', 
                padding: '2px 8px', 
                width: 'fit-content', 
                marginBottom: '8px',
                fontSize: '0.8rem'
              }}>
                CATEGORY
              </strong>
              {result.primary_category || 'N/A'}
            </div>
            <div style={{ border: '2px solid #000', padding: '12px' }}>
              <strong style={{ 
                display: 'block', 
                background: '#000', 
                color: '#fff', 
                padding: '2px 8px', 
                width: 'fit-content', 
                marginBottom: '8px',
                fontSize: '0.8rem'
              }}>
                CONTACT
              </strong>
              <div style={{ marginBottom: '4px' }}>📞 {result.phone_main || 'N/A'}</div>
              <div>📍 {result.location || 'N/A'}</div>
            </div>
            <div style={{ border: '2px solid #000', padding: '12px' }}>
              <strong style={{ 
                display: 'block', 
                background: '#000', 
                color: '#fff', 
                padding: '2px 8px', 
                width: 'fit-content', 
                marginBottom: '8px',
                fontSize: '0.8rem'
              }}>
                CONNECT
              </strong>
              {result.website && result.website !== 'N/A' ? (
                <a 
                  href={result.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    color: 'blue', 
                    textDecoration: 'underline', 
                    fontWeight: 'bold', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '5px',
                    fontSize: '0.9rem'
                  }}
                >
                  VISIT WEBSITE <Icons.External />
                </a>
              ) : 'No Website'}
            </div>
          </div>


          {result.description_full && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ 
                fontSize: '1rem', 
                fontWeight: '900', 
                textTransform: 'uppercase', 
                marginBottom: '8px' 
              }}>
              Description
              </h4>
              <p style={{ 
                lineHeight: '1.5', 
                fontSize: '0.9rem', 
                fontFamily: 'Georgia, serif',
                maxHeight: '200px',
                overflowY: 'auto',
                paddingRight: '10px'
              }}>
                {result.description_full}
              </p>
            </div>
          )}


          {result.products_and_services && result.products_and_services.length > 0 && (
            <div>
              <h4 style={{ 
                fontSize: '1rem', 
                fontWeight: '900', 
                textTransform: 'uppercase', 
                marginBottom: '12px' 
              }}>
                Visual Assets ({result.products_and_services.length})
              </h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                gap: '10px',
                maxHeight: '300px',
                overflowY: 'auto',
                padding: '5px'
              }}>
                {result.products_and_services.slice(0, 6).map((img, idx) => ( 
                  <div key={idx} style={{ 
                    border: '2px solid #000', 
                    height: '120px', 
                    position: 'relative',
                    backgroundColor: '#f5f5f5'
                  }}>
                    <img 
                      src={img} 
                      alt={`Asset ${idx + 1}`} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        filter: 'grayscale(100%)' 
                      }} 
                      loading="lazy" 
                    />
                    <div style={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      right: 0, 
                      background: '#000', 
                      color: '#fff', 
                      fontSize: '0.6rem', 
                      padding: '1px 4px' 
                    }}>
                      IMG_{idx + 1}
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
};