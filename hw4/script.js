import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { getArtworkData } from "./getArtworkData.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let imageDisplays = [];
let movingClouds = [];
let staticClouds = [];
let pedHeight, pedX, pedZ;
let maxZoomDistance = 14;

let scene = new THREE.Scene(); // create scene
{
  scene.fog = new THREE.Fog(0xc7b5ce, 0, 25);
}

//camera
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.z = 14;
camera.position.y = 4;
camera.lookAt(0, 4, 0);

//renderer
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setClearColor(0x000000, 0.9);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//grid
// let gridHelper = new THREE.GridHelper(25, 25);
// scene.add(gridHelper);

// add orbit controls
let controls = new OrbitControls(camera, renderer.domElement);

//lighting
let ambLight = new THREE.AmbientLight("0xffffff", 1);
scene.add(ambLight);

//-- top light
const dirLight1 = new THREE.DirectionalLight(0x12cfe8, 4);
dirLight1.position.set(0, 10, 0);
dirLight1.target.position.set(0, 0, 0);
scene.add(dirLight1);
scene.add(dirLight1.target);

//-- bottom light
const dirLight2 = new THREE.DirectionalLight(0xe8b612, 3);
dirLight2.position.set(0, -10, 0);
dirLight2.target.position.set(0, 0, 0);
scene.add(dirLight2);
scene.add(dirLight2.target);

//-- side light 1
const dirLight3 = new THREE.DirectionalLight(0x0461f7, 2);
dirLight3.position.set(10, 10, 0);
dirLight3.target.position.set(0, 0, 0);
scene.add(dirLight3);
scene.add(dirLight3.target);

//-- side light 2
const dirLight4 = new THREE.DirectionalLight(0xe8b612, 2);
dirLight4.position.set(-10, 10, 0);
dirLight4.target.position.set(0, 0, 0);
scene.add(dirLight4);
scene.add(dirLight4.target);

//create dome
let domeGeo = new THREE.SphereGeometry(15, 32, 16);
let domeMat = new THREE.MeshPhysicalMaterial({
  metalness: 0.3,
  roughness: 0.6,
  color: 0x8ae6f2,
  reflectivity: 0.9,
  clearcoat: 0.2,
  side: THREE.DoubleSide,
});
let dome = new THREE.Mesh(domeGeo, domeMat);
scene.add(dome);

//run functions
loadModel();
animate();
getDataAndDisplay();

//class for image spheres
class myImageDisplay {
  constructor(scene, imageUrl) {
    let imageTexture = new THREE.TextureLoader().load(
      imageUrl,
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(Math.random(), 0);
        texture.repeat.set(2, 1);
      }
    );
    const sphereGeo = new THREE.SphereGeometry(1, 32, 16);
    const sphereMat = new THREE.MeshPhongMaterial({
      metalness: 0.3,
      roughness: 0.6,
      color: 0xffffff,
      reflectivity: 0.9,
      clearcoat: 0.2,
      map: imageTexture,
      specularIntensity: 0.2,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    this.mesh = sphere;
    scene.add(sphere);
  }
  setPosition(x, y, z) {
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;
  }
}

function animate() {
  movingClouds.forEach((model) => {
    model.position.x += 0.005;
    if (model.position.x > 10) {
      model.position.x = -10;
    }
  });

  limitZoomDistance();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}

//keep controls from zooming out of dome
function limitZoomDistance() {
  let distance = camera.position.length();
  let targetDistance = controls.target.length();

  if (distance > maxZoomDistance) {
    camera.position.setLength(maxZoomDistance);
  }
  if (targetDistance > maxZoomDistance) {
    controls.target.setLength(maxZoomDistance);
  }
}

//get artwork
async function getDataAndDisplay() {
  let artworkData = await getArtworkData("surrealism");
  console.log(artworkData);

  for (let i = 0; i < artworkData.length; i++) {
    let image_id = artworkData[i].data.image_id;
    let imageUrl =
      "https://www.artic.edu/iiif/2/" + image_id + "/full/843,/0/default.jpg";
    let imageDisplay = new myImageDisplay(scene, imageUrl);

    //create pedestals
    pedHeight = Math.floor(Math.random() * 5) + 1;
    pedX = Math.floor(Math.random() * 20) - 10;
    pedZ = Math.floor(Math.random() * 20) - 10;

    imageDisplay.setPosition(pedX, pedHeight + 1.2, pedZ);

    const boxGeo = new THREE.BoxGeometry(1.5, pedHeight, 1.5);
    const boxMat = new THREE.MeshPhongMaterial({
      metalness: 0.3,
      roughness: 0.3,
      color: 0xffffff,
      reflectivity: 0.9,
      clearcoat: 0.2,
      specularIntensity: 0.2,
    });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.castShadow = true;
    box.receiveShadow = true;

    //set pedestal positions
    box.position.z = pedZ;
    box.position.x = pedX;
    box.position.y = pedHeight / 2;
    scene.add(box);

    //add image array
    imageDisplays.push(imageDisplay);
  }
}

//import cloud model
function loadModel() {
  let cloudsLoader = new GLTFLoader();
  cloudsLoader.load("scene.gltf", function (gltf) {
    //add moving clouds
    for (let i = 0; i < 4; i++) {
      let movingCloudsClone = gltf.scene.clone();

      let movingCloudsScale = Math.random() * 0.5 + 0.5;
      movingCloudsClone.scale.set(
        movingCloudsScale,
        movingCloudsScale,
        movingCloudsScale
      );

      movingCloudsClone.position.x = Math.random() * 20 - 10;
      movingCloudsClone.position.y = Math.random() * 5 + 5;
      movingCloudsClone.position.z = Math.random() * 20 - 10;
      movingCloudsClone.rotation.x = Math.random() * Math.PI;

      scene.add(movingCloudsClone);
      movingClouds.push(movingCloudsClone);
    }

    //add static clouds
    for (let i = 0; i < 5; i++) {
      let staticCloudsClone = gltf.scene.clone();
      staticCloudsClone.scale.set(3, 3, 3);

      staticCloudsClone.position.x = Math.random() * 20 - 10;
      staticCloudsClone.position.y = -5;
      staticCloudsClone.position.z = Math.random() * 20 - 10;

      staticCloudsClone.rotation.y = Math.PI;

      scene.add(staticCloudsClone);
      staticClouds.push(staticCloudsClone);
    }
  });
}
