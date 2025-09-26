// FIX: Import React to use React.ReactNode type.
import React from 'react';

export enum View {
  Dashboard = 'DASHBOARD',
  Honeypots = 'HONEYPOTS',
  ThreatIntel = 'THREAT_INTEL',
  Alerts = 'ALERTS',
  Settings = 'SETTINGS',
  ThreatHunting = 'THREAT_HUNTING',
  ThreatGraph = 'THREAT_GRAPH',
  AuditLog = 'AUDIT_LOG',
  ThreatFeed = 'THREAT_FEED',
}

export enum UserRole {
  Administrator = 'Administrator',
  SecurityEngineer = 'Security Engineer',
  SecurityAnalyst = 'Security Analyst',
}

export interface User {
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface AuditLogEntry {
  id: string;
  user: string;
  role: UserRole;
  action: string;
  timestamp: string; // ISO 8601 string
  details: string;
}

export interface Metric {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease';
}

export enum AlertSeverity {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
}

export interface Activity {
  id: string;
  type: string;
  honeypot: string;
  attackerIp: string;
  severity: AlertSeverity;
  timestamp: string;
  countryCode: string;
}

export interface Attack {
  id: string;
  lat: number;
  lng: number;
  severity: AlertSeverity;
}

export interface HoneypotTemplate {
  id: string;
  name: string;
  description: string;
  iconId: string;
  tags: string[];
  defaultSystemInstruction: string;
  isCustom?: boolean;
}

export interface ActiveHoneypot {
    id: string;
    name: string;
    type: string;
    status: 'online' | 'offline' | 'warning';
    ipAddress: string;
    interactions: number;
    createdAt: string;
    systemInstruction?: string;
}

// Types for Threat Intelligence Center
export interface InteractionStep {
    type: 'input' | 'output';
    content: string;
    timestamp: string;
}

export interface TTP {
    tactic: string; // e.g., "TA0007: Discovery"
    technique: string; // e.g., "T1082: System Information Discovery"
    description: string;
}

export interface InteractionLog {
    id: string;
    honeypotName: string;
    honeypotType: string;
    attackerIp: string;
    countryCode: string;
    location: {
        lat: number;
        lng: number;
    };
    interactionType: 'SSH Session' | 'Web Login Attempt' | 'Database Query' | 'S3 Bucket Scan';
    severity: AlertSeverity;
    timestamp: string; // ISO 8601 string
    duration: number; // in seconds
    aiSummary?: string;
    ttps: TTP[];
    extractedIntelligence: {
        usernames: string[];
        passwords: string[];
        commands: string[];
        files: string[];
    };
    steps: InteractionStep[];
    isEmergingThreat?: boolean;
}

// Types for Alerting System
export enum AlertStatus {
    New = 'New',
    InProgress = 'In Progress',
    Resolved = 'Resolved',
}

export interface Alert {
    id: string;
    title: string;
    severity: AlertSeverity;
    status: AlertStatus;
    honeypotName: string;
    attackerIp: string;
    timestamp: string; // ISO 8601 string
    interactionId: string; // To link to the detailed interaction log
}

// Types for AI Co-Pilot
export enum MessageAuthor {
    User = 'USER',
    AI = 'AI',
}

export interface ChatMessage {
    id: string;
    author: MessageAuthor;
    content: string;
    examplePrompts?: string[];
}

// Types for Settings
export interface UserSettings {
    name: string;
    email: string;
    avatarUrl?: string;
}

export interface NotificationPreferences {
    channels: {
        email: {
            enabled: boolean;
            address: string;
        };
        sms: {
            enabled: boolean;
            phoneNumber: string;
        };
    };
    severityThreshold: AlertSeverity;
}

export interface Integration {
    id: 'slack' | 'splunk' | 'webhook';
    name: string;
    description: string;
    icon: React.ReactNode;
    connected: boolean;
    apiKey?: string;
    webhookUrl?: string;
}

// Types for Threat Graph
export type NodeType = 'ip' | 'honeypot' | 'ttp';

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  data: any;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

// Types for Threat Feed
export type ThreatEventType = 'alert' | 'emerging_threat' | 'ttp_sighting';

export interface ThreatEvent {
  id: string;
  type: ThreatEventType;
  timestamp: string; // ISO 8601
  severity: AlertSeverity;
  title: string;
  summary: string;
  relatedId?: string; // e.g., interactionId for alerts
}