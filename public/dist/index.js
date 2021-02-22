import * as THREE from "../web_modules/three.js";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xEEEEEE);
document.body.appendChild(renderer.domElement);
const geometry = new THREE.BoxGeometry(10, 10, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 4;
camera.rotation.x = Math.PI / 6;
let keys = [false, false, false, false];
function KeyDown(event) {
    if (event.code == "KeyW") {
        keys[0] = true;
    }
    if (event.code == "KeyD") {
        keys[1] = true;
    }
    if (event.code == "KeyS") {
        keys[2] = true;
    }
    if (event.code == "KeyA") {
        keys[3] = true;
    }
}
function KeyUp(event) {
    if (event.code == "KeyW") {
        keys[0] = false;
    }
    if (event.code == "KeyD") {
        keys[1] = false;
    }
    if (event.code == "KeyS") {
        keys[2] = false;
    }
    if (event.code == "KeyA") {
        keys[3] = false;
    }
}
document.addEventListener('keydown', KeyDown);
document.addEventListener('keyup', KeyUp);
const animate = function () {
    requestAnimationFrame(animate);
    if (keys[0]) {
        camera.position.y += .5;
    }
    if (keys[1]) {
        camera.position.x += .5;
    }
    if (keys[2]) {
        camera.position.y -= .5;
    }
    if (keys[3]) {
        camera.position.x -= .5;
    }
    renderer.render(scene, camera);
};
animate();
//# sourceMappingURL=index.js.map