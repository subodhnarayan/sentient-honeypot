import React, { useState, useMemo } from 'react';
import { GraphNode, GraphEdge, InteractionLog } from '../../types';
import { GraphCanvas } from './GraphCanvas';
import { NodeDetailPanel } from './NodeDetailPanel';
import { GraphLegend } from './GraphLegend';
// FIX: Import MASTER_INTERACTION_LOGS directly instead of calling generateDerivedData without arguments.
import { MASTER_INTERACTION_LOGS } from '../../data/mockData';

export const ThreatGraph: React.FC = () => {
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

    const { nodes, edges } = useMemo(() => {
        const nodeMap = new Map<string, GraphNode>();
        const edgeSet = new Set<string>();

        MASTER_INTERACTION_LOGS.forEach(log => {
            // Add Attacker IP node
            if (!nodeMap.has(log.attackerIp)) {
                nodeMap.set(log.attackerIp, { id: log.attackerIp, type: 'ip', label: log.attackerIp, data: { country: log.countryCode } });
            }

            // Add Honeypot node
            if (!nodeMap.has(log.honeypotName)) {
                nodeMap.set(log.honeypotName, { id: log.honeypotName, type: 'honeypot', label: log.honeypotName, data: { type: log.honeypotType } });
            }

            // Link IP to Honeypot
            const ipToHoneypotEdgeId = `${log.attackerIp}->${log.honeypotName}`;
            if (!edgeSet.has(ipToHoneypotEdgeId)) {
                edgeSet.add(ipToHoneypotEdgeId);
            }

            // Add TTP nodes and link them to the honeypot
            log.ttps.forEach(ttp => {
                const ttpId = ttp.technique;
                if (!nodeMap.has(ttpId)) {
                    nodeMap.set(ttpId, { id: ttpId, type: 'ttp', label: ttp.technique.split(':')[0].trim(), data: ttp });
                }
                const honeypotToTtpEdgeId = `${log.honeypotName}->${ttpId}`;
                if (!edgeSet.has(honeypotToTtpEdgeId)) {
                    edgeSet.add(honeypotToTtpEdgeId);
                }
            });
        });

        const nodes: GraphNode[] = Array.from(nodeMap.values());
        const edges: GraphEdge[] = Array.from(edgeSet).map(id => {
            const [source, target] = id.split('->');
            return { id, source, target };
        });

        return { nodes, edges };
    }, []);
    
    const handleNodeSelect = (node: GraphNode | null) => {
        setSelectedNode(node);
    };

    return (
        <div className="relative w-full flex-1 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <GraphCanvas 
                nodes={nodes} 
                edges={edges} 
                selectedNodeId={selectedNode?.id || null} 
                onNodeSelect={handleNodeSelect}
            />
             <GraphLegend />
            <NodeDetailPanel 
                node={selectedNode}
                nodes={nodes}
                edges={edges}
                onClose={() => setSelectedNode(null)} 
            />
        </div>
    );
};