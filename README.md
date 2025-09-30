# 🛡️ Sentient Honeypot Mission Control

A web application to **deploy, monitor, and learn** from AI-powered serverless honeypots.  
It provides a **comprehensive dashboard** for honeypot management, threat intelligence analysis, and an **AI Co-Pilot** for advanced security operations.

![Sentient Honeypot Mission Control Demo](https://storage.googleapis.com/aistudio-v2-a6b10.appspot.com/dev/vsAI_coderev/e8659178-5772-4091-a67b-2228b3eb6c35/sentient-honeypot-mission-control-demo.gif)

---

## ✨ Key Features

- **Unified Dashboard**: High-level overview with key metrics, global attack map, and recent activity feed.  
- **Deception Deployment**: Deploy AI-powered honeypots (e.g., Vulnerable Web Server, Unsecured SSH, Exposed Database).  
- **AI-Powered Interaction Analysis**: MITRE ATT&CK mapping, AI summaries, extracted intel, and session replay.  
- **Visual Threat Graph**: Interactive force-directed graph of attackers, honeypots, and TTPs.  
- **Natural Language Threat Hunting**: Query logs with plain English (e.g., *"Show me all SSH sessions from Iran that used wget"*).  
- **Alerts Triage**: Manage, filter, and pivot to detailed attack analysis.  
- **Live Threat Feed**: Real-time timeline of alerts, threat sightings, and TTP detections.  
- **AI Analyst Co-Pilot**: Gemini-powered chatbot for investigation assistance.  
- **RBAC (Role-Based Access Control)**: Pre-configured roles for Admin, Engineer, Analyst, and User.  
- **Interaction Simulation**: Sandboxed terminal to interact with honeypots or simulate attacks.  

---

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS  
- **AI & Logic**: Google Gemini API (`@google/genai`)  
- **Database**: Firebase Firestore (real-time data persistence)  
- **UI/UX**: Modern, responsive Security Operations Center feel  

---

## 🚀 Getting Started

This project is a **self-contained web application** that runs entirely in the browser.

### Prerequisites
- **Firebase Project**  
  - Create a project in [Firebase Console](https://console.firebase.google.com/)  
  - Create a Firestore Database (test mode for setup)  
  - Create collections: `honeypots` and `interaction_logs`

- **Google Gemini API Key**  
  - Get from [Google AI Studio](https://aistudio.google.com/)  

### Configuration
- **Firebase Config**:  
  - Open `firebase.ts`  
  - Replace `firebaseConfig` with your project’s keys from Firebase settings.  

- **API Key**:  
  - Set your Gemini API key in `.env.local`  

    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

---

## 🕹️ Usage

### Roles & Logins
Default credentials use `password` as the password.  

- `admin` → Administrator (full access)  
- `engineer` → Security Engineer (deploy honeypots, manage alerts)  
- `analyst` → Security Analyst (read-only threat analysis & dashboards)  
- `user` → Standard User (simulate attacks by connecting to honeypots)  

### Example Workflow
1. Log in as **engineer** → Deploy an "Unsecured SSH Port" honeypot.  
2. Log in as **user** → Connect to the honeypot (`root/toor`) and interact with the AI terminal.  
3. Log in as **analyst** → Check **Interaction Analysis**, view AI summaries, replay sessions, and triage alerts.  

---
💻 Run Locally

Prerequisites: Node.js installed

# 1. Install dependencies
npm install

# 2. Set Gemini API key
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# 3. Run the app
npm run dev
