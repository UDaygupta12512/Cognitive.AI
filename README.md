# Cognitive.AI — Interactive Showcase

A production-ready web application showcasing an ICICI Bank UI replica, an automated YouTube Video Chapter detection tool, and a dynamic In-Video Lead Capture overlay. 

Built entirely with pure HTML, CSS, and Vanilla JavaScript. **Zero external frameworks, UI kits, or backend languages.**

## 🚀 Features

### 1. ICICI "Exclusive Privileges" 3D Replica
A highly responsive, pixel-perfect replication of ICICI Bank's campaign layout.
- Uses advanced pure Vanilla JS math and CSS `transform: rotateY() translateZ()` to create a stunning, infinite 3D rotating carousel.
- Smooth glassmorphic hover effects and performant CSS Grid layouts for mobile responsiveness.

### 2. Automated Video Chapters (Pure Vanilla JS Algorithm)
A powerful tool that analyzes YouTube videos and automatically generates logical chapter breakpoints.
- **Frontend Only:** Seamless integration with the native YouTube IFrame API to grab the video duration directly from the client.
- **Algorithm:** Uses a pure JavaScript heuristic algorithm to logically pace and chunk the video into dynamically generated chapters, completely avoiding browser CORS restrictions without needing a proxy backend.

### 3. Smart In-Video Lead Capture Form
A high-converting video marketing feature.
- Accurately tracks **true playback time** rather than simple wall-clock time. If a user buffers or pauses, the timer accurately waits.
- At exactly 6.0 seconds of active playback, the video freezes and an elegant glassmorphic form overlays the screen to capture leads.
- Fully simulated database using secure local storage.

## 🛠️ Technology Stack
- **Frontend:** Pure HTML5, CSS3 Variables (Custom Properties), Vanilla ES6 JavaScript.
- **Strict Compliance:** No dependencies, no backend, no React/Vue/Tailwind.

## 💻 How to Run Locally

Because this project is entirely static Vanilla JS, you can run it instantly without installing any dependencies!

1. **Clone the repository:**
   ```bash
   git clone https://github.com/UDaygupta12512/Cognitive.AI.git
   cd Cognitive.AI
   ```

2. **Run the App:**
   Simply double-click the `index.html` file to open it in your web browser. 
   *(Alternatively, use any basic live-server like VSCode's Live Server extension).*

## ☁️ Deployment Guide

This repository is purely static, meaning it can be hosted globally for free in seconds.

1. Push your code to GitHub.
2. Link the repository to **GitHub Pages**, **Vercel**, or **Netlify**.
3. It will instantly deploy globally with zero configuration required.

---
*Developed as an advanced technical showcase for pure Vanilla UI/UX engineering and client-side architecture.*
