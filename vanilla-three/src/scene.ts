import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "../node_modules/@types/three";

export function initScene(container: HTMLDivElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.001,
    1000
  );
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.4.3/"
  );
  loader.setDRACOLoader(dracoLoader);
  loader.load(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tower/model.gltf",
    (gltf) => {
      console.log("LOADED");
      scene.add(gltf.scene.children[0]);
    },
    undefined,
    (err) => console.error(err)
  );

  const light = new THREE.AmbientLight(0x404040, 2); // soft white light
  scene.add(light);

  window.addEventListener("resize", onWindowResize, false);

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  function animate() {
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);

  container.appendChild(renderer.domElement);
}
