import * as THREE from 'three';

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

const geo = new THREE.IcosahedronGeometry(1.0, 2); // Geometry of the object
const mat = new THREE.MeshStandardMaterial({ 
    color: 0xffffff, // Color of the object
    flatShading: true, // Flat shading (show the ploygons)
}); // Material of the object
const mesh = new THREE.Mesh(geo, mat); // Create the object
scene.add(mesh); // Add the object to the scene

const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffffff, // Color of the wireframe
    wireframe: true, // Wireframe mode
}); // Material for the wireframe

const wireMesh = new THREE.Mesh(geo, wireMat); // Create the wireframe object
mesh.add(wireMesh); // Add the wireframe object to the scene

const heniLight = new THREE.HemisphereLight(0xffffff, 0x000000 ,1); // Create a hemisphere light
scene.add(heniLight); // Add the light to the scene

function animate(t = 0) {
    requestAnimationFrame(animate); // Request the next frame //recursive function
    mesh.rotation.y = t * 0.0001; // Rotate the object around the y-axis
    renderer.render(scene, camera); // Render the scene from the camera's perspective
}

animate(); // Start the animation loop