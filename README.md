# NirmanLabs - 3D Agency Website

![NirmanLabs Hero](https://via.placeholder.com/800x400?text=NirmanLabs+Preview)

**NirmanLabs** is a high-performance, immersive 3D agency website designed to showcase digital solutions with a modern, tech-forward aesthetic. Built with **Three.js** and **GSAP**, it features a fully interactive 3D background, smooth scroll animations, and a responsive glassmorphism UI.

## 🚀 Features

- **Immersive 3D Background**: A dynamic starfield and floating hero object powered by Three.js.
- **Interactive Elements**: Mouse parallax effects and 3D tilts on service cards.
- **Smooth Animations**: High-performance scroll-based revealing and staggering using GSAP ScrollTrigger.
- **Responsive Design**: Fully adaptive layout with a mobile-first approach and custom hamburger menu.
- **Modern UI**: Glassmorphism effects, custom SVGs, and refined typography.
- **Rich Content**: Featured work showcase, trusted partner logos, and client testimonials.
- **Documented Codebase**: Detailed comments in all major files (`main.js`, `agency.css`, etc.) for easier maintenance and contribution.
- **Regular Updates**: Continuous improvements and new features added regularly.

## 🛠️ Tech Stack

- **Core**: HTML5, CSS3, JavaScript (ES6+)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **3D Rendering**: [Three.js](https://threejs.org/)
- **Animations**: [GSAP](https://greensock.com/gsap/) (TweenMax, ScrollTrigger)
- **Styling**: Vanilla CSS (Variables, Flexbox, Grid)

## 📦 Installation & Setup

1.  **Clone the repository**

    ```bash
    git clone https://github.com/jharajiv16/N-Labs.git
    cd N-Labs
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```
    The site will be available at `http://localhost:5173`.

## 🏗️ Building for Production

To create an optimized production build:

```bash
npm run build
```

This will generate the static files in the `dist` directory, ready for deployment (Vercel, Netlify, etc.).

## 📂 Project Structure

```
├── index.html        # Main entry point
├── main.js           # Three.js scene & GSAP animations
├── script.js         # UI interactions (Menu, Form, Scroll)
├── agency.css        # Global styling & Responsive rules
├── package.json      # Dependencies & Scripts
└── public/           # Static assets
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

_Built with ❤️ by NirmanLabs Team_
