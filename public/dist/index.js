import * as THREE from "../dist/three/build/three.module.js";
import { FBXLoader } from "../dist/three/examples/jsm/loaders/FBXLoader.js";
const loader = new FBXLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xEEEEEE);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);
const clock = new THREE.Clock();
//lighting
//scene.add( new THREE.AmbientLight( 0x404040  ,5) );
const light = new THREE.PointLight(0x404040, 20, 1000);
light.position.set(50, 50, 500);
scene.add(light);
const colors = new Uint8Array(200);
//colors for toon material
for (let c = 0; c <= colors.length; c++) {
    colors[c] = (c / colors.length) * 256;
}
const gradientMap = new THREE.DataTexture(colors, colors.length, 1, THREE.LuminanceFormat);
gradientMap.minFilter = THREE.NearestFilter;
gradientMap.magFilter = THREE.NearestFilter;
gradientMap.generateMipmaps = false;
const diffuseColor = new THREE.Color().setHSL(.5, 0.5, .5 * 0.5 + 0.1).multiplyScalar(1 - .5 * 0.2);
//toon material
const material = new THREE.MeshToonMaterial({
    color: diffuseColor,
    gradientMap: gradientMap,
    skinning: true
});
//player module
let player = [];
let mixer;
loader.load('../dist/res/SK_Character_Dummy_Male_01.fbx', (group) => {
    group.traverse(function (object) {
        if (object instanceof THREE.Mesh) {
            // @ts-ignore
            object.material = material;
        }
        object.receiveShadow = false;
    });
    group.rotation.y += Math.PI;
    group.rotation.x += Math.PI / 2;
    group.receiveShadow = false;
    group.scale.set(.5, .5, .5);
    loader.load('../dist/res/walking.fbx', function (object) {
        group.animations = object.animations;
        mixer = new THREE.AnimationMixer(group);
        const action = mixer.clipAction(group.animations[0]);
        action.play();
    });
    scene.add(group);
    player[0] = group;
});
for (var i = 1; i < 5; i++) {
    loader.load('../dist/res/SK_Character_Dummy_Male_01.fbx', (group) => {
        group.traverse(function (object) {
            if (object instanceof THREE.Mesh) {
                // @ts-ignore
                object.material = material;
            }
            object.receiveShadow = false;
        });
        group.rotation.y += Math.PI;
        group.rotation.x += Math.PI / 2;
        group.receiveShadow = false;
        group.scale.set(.5, .5, .5);
        group.position.x += Math.random() * 1000;
        group.position.y += Math.random() * 1000;
        scene.add(group);
        player[i] = group;
    });
}
//instance rendering test
//floor
const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
mesh.rotation.z = -Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);
const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
grid.material.opacity = 0.2;
grid.rotation.x = -Math.PI / 2;
grid.material.transparent = true;
scene.add(grid);
camera.position.z = 1000;
camera.position.y = -500;
camera.rotation.x = Math.PI / 6;
//keyboard_down bools
let keys = [false, false, false, false];
let Mouse = new THREE.Vector2(0, 0);
//keyboard input handler
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
//keyboard input handler
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
function MouseMove(event) {
    Mouse.set(event.x, event.y);
}
document.addEventListener('keydown', KeyDown);
document.addEventListener('keyup', KeyUp);
document.addEventListener('mousemove', MouseMove);
const speed = 4;
let halfPoint = new THREE.Vector2(screen.width / 2, screen.height / 2);
const animate = function () {
    requestAnimationFrame(animate);
    //animation clock
    const delta = clock.getDelta();
    //animation loop
    if (mixer && (keys[0] || keys[1] || keys[2] || keys[3])) {
        mixer.update(delta);
    }
    let vec = new THREE.Vector2(Mouse.x, Mouse.y);
    vec.sub(halfPoint);
    vec = vec.normalize();
    player[0].rotation.y = -vec.angle() + (Math.PI / 2);
    //movement from input
    if (keys[0]) {
        camera.position.y += -vec.y * speed;
        camera.position.x += vec.x * speed;
        player[0].position.y += -vec.y * speed;
        player[0].position.x += vec.x * speed;
    }
    if (keys[1]) {
        camera.position.y += -vec.x * speed;
        camera.position.x += -vec.y * speed;
        player[0].position.y += -vec.x * speed;
        player[0].position.x += -vec.y * speed;
    }
    if (keys[2]) {
        camera.position.y += vec.y * speed;
        camera.position.x += -vec.x * speed;
        player[0].position.y += vec.y * speed;
        player[0].position.x += -vec.x * speed;
    }
    if (keys[3]) {
        camera.position.y += vec.x * speed;
        camera.position.x += vec.y * speed;
        player[0].position.y += vec.x * speed;
        player[0].position.x += vec.y * speed;
    }
    for (var i = 1; i < 6; i++) {
        if (player[i] != undefined) {
            player[i].position.x += Math.random() * 5 - 2.5;
            player[i].position.y += Math.random() * 5 - 2.5;
        }
    }
    console.log(player);
    //player rotation
    renderer.render(scene, camera);
};
console.log(scene);
animate();
//# sourceMappingURL=index.js.map