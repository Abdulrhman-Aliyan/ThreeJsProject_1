import * as THREE from 'three';
import {OrbitControls} from "jsm/controls/OrbitControls.js";
import getStarfield from './src/getStarfield.js'; // Import the starfield function
import { getFresnelMat } from './src/getFresnelMat.js'; // Import the fresnel function
// Set up the renderer ###

// Set the size of the renderer to the window size
const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
// Camera setup
const fov = 75; // Field of view
const aspect = w / h; // Aspect ratio
const near = 0.1; // Near clipping plane
const far = 1000; // Far clipping plane
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 5; // Set the camera position
// Create a scene
const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement); // Create orbit controls for the camera
controls.enableDamping = true; // Enable damping (inertia) for the controls
controls.dampingFactor = 0.03; // Damping factor for the controls


const earthGroup = new THREE.Group(); // Create a group for the earth
earthGroup.rotation.z = -23.4 * Math.PI / 180; // Rotate the group to match the tilt of the earth
scene.add(earthGroup); // Add the group to the scene
const detail = 12
const loader = new THREE.TextureLoader(); // Create a texture loader
const geometry = new THREE.IcosahedronGeometry(1, detail); // Geometry of the object
const material = new THREE.MeshStandardMaterial({ 
    map: loader.load('assets/img/4k_earth_daymap.jpg'), // Texture of the object
    // flatShading: true, 
});


const earthMesh = new THREE.Mesh(geometry, material); // Create the object
earthGroup.add(earthMesh); // Add the object to the scene

const lightMat = new THREE.MeshBasicMaterial({
    map: loader.load('assets/img/4k_earth_nightmap.jpg'), // Texture of the object
    blending: THREE.AdditiveBlending, // Blending mode
})
const lightMesh = new THREE.Mesh(geometry, lightMat); // Create the object
earthGroup.add(lightMesh); // Add the object to the scene


const cloudMat = new THREE.MeshStandardMaterial({
    map: loader.load('assets/img/4k_earth_clouds.jpg'), // Texture of the object
    blending: THREE.AdditiveBlending, // Blending mode
    transparent: true, // Make the material transparent
    opacity: 0.8, // Opacity of the material
});
const cloudMesh = new THREE.Mesh(geometry, cloudMat); // Create the object
cloudMesh.scale.setScalar(1.003); // Scale the object to be slightly larger than the earth
earthGroup.add(cloudMesh); // Add the object to the scene

const fresnelMat = getFresnelMat(); // Create a fresnel material
const glowMesh = new THREE.Mesh(geometry, fresnelMat); // Create the object
glowMesh.scale.setScalar(1.004); // Scale the object to be slightly larger than the earth
earthGroup.add(glowMesh); // Add the object to the scene

const stars = getStarfield(); // Create a starfield with 1000 stars
scene.add(stars); // Add the starfield to the scene

const sunLight = new THREE.DirectionalLight(0xffffff); // Create a hemisphere light
sunLight.position.set(-2, 0.5, 1.5); // Set the position of the light
scene.add(sunLight); // Add the light to the scene

function animate(t = 0) {
    requestAnimationFrame(animate); // Request the next frame //recursive function
    earthMesh.rotation.y = t * 0.0002; // Rotate the object around the y-axis
    lightMesh.rotation.y = t * 0.0002;
    cloudMesh.rotation.y = t * 0.00025; // slightly faster than Earth
    glowMesh.rotation.y = t * 0.0002; // Rotate the object around the y-axis
    renderer.render(scene, camera); // Render the scene from the camera's perspective
}

animate(); // Start the animation loop