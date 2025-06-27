// Update the imports
import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.157.0/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x111111, 0.03);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.webgl'),
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

// Profile Image
const textureLoader = new THREE.TextureLoader();
const profileTexture = textureLoader.load(
    '/image.jpg', // Changed path to absolute
    function(texture) {
        console.log('Image loaded successfully');
        profileMesh.material.needsUpdate = true; // Force material update
    },
    function(progress) {
        console.log('Loading image...', progress);
    },
    function(error) {
        console.error('Error loading the image:', error);
    }
);

// Create circular profile image
const profileGeometry = new THREE.CircleGeometry(5, 64);
const profileMaterial = new THREE.MeshStandardMaterial({
    map: profileTexture,
    side: THREE.DoubleSide,
    metalness: 0.3,
    roughness: 0.6,
    transparent: true,
    opacity: 1
});
const profileMesh = new THREE.Mesh(profileGeometry, profileMaterial);
profileMesh.castShadow = true;
profileMesh.position.set(0, 0, 0);
scene.add(profileMesh);

// Create floating spheres
const spheres = [];
for(let i = 0; i < 50; i++) {
    const sphereGeometry = new THREE.SphereGeometry(0.2, 24, 24);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(`hsl(${Math.random() * 360}, 50%, 50%)`),
        metalness: 0.8,
        roughness: 0.2
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
    );
    sphere.castShadow = true;
    spheres.push(sphere);
    scene.add(sphere);
}

// Lights
const mainLight = new THREE.DirectionalLight(0xffffff, 1);
mainLight.position.set(10, 10, 10);
mainLight.castShadow = true;
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0x4477ff, 0.5);
fillLight.position.set(-10, -10, -10);
scene.add(fillLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Camera position
camera.position.z = 20; // Moved camera back a bit

// In the profile mesh section
profileMesh.position.set(0, 0, 0);
profileMesh.rotation.x = Math.PI * 0.5; // Rotate to face camera
scene.add(profileMesh);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 50;
controls.minDistance = 10;

// Animation
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
});

function animate() {
    requestAnimationFrame(animate);

    // Profile animation
    profileMesh.rotation.y += 0.003;
    profileMesh.rotation.z = Math.sin(Date.now() * 0.001) * 0.1;

    // Sphere animations
    spheres.forEach((sphere, i) => {
        sphere.position.y += Math.sin((Date.now() + i * 100) * 0.001) * 0.02;
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
    });

    // Camera movement based on mouse
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();