import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { InteractionLog } from '../../types';
import { ThreatHuntingSearchBar } from './ThreatHuntingSearchBar';
import { ThreatHuntingResults } from './ThreatHuntingResults';
import { InitialState } from './InitialState';
// FIX: Import MASTER_INTERACTION_LOGS directly instead of calling generateDerivedData without arguments.
import { MASTER_INTERACTION_LOGS } from '../../data/mockData';
import { InformationCircleIcon } from '../icons';

interface SearchFilter {
    field: 'attackerIp' | 'command' | 'countryCode' | 'honeypotName' | 'interactionType';
    operator: 'contains' | 'equals';
    value: string;
}

interface StructuredQuery {
    filters: SearchFilter[];
}

interface ThreatHuntingProps {
    initialQuery?: string | null;
}

export const ThreatHunting: React.FC<ThreatHuntingProps> = ({ initialQuery }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<InteractionLog[] | null>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeProgrammaticQuery, setActiveProgrammaticQuery] = useState<string | null>(null);

    const executeEmergingThreatsSearch = async () => {
        setIsLoading(true);
        setResults(null);
        setSummary(null);
        setError(null);

        try {
            const emergingThreats = MASTER_INTERACTION_LOGS.filter(log => log.isEmergingThreat);
            
            if (emergingThreats.length === 0) {
                setSummary("No emerging threats identified at this time.");
                setResults([]);
                return;
            }

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const summaryPrompt = `As a senior cybersecurity analyst, you are viewing a curated list of "Emerging Threats". Briefly summarize why these incidents, as a group, are significant and what they might indicate about the evolving threat landscape. Do not describe each one individually, but provide a high-level strategic overview.\n\n--- THREATS ---\n${JSON.stringify(emergingThreats, null, 2)}\n--- END THREATS ---`;
            
            const summaryResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: summaryPrompt,
            });

            setSummary(summaryResponse.text);
            setResults(emergingThreats);

        } catch (err) {
            console.error("Emerging threats search error:", err);
            setError("Sorry, I couldn't process the emerging threats request. The AI might be having trouble.");
        } finally {
            setIsLoading(false);
        }
    };

     useEffect(() => {
        if (initialQuery === 'show_emerging_threats') {
            setActiveProgrammaticQuery('emerging_threats');
            executeEmergingThreatsSearch();
        }
    }, [initialQuery]);


    const handleSearch = async (query: string) => {
        setActiveProgrammaticQuery(null); // User search overrides programmatic search
        setIsLoading(true);
        setResults(null);
        setSummary(null);
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            // 1. First Gemini Call: Translate NLQ to Structured JSON
            const queryGenPrompt = `You are a cybersecurity data query expert. Parse the following natural language query into a structured JSON filter for searching security interaction logs.
            Valid fields are: 'attackerIp', 'command', 'countryCode', 'honeypotName', 'interactionType'.
            Valid operators are: 'equals', 'contains'.
            If a country is mentioned, use its two-letter ISO code (e.g., Iran -> IR, China -> CN).
            
            Query: "${query}"`;

            const querySchema = {
                type: Type.OBJECT,
                properties: {
                    filters: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                field: { type: Type.STRING },
                                operator: { type: Type.STRING },
                                value: { type: Type.STRING }
                            },
                            required: ['field', 'operator', 'value']
                        }
                    }
                },
                required: ['filters']
            };

            const queryResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: queryGenPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: querySchema,
                }
            });

            const structuredQuery: StructuredQuery = JSON.parse(queryResponse.text);

            // 2. Simulate Search: Filter mock data based on the structured query
            const foundInteractions = MASTER_INTERACTION_LOGS.filter(log => {
                return structuredQuery.filters.every(filter => {
                    const logValue = filter.field === 'command'
                        ? log.extractedIntelligence.commands.join(' ')
                        : log[filter.field];
                    
                    if (typeof logValue !== 'string') return false;
                    
                    const filterValueLower = filter.value.toLowerCase();
                    const logValueLower = logValue.toLowerCase();

                    if (filter.operator === 'equals') {
                        return logValueLower === filterValueLower;
                    }
                    if (filter.operator === 'contains') {
                        return logValueLower.includes(filterValueLower);
                    }
                    return false;
                });
            });

            if (foundInteractions.length === 0) {
                setSummary("No interactions found matching your query.");
                setResults([]);
                return;
            }

            // 3. Second Gemini Call: Summarize the findings
            const summaryPrompt = `As a senior cybersecurity analyst, concisely summarize the key findings from the following security logs that were found based on the user's query: "${query}". \n\n--- LOGS ---\n${JSON.stringify(foundInteractions.slice(0, 5), null, 2)}\n--- END LOGS ---`;
            
            const summaryResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: summaryPrompt,
            });

            setSummary(summaryResponse.text);
            setResults(foundInteractions);

        } catch (err) {
            console.error("Threat hunting error:", err);
            setError("Sorry, I couldn't process that request. The AI might be having trouble. Please try rephrasing your query.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <ThreatHuntingSearchBar onSearch={handleSearch} isLoading={isLoading} />
            
             {activeProgrammaticQuery === 'emerging_threats' && !isLoading && (
                <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-400 flex items-start">
                    <InformationCircleIcon className="w-5 h-5 mr-3 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>
                        Showing curated <span className="font-bold text-white">Emerging Threats</span> from the dashboard. A new search will clear this view.
                    </span>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {error}
                </div>
            )}
            
            {results === null && !isLoading && !error && <InitialState onPromptClick={handleSearch} />}
            
            {(results !== null || isLoading) && (
                <ThreatHuntingResults 
                    results={results} 
                    summary={summary} 
                    isLoading={isLoading} 
                />
            )}
        </div>
    );
};