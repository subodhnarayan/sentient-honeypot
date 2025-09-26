import React, { useState, useEffect } from 'react';
import { GraphNode, GraphEdge, NodeType } from '../../types';
import { XMarkIcon, SparklesIcon, SpinnerIcon } from '../icons';
import { GoogleGenAI } from '@google/genai';

interface NodeDetailPanelProps {
    node: GraphNode | null;
    nodes: GraphNode[];
    edges: GraphEdge[];
    onClose: () => void;
}

const getNodeColor = (type: NodeType) => {
    switch(type) {
        case 'ip': return 'bg-red-500';
        case 'honeypot': return 'bg-sky-400';
        case 'ttp': return 'bg-yellow-400';
        default: return 'bg-gray-500';
    }
}

export const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({ node, nodes, edges, onClose }) => {
    const [aiSummary, setAiSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        setAiSummary(''); // Reset summary when node changes
    }, [node]);

    const handleAnalyze = async () => {
        if (!node) return;
        setIsLoading(true);
        setAiSummary('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            const connectedEdges = edges.filter(e => e.source === node.id || e.target === node.id);
            const connectedNodeIds = new Set(connectedEdges.flatMap(e => [e.source, e.target]));
            const connectedNodes = nodes.filter(n => connectedNodeIds.has(n.id) && n.id !== node.id);

            let prompt = `As a senior cybersecurity analyst, provide a concise summary of the significance of the following entity in the context of a threat graph.\n\nFocal Entity:\n- Type: ${node.type}\n- ID: ${node.id}\n- Details: ${JSON.stringify(node.data)}\n\n`;

            if (connectedNodes.length > 0) {
                prompt += `It is connected to the following entities:\n`;
                connectedNodes.forEach(cn => {
                    prompt += `- Type: ${cn.type}, ID: ${cn.id}\n`;
                });
            }
            prompt += "\nBased on this, what is the likely activity, role, or threat represented by this entity and its connections?";

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setAiSummary(response.text);

        } catch (error) {
            console.error("AI analysis error:", error);
            setAiSummary("Could not generate AI summary at this time.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className={`absolute top-4 right-4 w-96 max-h-[calc(100%-2rem)] bg-gray-800/80 backdrop-blur-md rounded-lg shadow-2xl border border-gray-700 flex flex-col z-10
            transition-transform duration-300 ease-in-out ${node ? 'translate-x-0' : 'translate-x-[110%]'}`}>
            {node && (
                <>
                    <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
                        <div className="flex items-center">
                            <span className={`w-3 h-3 rounded-full mr-3 ${getNodeColor(node.type)}`}></span>
                            <h3 className="text-lg font-bold text-white capitalize">{node.type} Details</h3>
                        </div>
                        <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </header>
                    <main className="p-4 overflow-y-auto space-y-4">
                        <div>
                            <p className="text-sm text-gray-400">ID</p>
                            <p className="font-mono text-white break-words">{node.id}</p>
                        </div>
                        {node.type === 'ip' && node.data?.country && (
                             <div>
                                <p className="text-sm text-gray-400">Origin</p>
                                <p className="text-white">{node.data.country}</p>
                            </div>
                        )}
                         {node.type === 'honeypot' && node.data?.type && (
                             <div>
                                <p className="text-sm text-gray-400">Honeypot Type</p>
                                <p className="text-white">{node.data.type}</p>
                            </div>
                        )}
                        {node.type === 'ttp' && node.data?.tactic && (
                             <>
                                <div>
                                    <p className="text-sm text-gray-400">Tactic</p>
                                    <p className="text-white">{node.data.tactic}</p>
                                </div>
                                 <div>
                                    <p className="text-sm text-gray-400">Description</p>
                                    <p className="text-white text-sm">{node.data.description}</p>
                                </div>
                            </>
                        )}
                        <div className="border-t border-gray-700 pt-4">
                             <button
                                onClick={handleAnalyze}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center px-4 py-2 text-sm font-semibold bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-wait"
                            >
                                {isLoading ? (
                                    <>
                                        <SpinnerIcon className="w-4 h-4 mr-2" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-4 h-4 mr-2" />
                                        Analyze with AI
                                    </>
                                )}
                            </button>
                            {aiSummary && (
                                <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
                                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{aiSummary}</p>
                                </div>
                            )}
                        </div>
                    </main>
                </>
            )}
        </div>
    );
};
