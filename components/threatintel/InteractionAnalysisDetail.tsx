import React, { useState, useEffect } from 'react';
import { InteractionLog } from '../../types';
import { SessionReplay } from './SessionReplay';
import { GoogleGenAI } from '@google/genai';
import { SpinnerIcon } from '../icons';

interface InteractionAnalysisDetailProps {
  interaction: InteractionLog;
}

const DetailCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-4 border-b border-gray-700">
            <h4 className="font-bold text-white">{title}</h4>
        </div>
        <div className="p-4 text-sm">
            {children}
        </div>
    </div>
);

const IntelligenceChip: React.FC<{ item: string }> = ({ item }) => (
    <span className="inline-block bg-gray-700 text-gray-300 font-mono text-xs px-2 py-1 rounded-md">{item}</span>
);

export const InteractionAnalysisDetail: React.FC<InteractionAnalysisDetailProps> = ({ interaction }) => {
    const [summary, setSummary] = useState<string | null>(interaction.aiSummary || null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const generateSummary = async () => {
            if (interaction.aiSummary) {
                setSummary(interaction.aiSummary);
                return;
            }
            
            setIsLoading(true);
            setSummary(null);

            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                
                const sessionLog = interaction.steps.map(step => `${step.type === 'input' ? 'Attacker' : 'Honeypot'}: ${step.content}`).join('\n');
                
                const prompt = `As a senior cybersecurity analyst, analyze the following session log from a honeypot and provide a concise summary of the attacker's objectives, actions, and likely intent. Be brief and to the point.\n\n--- SESSION LOG ---\n${sessionLog}\n--- END LOG ---`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                
                setSummary(response.text);

            } catch (error) {
                console.error("Error generating summary:", error);
                setSummary("Could not generate AI summary at this time.");
            } finally {
                setIsLoading(false);
            }
        };

        generateSummary();
    }, [interaction]);

    return (
        <div className="h-full overflow-y-auto pr-2 space-y-6">
            <DetailCard title="AI-Powered Summary">
                {isLoading && (
                    <div className="flex items-center text-gray-400">
                        <SpinnerIcon className="w-5 h-5 mr-3" />
                        <span>Generating summary with Gemini...</span>
                    </div>
                )}
                {summary && (
                    <p className="text-gray-300 leading-relaxed">{summary}</p>
                )}
            </DetailCard>

            <DetailCard title="MITRE ATT&CK TTPs">
                <ul className="space-y-3">
                    {interaction.ttps.map((ttp, index) => (
                        <li key={index} className="border-l-2 border-cyan-500 pl-3">
                            <p className="font-semibold text-cyan-400">{ttp.tactic}</p>
                            <p className="font-medium text-white">{ttp.technique}</p>
                            <p className="text-gray-400 mt-1">{ttp.description}</p>
                        </li>
                    ))}
                </ul>
            </DetailCard>
            
            <DetailCard title="Extracted Intelligence">
                <div className="space-y-4">
                    {interaction.extractedIntelligence.usernames.length > 0 && (
                        <div>
                            <p className="text-gray-400 mb-2 font-semibold">Usernames Attempted:</p>
                            <div className="flex flex-wrap gap-2">
                                {interaction.extractedIntelligence.usernames.map(u => <IntelligenceChip key={u} item={u} />)}
                            </div>
                        </div>
                    )}
                    {interaction.extractedIntelligence.passwords.length > 0 && (
                        <div>
                            <p className="text-gray-400 mb-2 font-semibold">Passwords Attempted:</p>
                            <div className="flex flex-wrap gap-2">
                                {interaction.extractedIntelligence.passwords.map(p => <IntelligenceChip key={p} item={p} />)}
                            </div>
                        </div>
                    )}
                     {interaction.extractedIntelligence.commands.length > 0 && (
                        <div>
                            <p className="text-gray-400 mb-2 font-semibold">Commands Executed:</p>
                            <div className="flex flex-wrap gap-2">
                                {interaction.extractedIntelligence.commands.map(c => <IntelligenceChip key={c} item={c} />)}
                            </div>
                        </div>
                    )}
                </div>
            </DetailCard>

             <DetailCard title="Session Replay">
                <SessionReplay steps={interaction.steps} />
            </DetailCard>
        </div>
    );
};