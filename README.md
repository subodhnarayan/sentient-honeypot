Sentient Honeypot Mission Control
A web application to deploy, monitor, and learn from AI-powered serverless honeypots. It provides a comprehensive dashboard for a high-level overview, honeypot management, threat intelligence analysis, and an integrated AI Co-Pilot for advanced security operations.
![alt text](https://storage.googleapis.com/aistudio-v2-a6b10.appspot.com/dev/vsAI_coderev/e8659178-5772-4091-a67b-2228b3eb6c35/sentient-honeypot-mission-control-demo.gif)
✨ Key Features
Unified Dashboard: Get a high-level overview of your honeypot network with key metrics, a real-time global attack map, and a recent activity feed.
Deception Deployment: Easily deploy new AI-powered honeypots from a library of pre-configured and customizable templates (e.g., Vulnerable Web Server, Unsecured SSH Port, Exposed Database).
AI-Powered Interaction Analysis: Deep dive into attacker Tactics, Techniques, and Procedures (TTPs). Each interaction log features an AI-generated summary, MITRE ATT&CK mapping, extracted intelligence, and a full session replay.
Visual Threat Graph: Explore complex relationships between attacker IPs, targeted honeypots, and observed TTPs in an interactive force-directed graph.
Natural Language Threat Hunting: Ask complex questions in plain English (e.g., "Show me all SSH sessions from Iran that used 'wget'") to hunt for hidden threats across all interaction logs.
Alerts Triage: A dedicated view to manage, filter, and triage security alerts. Update alert statuses and pivot directly to the detailed interaction analysis.
Live Threat Feed: A real-time, timeline-style stream of security events, including new alerts, emerging threat sightings, and TTP detections.
AI Analyst Co-Pilot: An integrated chatbot powered by Gemini, allowing you to ask questions, summarize attacks, and get assistance with security analysis.
Role-Based Access Control (RBAC): Pre-configured roles for Administrator, Security Engineer, Security Analyst, and a special Standard User role for generating attack data.
Interaction Simulation: A secure, sandboxed terminal to directly interact with your honeypots' AI personas or to simulate attacks for testing and demonstration.
🛠️ Technology Stack
Frontend: React, TypeScript, Tailwind CSS
AI & Logic: Google Gemini API (@google/genai)
Database: Firebase Firestore (for real-time data persistence)
UI/UX: Designed for a modern, responsive "Security Operations Center" feel.
🚀 Getting Started
This project is a self-contained web application that runs entirely in the browser.
Prerequisites
Firebase Project: You need a Firebase project to store and retrieve data in real-time.
Go to the Firebase Console and create a new project.
In your project, create a Firestore Database. Start in test mode for easy setup.
Create two collections: honeypots and interaction_logs.
Google Gemini API Key: You need an API key to power the AI features.
Get your API key from Google AI Studio.
Configuration
Firebase Config:
Open firebase.ts.
Replace the placeholder firebaseConfig object with your own project's configuration keys, which you can find in your Firebase project settings.
API Key:
This application is designed to fetch the Google Gemini API key from an environment variable process.env.API_KEY. You must ensure this variable is available in the environment where you host the application.
🕹️ Usage
The application supports multiple user roles with different permissions. To log in, use one of the following usernames with the password password.
admin: (Administrator) Full access to all features, including settings and audit logs.
engineer: (Security Engineer) Can view data, manage alerts, and deploy honeypots.
analyst: (Security Analyst) Read-only access to dashboards, alerts, and threat intelligence data for investigation.
user: (Standard User) A restricted view showing only a list of available honeypots. This user can "connect" to them, which simulates an attack and generates interaction logs for the other roles to analyze. This is a great way to populate the system with data.
Workflow Example
Log in as an engineer.
Navigate to Deploy Deception and deploy a new "Unsecured SSH Port" honeypot.
Log out and log back in as a user.
You will see the new SSH honeypot. Click "Connect", enter the correct credentials (root/toor), and interact with the AI via the terminal simulator.
Log out and log back in as an analyst.
Go to Interaction Analysis. You will see the new interaction log from your simulation. Click on it to see the AI-generated summary and session replay. An alert will also have been generated in the Alerts view.
📁 Project Structure
code
Code
.
├── public/
├── components/
│   ├── aichat/         # AI Co-Pilot components
│   ├── alerts/         # Alert Triage view
│   ├── auditlog/       # Audit Log view
│   ├── auth/           # Login component
│   ├── dashboard/      # Dashboard widgets
│   ├── honeypots/      # Honeypot management & deployment
│   ├── icons/          # SVG icon library
│   ├── layout/         # Main layout (Sidebar, Header)
│   ├── settings/       # Settings view
│   ├── threatfeed/     # Live Threat Feed view
│   ├── threatgraph/    # Visual Threat Graph view
│   ├── threathunting/  # AI Threat Hunting view
│   ├── threatintel/    # Interaction Analysis view
│   └── user/           # View for the "Standard User" role
├── data/               # Mock data generators
├── App.tsx             # Main application component, state management, and routing
├── firebase.ts         # Firebase configuration and initialization
├── index.html          # Main HTML entry point
├── index.tsx           # React app root
└── types.ts            # All TypeScript type definitions


## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
