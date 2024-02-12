import * as THREE from "https://threejs.org/build/three.module.js";

let scene = new THREE.Scene(); // create scene
{
  scene.fog = new THREE.Fog(0xc7b5ce, 0, 40);
}

// textures
let textureLoader = new THREE.TextureLoader();
let cone1Texture = textureLoader.load("textures/navy1.jpeg");
let cone2Texture = textureLoader.load("textures/navy4.jpeg");
let planeTexture = textureLoader.load("textures/navy2.jpeg");
let sphereTexture = textureLoader.load("textures/sun1.jpeg");

//camera
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.z = 12;
camera.position.y = 2;

//renderer
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setClearColor(0x3a69c1, 0.9);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//lighting
let ambLight = new THREE.AmbientLight("0xffffff", 2);
scene.add(ambLight);

let ambLight2 = new THREE.AmbientLight("0xcee840", 3);
scene.add(ambLight2);

// //-- front orange light
const dirLight1 = new THREE.DirectionalLight(0xe8b612, 3);
dirLight1.position.set(5, 10, 2);
dirLight1.target.position.set(0, 0, 0);
scene.add(dirLight1);
scene.add(dirLight1.target);

//-- top orange light
const dirLight4 = new THREE.DirectionalLight(0xe8b612, 5);
dirLight4.position.set(0, 20, -3);
dirLight4.target.position.set(0, 1, 0);
scene.add(dirLight4);
scene.add(dirLight4.target);

//-- green sphere light
const dirLight2 = new THREE.DirectionalLight(0x15c40b, 5);
dirLight2.position.set(-10, 8, 0);
dirLight2.target.position.set(-5, 8, 0);
scene.add(dirLight2);
scene.add(dirLight2.target);

//-- front green light
const dirLight3 = new THREE.DirectionalLight(0x15c40b, 5);
dirLight3.position.set(0, 8, 8);
dirLight3.target.position.set(0, 0, 0);
dirLight3.castShadow = true;
scene.add(dirLight3);
scene.add(dirLight3.target);

//-- hemisphere light
const hemLight = new THREE.HemisphereLight(0xfce95a, 0x33005e, 4);
hemLight.position.set(0, 10, 0);
scene.add(hemLight);

let objects = new THREE.Group(); //parent group

//first cone
let cone1Geo = new THREE.ConeGeometry(3, 5, 40);
let cone1Mat = new THREE.MeshPhysicalMaterial({
  metalness: 0.65,
  roughness: 0.2,
  color: 0x0000ff,
  reflectivity: 0.9,
  map: cone1Texture,
  clearcoat: 0.2,
  specularIntensity: 0.2,
});
let cone1 = new THREE.Mesh(cone1Geo, cone1Mat);
cone1.castShadow = true;
cone1.receiveShadow = true;
objects.add(cone1);
cone1.position.set(0, 2.5, 0);
cone1.rotation.y = 90;

//second cone
let cone2Geo = new THREE.ConeGeometry(2, 2.5, 30);
let cone2Mat = new THREE.MeshPhysicalMaterial({
  metalness: 0.3,
  roughness: 0.25,
  color: 0x0000ff,
  reflectivity: 0.9,
  map: cone2Texture,
  clearcoat: 0.2,
  specularIntensity: 0.2,
});
let cone2 = new THREE.Mesh(cone2Geo, cone2Mat);
cone2.castShadow = true;
cone2.receiveShadow = true;
objects.add(cone2);
cone2.position.set(-3, 1.25, 0);
cone2.rotation.y = 90;

//sphere
const sphereGeo = new THREE.SphereGeometry(1, 32, 16);
let sphereMat = new THREE.MeshPhongMaterial({
  shininess: 100,
  color: 0x0000ff,
  reflectivity: 1,
  map: sphereTexture,
});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
sphere.castShadow = true;
sphere.receiveShadow = true;
objects.add(sphere);
sphere.position.set(-5, 8, -5);

//arch
const archGeo = new THREE.TorusGeometry(10, 0.2, 14, 21, 2.4);
const archMat = new THREE.MeshPhysicalMaterial({
  metalness: 0.3,
  roughness: 0.25,
  color: 0x0000ff,
  reflectivity: 0.9,
  color: "rgb(164,139,196)",
  clearcoat: 0.2,
  specularIntensity: 0.2,
});
const arch = new THREE.Mesh(archGeo, archMat);
arch.castShadow = true;
arch.receiveShadow = true;
objects.add(arch);

scene.add(objects);

//plane
const PlaneGeometry = new THREE.PlaneGeometry(400, 400);
const planeMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 0.3,
  roughness: 0.25,
  color: 0x0000ff,
  reflectivity: 0.9,
  map: planeTexture,
  clearcoat: 0.2,
  specularIntensity: 0.2,
  side: THREE.DoubleSide,
});
3;
const plane = new THREE.Mesh(PlaneGeometry, planeMaterial);
plane.receiveShadow = true;
plane.position.set(0, 0, 0);
plane.rotation.x = Math.PI / 2;
scene.add(plane);

const offset = new THREE.Vector3();
const distance = 12;

//move objects + camera
function animate(time) {
  arch.rotateZ(0.01);
  sphere.rotateX(0.01);

  offset.x = distance * Math.sin(time * 0.0005);
  offset.z = distance * Math.cos(time * 0.0005);
  offset.y = 6;

  camera.position.copy(objects.position).add(offset);
  camera.lookAt(0, 3, 0);

  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}

animate();
