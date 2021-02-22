import * as THREE from "../dist/three/build/three.module.js";
import { FBXLoader } from "../dist/three/examples/jsm/loaders/FBXLoader.js";
const loader = new FBXLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xEEEEEE);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);
const clock = new THREE.Clock();
scene.add(new THREE.AmbientLight(0x404040, 5));
const colors = new Uint8Array(200);
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
    gradientMap: gradientMap,
    morphTargets: true
});
let player;
let mixer;
loader.load('../dist/res/SK_Character_Dummy_Male_01.fbx', (group) => {
    group.traverse(function (object) {
        if (object instanceof THREE.Mesh) {
            // @ts-ignore
            //object.material = material;
            object.receiveShadow = false;
        }
        object.receiveShadow = false;
    });
    group.rotation.y += Math.PI;
    group.rotation.x += Math.PI / 2;
    group.receiveShadow = false;
    loader.load('../dist/res/walking.fbx', function (object) {
        group.animations = object.animations;
        mixer = new THREE.AnimationMixer(group);
        const action = mixer.clipAction(group.animations[0]);
        action.play();
    });
    scene.add(group);
    player = group;
}, (error) => {
    console.log(error);
});
const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
mesh.rotation.z = -Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);
const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
grid.material.opacity = 0.2;
grid.rotation.x = -Math.PI / 2;
grid.material.transparent = true;
scene.add(grid);
camera.position.z = 500;
camera.position.y = -300;
camera.rotation.x = Math.PI / 4;
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
const speed = 2;
const animate = function () {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer && keys[0]) {
        mixer.update(delta);
        console.log("guhy");
    }
    if (keys[0]) {
        camera.position.y += speed;
        player.position.y += speed;
    }
    if (keys[1]) {
        camera.position.x += speed;
        player.position.x += speed;
    }
    if (keys[2]) {
        camera.position.y -= speed;
        player.position.y -= speed;
    }
    if (keys[3]) {
        camera.position.x -= speed;
        player.position.x -= speed;
    }
    renderer.render(scene, camera);
};
animate();
//# sourceMappingURL=index.js.map