import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GraphNode, GraphEdge, NodeType } from '../../types';

interface GraphCanvasProps {
    nodes: GraphNode[];
    edges: GraphEdge[];
    selectedNodeId: string | null;
    onNodeSelect: (node: GraphNode | null) => void;
}

const NODE_COLORS: Record<NodeType, string> = {
    ip: '#ef4444', // red-500
    honeypot: '#38bdf8', // sky-400
    ttp: '#facc15', // yellow-400
};
const NODE_RADIUS = 20;

export const GraphCanvas: React.FC<GraphCanvasProps> = ({ nodes, edges, selectedNodeId, onNodeSelect }) => {
    const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
    
    // Refs for simulation data that changes every frame, preventing re-running the effect
    const velocities = useRef<Record<string, { x: number; y: number }>>({});
    const positionsRef = useRef(positions);
    useEffect(() => {
        positionsRef.current = positions;
    }, [positions]);

    const dragInfo = useRef<{ id: string | null; offsetX: number; offsetY: number }>({ id: null, offsetX: 0, offsetY: 0 });
    const panInfo = useRef<{ isPanning: boolean; startX: number; startY: number }>({ isPanning: false, startX: 0, startY: 0 });
    const [viewBox, setViewBox] = useState({ x: -500, y: -300, width: 1000, height: 600 });
    const svgRef = useRef<SVGSVGElement>(null);

    // Initialize positions and velocities
    useEffect(() => {
        setPositions(currentPositions => {
            const newPositions: Record<string, { x: number; y: number }> = {};
            nodes.forEach(node => {
                if (currentPositions[node.id]) {
                     newPositions[node.id] = currentPositions[node.id];
                } else {
                    newPositions[node.id] = {
                        x: (Math.random() - 0.5) * 1000,
                        y: (Math.random() - 0.5) * 600,
                    };
                }
                if (!velocities.current[node.id]) {
                    velocities.current[node.id] = { x: 0, y: 0 };
                }
            });
            return newPositions;
        });
    }, [nodes]);

    // Physics simulation loop
    useEffect(() => {
        let animationFrameId: number;

        const simulationLoop = () => {
            const currentPositions = positionsRef.current;
            // Use a deep copy to ensure we don't mutate state being used by React's render
            const newPositions = JSON.parse(JSON.stringify(currentPositions));
            const forces: Record<string, { x: number; y: number }> = {};

            if (Object.keys(newPositions).length === 0) {
                animationFrameId = requestAnimationFrame(simulationLoop);
                return;
            }

            nodes.forEach(node => {
                forces[node.id] = { x: 0, y: 0 };
            });

            // --- STABLE PHYSICS ENGINE ---
            // 1. Repulsion force (nodes push each other away)
            const repulsionStrength = 20000;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const nodeA = nodes[i];
                    const nodeB = nodes[j];
                    const posA = newPositions[nodeA.id];
                    const posB = newPositions[nodeB.id];
                    if (!posA || !posB) continue;

                    const dx = posA.x - posB.x;
                    const dy = posA.y - posB.y;
                    let distanceSq = dx * dx + dy * dy;
                    if (distanceSq < 100) distanceSq = 100; // Min distance to prevent explosion

                    const force = repulsionStrength / distanceSq;
                    const distance = Math.sqrt(distanceSq);

                    forces[nodeA.id].x += (dx / distance) * force;
                    forces[nodeA.id].y += (dy / distance) * force;
                    forces[nodeB.id].x -= (dx / distance) * force;
                    forces[nodeB.id].y -= (dy / distance) * force;
                }
            }

            // 2. Attraction force (edges pull nodes together like springs)
            const springConstant = 0.01;
            const idealLength = 200;
            edges.forEach(edge => {
                const sourcePos = newPositions[edge.source];
                const targetPos = newPositions[edge.target];
                if (!sourcePos || !targetPos) return;

                const dx = targetPos.x - sourcePos.x;
                const dy = targetPos.y - sourcePos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance === 0) return;

                const displacement = distance - idealLength;
                const force = springConstant * displacement;
                
                forces[edge.source].x += (dx / distance) * force;
                forces[edge.source].y += (dy / distance) * force;
                forces[edge.target].x -= (dx / distance) * force;
                forces[edge.target].y -= (dy / distance) * force;
            });
            
            // 3. Centering force (pulls everything gently to the middle)
            nodes.forEach(node => {
                const pos = newPositions[node.id];
                if (!pos) return;
                const force = 0.005;
                forces[node.id].x -= pos.x * force;
                forces[node.id].y -= pos.y * force;
            });

            // 4. Update velocities and positions with damping and velocity cap
            const damping = 0.9;
            const maxVelocity = 30;
            nodes.forEach(node => {
                if (dragInfo.current.id === node.id) return;
                
                const vel = velocities.current[node.id];
                const pos = newPositions[node.id];
                if (!vel || !pos) return;

                vel.x = (vel.x + forces[node.id].x) * damping;
                vel.y = (vel.y + forces[node.id].y) * damping;
                
                const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
                if (speed > maxVelocity) {
                    vel.x = (vel.x / speed) * maxVelocity;
                    vel.y = (vel.y / speed) * maxVelocity;
                }
                
                pos.x += vel.x;
                pos.y += vel.y;
            });
            // --- END PHYSICS ENGINE ---

            setPositions(newPositions);
            animationFrameId = requestAnimationFrame(simulationLoop);
        };

        simulationLoop();
        return () => cancelAnimationFrame(animationFrameId);
    }, [nodes, edges]); // Removed 'positions' from dependency array for performance

    const getPointFromEvent = (e: React.MouseEvent) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const pt = svgRef.current.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const CTM = svgRef.current.getScreenCTM();
        if(CTM) {
            return pt.matrixTransform(CTM.inverse());
        }
        return pt;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        const target = e.target as SVGElement;
        const nodeId = target.closest('[data-id]')?.getAttribute('data-id');
        const point = getPointFromEvent(e);

        if (nodeId && positions[nodeId]) {
            e.stopPropagation();
            dragInfo.current = { id: nodeId, offsetX: positions[nodeId].x - point.x, offsetY: positions[nodeId].y - point.y };
        } else {
             panInfo.current = { isPanning: true, startX: e.clientX, startY: e.clientY };
        }
    };
    
    const handleMouseMove = (e: React.MouseEvent) => {
         const point = getPointFromEvent(e);
        if (dragInfo.current.id) {
            const { id, offsetX, offsetY } = dragInfo.current;
            setPositions(prev => ({
                ...prev,
                [id]: { x: point.x + offsetX, y: point.y + offsetY }
            }));
             // Manually update ref during drag to keep physics running on other nodes
            const currentVelocities = velocities.current;
            if (currentVelocities[id]) {
                currentVelocities[id] = { x: 0, y: 0 };
            }
        } else if (panInfo.current.isPanning) {
            const dx = (e.clientX - panInfo.current.startX) * (viewBox.width / (svgRef.current?.clientWidth || 1));
            const dy = (e.clientY - panInfo.current.startY) * (viewBox.height / (svgRef.current?.clientHeight || 1));
            setViewBox(prev => ({ ...prev, x: prev.x - dx, y: prev.y - dy }));
            panInfo.current.startX = e.clientX;
            panInfo.current.startY = e.clientY;
        }
    };

    const handleMouseUp = () => {
        if (dragInfo.current.id && velocities.current[dragInfo.current.id]) {
            velocities.current[dragInfo.current.id] = { x: 0, y: 0 };
        }
        dragInfo.current = { id: null, offsetX: 0, offsetY: 0 };
        panInfo.current.isPanning = false;
    };
    
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const scaleFactor = 1.1;
        const { clientX, clientY, deltaY } = e;
        const point = getPointFromEvent({ clientX, clientY } as React.MouseEvent);

        const newWidth = deltaY > 0 ? viewBox.width * scaleFactor : viewBox.width / scaleFactor;
        const newHeight = deltaY > 0 ? viewBox.height * scaleFactor : viewBox.height / scaleFactor;
        
        const dx = (point.x - viewBox.x) * (newWidth / viewBox.width - 1);
        const dy = (point.y - viewBox.y) * (newHeight / viewBox.height - 1);

        setViewBox({
            x: viewBox.x - dx,
            y: viewBox.y - dy,
            width: newWidth,
            height: newHeight,
        });
    };
    
    const handleNodeClick = (e: React.MouseEvent, node: GraphNode) => {
        e.stopPropagation();
        onNodeSelect(node);
    };

    const handleCanvasClick = () => {
        onNodeSelect(null);
    }
    
    const relatedNodeIds = useMemo(() => {
        if (!selectedNodeId) return new Set();
        const related = new Set<string>([selectedNodeId]);
        edges.forEach(edge => {
            if (edge.source === selectedNodeId) related.add(edge.target);
            if (edge.target === selectedNodeId) related.add(edge.source);
        });
        return related;
    }, [selectedNodeId, edges]);


    return (
        <svg
            ref={svgRef}
            className="absolute top-0 left-0 w-full h-full cursor-grab active:cursor-grabbing"
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onClick={handleCanvasClick}
        >
            <defs>
                <marker id="arrow" viewBox="0 -5 10 10" refX="10" refY="0" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M0,-5L10,0L0,5" fill="#4b5563" />
                </marker>
            </defs>
            <g>
                {edges.map(edge => {
                    const sourcePos = positions[edge.source];
                    const targetPos = positions[edge.target];
                    if (!sourcePos || !targetPos) return null;

                    const isRelated = selectedNodeId && (edge.source === selectedNodeId || edge.target === selectedNodeId);
                    const opacity = selectedNodeId ? (isRelated ? 1 : 0.1) : 0.6;
                    
                    return (
                        <line
                            key={edge.id}
                            x1={sourcePos.x} y1={sourcePos.y}
                            x2={targetPos.x} y2={targetPos.y}
                            stroke="#4b5563" // gray-600
                            strokeWidth="2"
                            opacity={opacity}
                            className="transition-opacity"
                        />
                    );
                })}
            </g>
            <g>
                {nodes.map(node => {
                    const pos = positions[node.id];
                    if (!pos) return null;
                    
                    const isSelected = node.id === selectedNodeId;
                    const isRelated = relatedNodeIds.has(node.id);
                    const opacity = selectedNodeId ? (isRelated ? 1 : 0.2) : 1;
                    
                    return (
                        <g 
                            key={node.id} 
                            transform={`translate(${pos.x}, ${pos.y})`}
                            data-id={node.id}
                            className="cursor-pointer"
                            onClick={(e) => handleNodeClick(e, node)}
                        >
                            <circle
                                r={NODE_RADIUS}
                                fill={NODE_COLORS[node.type]}
                                stroke={isSelected ? '#38bdf8' : '#1f2937'} // sky-400 or gray-800
                                strokeWidth={isSelected ? 4 : 2}
                                opacity={opacity}
                                className="transition-all"
                            />
                            <text 
                                textAnchor="middle" 
                                y={NODE_RADIUS + 15}
                                fill="white" 
                                fontSize="12"
                                className="pointer-events-none select-none"
                                opacity={opacity}
                            >
                                {node.label}
                            </text>
                        </g>
                    );
                })}
            </g>
        </svg>
    );
};
