# Cognitive.AI — Interactive Showcase

A production-ready web application showcasing an ICICI Bank UI replica, an automated YouTube Video Chapter detection tool, and a dynamic In-Video Lead Capture overlay. 

Built entirely with pure HTML, CSS, and Vanilla JavaScript. **Zero external frameworks or UI kits.**

## 🚀 Features

### 1. ICICI "Exclusive Privileges" 3D Replica
A highly responsive, pixel-perfect replication of ICICI Bank's campaign layout.
- Uses advanced pure Vanilla JS math and CSS `transform: rotateY() translateZ()` to create a stunning, infinite 3D rotating carousel.
- Smooth glassmorphic hover effects and performant CSS Grid layouts for mobile responsiveness.

### 2. Automated Video Chapters (AI-Ready Backend)
A powerful tool that analyzes YouTube videos and automatically detects logical chapter breakpoints.
- **Frontend:** Seamless integration with the native YouTube IFrame API to dynamically scrub video timelines.
- **Backend (Python):** Utilizes `youtube-transcript-api` to securely bypass browser CORS restrictions and extract video transcripts. It runs a heuristic algorithm to parse text segments and generate production-ready chapter timestamps.

### 3. Smart In-Video Lead Capture Form
A high-converting video marketing feature.
- Accurately tracks **true playback time** rather than simple wall-clock time. If a user buffers or pauses, the timer accurately waits.
- At exactly 6.0 seconds of active playback, the video freezes and an elegant glassmorphic form overlays the screen to capture leads.
- Fully simulated database using secure local storage.

## 🛠️ Technology Stack
- **Frontend:** Pure HTML5, CSS3 Variables (Custom Properties), Vanilla ES6 JavaScript.
- **Backend:** Python 3 (built on the native `http.server` library).
- **Dependencies:** `youtube-transcript-api` (Server-side only).

## 💻 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/UDaygupta12512/Cognitive.AI.git
   cd Cognitive.AI
   ```

2. **Install the Python dependency:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the server:**
   ```bash
   python server.py
   ```

4. **View the App:**
   Open `http://localhost:8080` in your web browser.

## ☁️ Deployment Guide

This repository is ready to be deployed to any service that supports Python environments (e.g., Render, Heroku, AWS).

1. Push your code to GitHub.
2. Create a new Web Service on Render.
3. Set the Build Command to: `pip install -r requirements.txt`
4. Set the Start Command to: `python server.py`
5. *The `server.py` file is already configured to automatically detect and bind to the dynamic `PORT` environment variable provided by the host.*

---
*Developed as an advanced technical showcase for UI/UX engineering and backend proxy architecture.*
