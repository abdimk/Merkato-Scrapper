import React from 'react';
import { Icons } from '../utils/icons';
import { NeoTag } from './NeoTag';
import '../globals.css';

interface DirectorySearchFormProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    handleSearchSubmit: (e: React.FormEvent) => void;
    isLoading?: boolean;
    responseLimit: number;
    setResponseLimit: (limit: number) => void;
    searchTime?: number;
    totalRequests?: number;
}

export const DirectorySearchForm: React.FC<DirectorySearchFormProps> = ({
    searchTerm,
    setSearchTerm,
    handleSearchSubmit,
    isLoading = false,
    responseLimit,
    setResponseLimit,
    searchTime,
    totalRequests
}) => (
    <div
        style={{
            borderBottom: '4px solid #000',
            backgroundColor: '#fff',
            padding: '50px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
        }}
    >

        {totalRequests !== undefined && (
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: '#000',
                color: '#fff',
                padding: '8px 12px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                border: '2px solid #000',
                boxShadow: '3px 3px 0px rgba(0,0,0,0.3)',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
            }}>
                <span style={{
                    backgroundColor: '#00ff00',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                }} />
                Total: {totalRequests.toLocaleString()}
            </div>
        )}

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
            position: 'relative'
        }}>
            Merkato_V2
            {totalRequests !== undefined && (
                <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    backgroundColor: '#ff0000',
                    color: '#fff',
                    fontSize: '0.6rem',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    border: '1px solid #000',
                    fontFamily: 'monospace'
                }}>
                    LIVE
                </span>
            )}
        </h1>

        <form
            onSubmit={handleSearchSubmit}
            style={{
                maxWidth: '800px',
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '15px',
                alignItems: 'center'
            }}
        >
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
                <input
                    type="text"
                    placeholder="TYPE TO SEARCH INDEX..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        padding: '20px 20px 20px 50px',
                        fontSize: '1.1rem',
                        border: '3px solid #000',
                        boxShadow: '6px 6px 0px rgba(0,0,0,1)',
                        outline: 'none',
                        fontWeight: 'bold',
                        fontFamily: 'inherit',
                        backgroundColor: '#fff',
                        height: '100%',
                        opacity: isLoading ? 0.7 : 1
                    }}
                />
                <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }}>
                    <Icons.Search />
                </div>
            </div>


            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flex: '0 0 auto'
            }}>
                <label style={{
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap'
                }}>
                    LIMIT:
                </label>
                <select
                    value={responseLimit}
                    onChange={(e) => setResponseLimit(Number(e.target.value))}
                    disabled={isLoading}
                    style={{
                        padding: '10px',
                        border: '2px solid #000',
                        backgroundColor: '#fff',
                        fontWeight: 'bold',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        boxShadow: '3px 3px 0px rgba(0,0,0,0.5)',
                        minWidth: '70px'
                    }}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                style={{
                    flex: '0 0 auto',
                    backgroundColor: '#000',
                    color: '#fff',
                    border: '3px solid #000',
                    padding: '0 25px',
                    fontSize: '1.1rem',
                    fontWeight: '900',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    boxShadow: '6px 6px 0px rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textTransform: 'uppercase',
                    minHeight: '60px',
                    opacity: isLoading ? 0.7 : 1,
                    position: 'relative'
                }}
                onMouseEnter={(e) => {
                    if (!isLoading) {
                        e.currentTarget.style.transform = 'translate(2px, 2px)';
                        e.currentTarget.style.boxShadow = '4px 4px 0px rgba(0,0,0,0.5)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isLoading) {
                        e.currentTarget.style.transform = 'translate(0, 0)';
                        e.currentTarget.style.boxShadow = '6px 6px 0px rgba(0,0,0,0.5)';
                    }
                }}
            >
                {isLoading ? (
                    <>
                        <div style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid transparent',
                            borderTop: '2px solid #fff',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />
                        Searching...
                    </>
                ) : (
                    <>
                        Search
                        <Icons.ArrowRight />
                    </>
                )}


                {searchTime && searchTime > 0 && !isLoading && (
                    <span style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        backgroundColor: '#00ff00',
                        color: '#000',
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        border: '1px solid #000',
                        fontFamily: 'monospace'
                    }}>
                        {searchTime}ms
                    </span>
                )}
            </button>
        </form>

        <div style={{ marginTop: '25px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Insurance', 'Banks', 'Importers', 'Exporters', 'Pharmacies' ,'Finance','Mining'].map(tag => (
                <NeoTag
                    key={tag}
                    onClick={() => !isLoading && setSearchTerm(tag)}
                    active={searchTerm === tag}
                >
                    {tag}
                </NeoTag>
            ))}
            {searchTerm && (
                <NeoTag onClick={() => !isLoading && setSearchTerm('')}>
                    CLEAR [X]
                </NeoTag>
            )}
        </div>
    </div>
);


