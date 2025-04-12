import * as THREE from 'three';
import {OrbitControls} from "jsm/controls/OrbitControls.js";
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
const far = 10; // Far clipping plane
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;
// Create a scene
const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement); // Create orbit controls for the camera
controls.enableDamping = true; // Enable damping (inertia) for the controls
controls.dampingFactor = 0.03; // Damping factor for the controls


const geo = new THREE.IcosahedronGeometry(1.0, 2); // Geometry of the object
const mat = new THREE.MeshStandardMaterial({ 
    color: 0xffffff, // Color of the object
    flatShading: true, // Flat shading (show the ploygons)
}); // Material of the object
const mesh = new THREE.Mesh(geo, mat); // Create the object
scene.add(mesh); // Add the object to the scene

const wireMat = new THREE.MeshBasicMaterial({
    color: 0x000000, // Color of the wireframe
    wireframe: true, // Wireframe mode
}); // Material for the wireframe

const wireMesh = new THREE.Mesh(geo, wireMat); // Create the wireframe object
wireMesh.scale.setScalar(1.001); // Scale the wireframe slightly larger than the object
mesh.add(wireMesh); // Add the wireframe object to the scene

const heniLight = new THREE.HemisphereLight(0x0099ff, 0xaa5500 ,1); // Create a hemisphere light
scene.add(heniLight); // Add the light to the scene

const outWireMat = new THREE.MeshBasicMaterial({
    color: 0xffffff, // Color of the outer wireframe
    wireframe: true, // Wireframe mode
}); // Material for the outer wireframe
const outWireMesh = new THREE.Mesh(geo, outWireMat); // Create the outer wireframe object
scene.add(outWireMesh); // Add the outer wireframe object to the scene
outWireMesh.scale.setScalar(1.2); // Scale the outer wireframe to be larger than the object

function animate(t = 0) {
    requestAnimationFrame(animate); // Request the next frame //recursive function
    mesh.scale.setScalar(1 + Math.sin(t * 0.001) * 0.1); // Scale the object based on time
    mesh.rotation.y = t * 0.0001; // Rotate the object around the y-axis
    mesh.rotation.x = t * 0.0001; 
    outWireMesh.rotation.y = t * -0.0001; // Rotate the outer wireframe around the y-axis
    outWireMesh.rotation.x = t * -0.0001
    renderer.render(scene, camera); // Render the scene from the camera's perspective
}

animate(); // Start the animation loop