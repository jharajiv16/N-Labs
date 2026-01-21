import "./agency.css";
import * as THREE from "three";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);




// --- Three.js Setup ---
const canvas = document.querySelector("canvas#webgl");
const scene = new THREE.Scene();
scene.background = new THREE.Color("#0b0d15"); // Dark void background


// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.z = 5;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- Objects ---
// 1. Floating Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 15;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(posArray, 3),
);

const material = new THREE.PointsMaterial({
    size: 0.02,
    color: "#1e90ff",
    transparent: true,
    opacity: 0.8,
});
const particlesMesh = new THREE.Points(particlesGeometry, material);
scene.add(particlesMesh);

// 2. Hero Object (Wireframe Icosahedron)
const heroGeometry = new THREE.IcosahedronGeometry(2, 0);
const heroMaterial = new THREE.MeshBasicMaterial({ color: 0x1e90ff, wireframe: true, transparent: true, opacity: 0.3 });
const heroMesh = new THREE.Mesh(heroGeometry, heroMaterial);
heroMesh.position.x = 2; // Offset to right
scene.add(heroMesh);

// --- Mouse Interaction ---
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// --- Scroll Animation ---
let scrollY = window.scrollY;
let currentScroll = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});


// --- Animation Loop ---
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // 1. Particles Movement
    particlesMesh.rotation.y = elapsedTime * 0.05;
    
    // Smooth Mouse Parallax for Particles
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);
    particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);

    // 2. Hero Object Animation
    heroMesh.rotation.x += 0.005;
    heroMesh.rotation.y += 0.005;

    // Scroll Effect (GSAP-like smoothing logic manually or use GSAP directly)
    // Here we use linear interpolation for smoothness
    currentScroll += (scrollY - currentScroll) * 0.05; 
    
    // Rotate/Move based on scroll
    const scrollPercent = currentScroll / document.body.scrollHeight;
    camera.position.y = - currentScroll * 0.005; 
    
    // Move hero object based on scroll
    heroMesh.position.z = Math.sin(elapsedTime) * 0.5; // Breathing effect
    heroMesh.rotation.z = currentScroll * 0.002;

    // Example: Move hero away when scrolling down
    if(currentScroll > 100) {
        gsap.to(heroMesh.position, { duration: 1, x: 4, opacity: 0});
        gsap.to(heroMaterial, { duration: 1, opacity: 0});
    } else {
         gsap.to(heroMesh.position, { duration: 1, x: 2 });
         gsap.to(heroMaterial, { duration: 1, opacity: 0.3});
    }


    // Render
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};

tick();

// --- Card Animations ---
gsap.utils.toArray(".service-card").forEach((card, i) => {
  gsap.fromTo(
    card,
    {
      opacity: 0,
      y: 50,
      rotationX: -10,
    },
    {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        end: "top 60%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.8,
      delay: i * 0.2, // Stagger effect
      ease: "power3.out",
    }
  );
});


// --- Resize Handling ---
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

});
