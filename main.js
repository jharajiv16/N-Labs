/**
 * main.js - 3D Background & Animation Entry Point
 * 
 * Restored to "Initial" Creative Design:
 * - Floating Particles
 * - Wireframe Icosahedron (Blue)
 * - Wireframe Torus Knot (Orange)
 * 
 * Uses Direct CDN Imports for reliability.
 */
console.log('Main.js Initial Design Loaded');

// Direct CDN Imports
import * as THREE from "https://esm.sh/three@0.160.0";
import gsap from "https://esm.sh/gsap@3.12.5";
import { ScrollTrigger } from "https://esm.sh/gsap@3.12.5/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- Setup ---
const canvas = document.querySelector("canvas#webgl");
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- Objects ---

// 1. Floating Particles System
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 800; 
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 18; 
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const material = new THREE.PointsMaterial({
    size: 0.025,
    color: "#4facfe", // Bright Blue
    transparent: true,
    opacity: 0.9,
});

const particlesMesh = new THREE.Points(particlesGeometry, material);
scene.add(particlesMesh);

// 2. Hero Object (Wireframe Icosahedron)
const heroGeometry = new THREE.IcosahedronGeometry(2, 0);
const heroMaterial = new THREE.MeshBasicMaterial({ color: 0x1e90ff, wireframe: true, transparent: true, opacity: 0.3 });
const heroMesh = new THREE.Mesh(heroGeometry, heroMaterial);
heroMesh.position.x = 2;
scene.add(heroMesh);

// 3. Torus Knot (Techy Ring)
const torusGeometry = new THREE.TorusKnotGeometry(0.8, 0.1, 100, 16);
const torusMaterial = new THREE.MeshBasicMaterial({ color: 0xff7a00, wireframe: true, transparent: true, opacity: 0.4 });
const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
torusMesh.position.set(-2, 1, -1); 
scene.add(torusMesh);


// --- Interaction ---
let mouseX = 0;
let mouseY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
});

// --- Scroll ---
let scrollY = window.scrollY;
let currentScroll = 0;
window.addEventListener('scroll', () => { scrollY = window.scrollY; });


// --- Animation Loop ---
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // 1. Particles Movement
    particlesMesh.rotation.y = elapsedTime * 0.05;
    
    // Smooth Mouse Parallax
    particlesMesh.rotation.x += 0.05 * (mouseY - particlesMesh.rotation.x);
    particlesMesh.rotation.y += 0.05 * (mouseX - particlesMesh.rotation.y);

    // 2. Object Animation
    heroMesh.rotation.x += 0.005;
    heroMesh.rotation.y += 0.005;
    
    torusMesh.rotation.x -= 0.01;
    torusMesh.rotation.y -= 0.01;

    // Scroll Effect
    currentScroll += (scrollY - currentScroll) * 0.05; 
    
    camera.position.y = - currentScroll * 0.005; 
    
    // Breathing/Floating
    heroMesh.position.z = Math.sin(elapsedTime) * 0.5; 
    heroMesh.rotation.z = currentScroll * 0.002;
    torusMesh.position.y = 1 + Math.cos(elapsedTime * 0.8) * 0.3; 

    // Fade out logic
    if(currentScroll > 100) {
        gsap.to(heroMesh.position, { duration: 1, x: 5, opacity: 0});
        gsap.to(heroMesh.material, { duration: 1, opacity: 0});
        
        gsap.to(torusMesh.position, { duration: 1, x: -5, opacity: 0});
        gsap.to(torusMesh.material, { duration: 1, opacity: 0});
    } else {
         gsap.to(heroMesh.position, { duration: 1, x: 2 });
         gsap.to(heroMesh.material, { duration: 1, opacity: 0.3});

         gsap.to(torusMesh.position, { duration: 1, x: -2 });
         gsap.to(torusMesh.material, { duration: 1, opacity: 0.4});
    }

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();

// Resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
