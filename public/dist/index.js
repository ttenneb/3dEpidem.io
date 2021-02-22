import * as THREE from "../dist/three/build/three.module.js";
import { FBXLoader } from "../dist/three/examples/jsm/loaders/FBXLoader.js";
const loader = new FBXLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xEEEEEE);
document.body.appendChild(renderer.domElement);
let particleLight = new THREE.Mesh(new THREE.SphereGeometry(4, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
particleLight.position.x = 5;
particleLight.position.y = 5;
particleLight.position.z = 500;
scene.add(particleLight);
const pointLight = new THREE.PointLight(0xffffff, 2, 800);
particleLight.add(pointLight);
const colors = new Uint8Array(0 + 2);
for (let c = 0; c <= colors.length; c++) {
    colors[c] = (c / colors.length) * 256;
}
const gradientMap = new THREE.DataTexture(colors, colors.length, 1, THREE.LuminanceFormat);
gradientMap.minFilter = THREE.NearestFilter;
gradientMap.magFilter = THREE.NearestFilter;
gradientMap.generateMipmaps = false;
const diffuseColor = new THREE.Color().setHSL(.5, 0.5, .5 * 0.5 + 0.1).multiplyScalar(1 - .5 * 0.2);
const material = new THREE.MeshToonMaterial({
    color: diffuseColor,
    gradientMap: gradientMap
});
loader.load('../dist/res/SK_Character_Dummy_Male_01.fbx', (group) => {
    group.traverse(function (object) {
        if (object instanceof THREE.Mesh) {
            // @ts-ignore
            object.material = material;
        }
    });
    group.rotation.y += Math.PI / 2;
    group.rotation.z += Math.PI / 2;
    scene.add(group);
}, (error) => {
    console.log(error);
});
const geometry = new THREE.BoxGeometry(10, 10, 1);
const cube = new THREE.Mesh(geometry, material);
//scene.add( cube );
camera.position.z = 500;
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