import * as THREE from 'three';
import {OrbitControls} from "jsm/controls/OrbitControls.js";
import {EffectComposer} from 'jsm/postprocessing/EffectComposer.js'; // Import the EffectComposer for post-processing
import {RenderPass} from 'jsm/postprocessing/RenderPass.js'; // Import the RenderPass for post-processing
import {UnrealBloomPass} from 'jsm/postprocessing/UnrealBloomPass.js'; // Import the UnrealBloomPass for post-processing
import spline from './spline.js'; // Import the spline function
// Set up the renderer ###

// Create a scene
const scene = new THREE.Scene();

// Set the size of the renderer to the window size
const w = window.innerWidth;
const h = window.innerHeight;
scene.fog = new THREE.FogExp2(0x000000, 0.3 ); // Set the fog color and distance
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


const controls = new OrbitControls(camera, renderer.domElement); // Create orbit controls for the camera
controls.enableDamping = true; // Enable damping (inertia) for the controls
controls.dampingFactor = 0.03; // Damping factor for the controls

const renderPass = new RenderPass(scene, camera); // Create a render pass for post-processing
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 0.85); // Create a bloom pass for post-processing
bloomPass.threshold = 0.002; // Set the bloom threshold
bloomPass.strength = 1.5; // Set the bloom strength
bloomPass.radius = 0; // Set the bloom radius
const composer = new EffectComposer(renderer); // Create an effect composer for post-processing
composer.addPass(renderPass); // Add the render pass to the composer
composer.addPass(bloomPass); // Add the bloom pass to the composer

const points = spline.getPoints(100); // Get points from the spline function
const grometry = new THREE.BufferGeometry().setFromPoints(points); // Create a geometry from the points
const material = new THREE.LineBasicMaterial({ color: 0x0000ff }); // Create a material for the line
const line = new THREE.Line(grometry, material); // Create a line from the geometry and material

const tubeGeo= new THREE.TubeGeometry(spline, 222, 0.65, 16, false); // Create a tube geometry from the spline

// Create edges geometry
const edges = new THREE.EdgesGeometry(tubeGeo, 0.2); // Create edges geometry from the geometry
const lineMat = new THREE.LineBasicMaterial({ color: 0xff0000 }); // Create a material for the edges
const tubeLines = new THREE.LineSegments(edges, lineMat); // Create a line from the edges geometry and material
scene.add(tubeLines); // Add the line mesh to the scene

const numBoxes = 55 // Number of boxes to create
const boxSize = 0.2 // Size of the boxes
const boxGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize); // Create a box geometry
for (let i = 0; i < numBoxes; i++) { // Loop through the number of boxes
    const boxMat= new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        wireframe: true, // Make the material transparent 
    }); // Create a material for the boxes
    const box = new THREE.Mesh(boxGeo, boxMat); // Create a mesh from the geometry and material
    const p = (i / numBoxes + Math.random() * 0.1) % 1; //
    const pos = tubeGeo.parameters.path.getPointAt(p); // Get the position from the spline at the current index
    pos.x += Math.random() * 0.4; // Add a random offset to the x position
    pos.y += Math.random() * 0.4; // Add a random offset to the y position
    pos.z += Math.random() * 0.4; // Add a random offset to the z position
    box.position.copy(pos); // Set the box position to the position from the spline
    const rote = new THREE.Vector3(
        Math.random() * Math.PI, 
        Math.random() * Math.PI, 
        Math.random() * Math.PI
    ); // Create a random rotation vector

    box.rotation.set(rote.x, rote.y, rote.z); // Set the box rotation to the random rotation vector
    const edges = new THREE.EdgesGeometry(boxGeo, 0.3); // Create edges geometry from the geometry
    const color = new THREE.Color().setHSL(1.0 - p , 1 , 0.5); // Create a random color
    const lineMat = new THREE.LineBasicMaterial({ color }); // Create a material for the edges
    const boxLines = new THREE.LineSegments(edges, lineMat); // Create a line from the edges geometry and material
    boxLines.position.copy(pos); // Set the box position to the position from the spline


    scene.add(boxLines); // Add the line mesh to the scene

}

function updateCamera(t) {
    const time = t * 0.5; // Get the current time
    const looptime = 20 * 1000; // Set the loop time
    const p = (time % looptime) / looptime; // Calculate the time factor
    const pos = tubeGeo.parameters.path.getPointAt(p); // Get the position from the spline at the time factor
    const lookAt = tubeGeo.parameters.path.getPointAt(p + 0.01); // Get the lookAt position from the spline at the time factor + 0.01
    camera.position.copy(pos); // Set the camera position to the position from the spline
    camera.lookAt(lookAt); // Make the camera look at the center of the scene
}

const heniLight = new THREE.HemisphereLight(0xffffff, 0x444444 ,1); // Create a hemisphere light
scene.add(heniLight); // Add the light to the scene

function handleResize() {
    const width = window.innerWidth; // Get the window width
    const height = window.innerHeight; // Get the window height
    renderer.setSize(width, height); // Set the renderer size to the window size
    camera.aspect = width / height; // Set the camera aspect ratio to the window aspect ratio
    camera.updateProjectionMatrix(); // Update the camera projection matrix
}

function animate(t = 0) {
    requestAnimationFrame(animate); // Request the next frame //recursive function
    handleResize(); // Handle window resize
    updateCamera(t)
    composer.render(scene, camera); // Render the scene from the camera's perspective
    controls.update(); // Update the controls
}

animate(); // Start the animation loop