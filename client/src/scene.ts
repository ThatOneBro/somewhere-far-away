import * as THREE from "three";
import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";

export function initScene(container: HTMLDivElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(
    "https://raw.githubusercontent.com/mrdoob/three.js/main/examples/js/libs/draco/"
  );
  loader.setDRACOLoader(dracoLoader);
  loader.load(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tower/model.gltf",
    (gltf) => {
      scene.add(gltf.scene);
    }
  );

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);

  container.appendChild(renderer.domElement);
}
