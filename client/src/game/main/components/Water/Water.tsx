import { useFrame } from '@react-three/fiber';
import { useCallback, useRef } from 'react';
import * as THREE from 'three';
import WaterTexture from '../../../../assets/images/water-texture.png';

// Source of OG code: https://github.com/OmarShehata/tutsplus-toon-water/blob/master/Threejs/index.html

// Set up depth buffer
const depthTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
depthTarget.texture.format = THREE.RGBFormat;
depthTarget.texture.minFilter = THREE.NearestFilter;
depthTarget.texture.magFilter = THREE.NearestFilter;
depthTarget.texture.generateMipmaps = false;
depthTarget.stencilBuffer = false;
depthTarget.depthBuffer = true;
depthTarget.depthTexture = new THREE.DepthTexture();
depthTarget.depthTexture.type = THREE.UnsignedShortType;

// This is used as a hack to get the depth of the pixels at the water surface by redrawing the scene with the water in the depth buffer
const depthTarget2 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
depthTarget2.texture.format = THREE.RGBFormat;
depthTarget2.texture.minFilter = THREE.NearestFilter;
depthTarget2.texture.magFilter = THREE.NearestFilter;
depthTarget2.texture.generateMipmaps = false;
depthTarget2.stencilBuffer = false;
depthTarget2.depthBuffer = true;
depthTarget2.depthTexture = new THREE.DepthTexture();
depthTarget2.depthTexture.type = THREE.UnsignedShortType;

// // Used to apply the distortion effect
// const mainTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
// mainTarget.texture.format = THREE.RGBFormat;
// mainTarget.texture.minFilter = THREE.NearestFilter;
// mainTarget.texture.magFilter = THREE.NearestFilter;
// mainTarget.texture.generateMipmaps = false;
// mainTarget.stencilBuffer = false;

// // Used to know which areas of the screen are udnerwater
// const maskTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
// maskTarget.texture.format = THREE.RGBFormat;
// maskTarget.texture.minFilter = THREE.NearestFilter;
// maskTarget.texture.magFilter = THREE.NearestFilter;
// maskTarget.texture.generateMipmaps = false;
// maskTarget.stencilBuffer = false;

const vertShader = `
  uniform float uTime;
  varying vec2 vUV;
  varying vec3 WorldPosition;
  void main() {
    vec3 pos = position;
    pos.z += cos(pos.x * 1.25 + uTime) * 0.1 * sin(pos.y * 1.25 + uTime);
    WorldPosition = pos;
    vUV = uv;
    //gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 4.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragShader = `
  #include <packing>
  varying vec2 vUV;
  uniform sampler2D uSurfaceTexture;
  uniform sampler2D uDepthMap;
  uniform sampler2D uDepthMap2;
  uniform float uTime;
  uniform float cameraNear;
  uniform float cameraFar;
  uniform vec4 uScreenSize;
  uniform bool isMask;
  float readDepth (sampler2D depthSampler, vec2 coord) {
    float fragCoordZ = texture2D(depthSampler, coord).x;
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
    return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
  }
  float getLinearDepth(vec3 pos) {
    return -(viewMatrix * vec4(pos, 1.0)).z;
  }
  float getLinearScreenDepth(sampler2D map) {
    vec2 uv = gl_FragCoord.xy * uScreenSize.zw;
    return readDepth(map,uv);
  }
  void main(){
    // vec4 color = vec4(0.0,0.7,1.0,0.6);
    vec3 baseColor = vec3(0.04, 0.45, 0.675);
    // vec3 lightColor = vec3(1.0,0.725,0.31);
    // vec3 mixedColor = vec3(0.0);
    vec4 color = vec4(baseColor, 0.6);

    // mixedColor = mix(baseColor,lightColor, 0.4);
    // color = vec4(baseColor, 0.6);
    
    // vec4 color = vec4(0.36,0.6,0.58,0.7);
    vec2 pos = vUV * 16.0;
    pos.y -= uTime * 0.006;
    vec4 WaterLines = texture2D(uSurfaceTexture,pos);
    color.rgba += WaterLines.r * 0.25;
    //float worldDepth = getLinearDepth(WorldPosition);
    float worldDepth = getLinearScreenDepth(uDepthMap2);
    float screenDepth = getLinearScreenDepth(uDepthMap);
    float foamLine = clamp((screenDepth - worldDepth),0.0,1.0);
    if(foamLine < 0.001){
        color.rgba += 0.2;
    }
    if(isMask){
      color = vec4(1.0);
    }
    gl_FragColor = color;
  }
`;

// const distortFragShader = `
//   varying vec2 vUv;
//   uniform sampler2D uColorBuffer;
//   // uniform sampler2D uMaskBuffer;
//   uniform float uTime;
//   void main() {
//     vec2 pos = vUv;

//     float X = pos.x*15.+uTime*0.5;
//     float Y = pos.y*15.+uTime*0.5;
//     pos.y += cos(X+Y)*0.01*cos(Y);
//     pos.x += sin(X-Y)*0.01*sin(Y);

//     // Check original position as well as new distorted position
//     // vec4 maskColor = texture2D(uMaskBuffer, pos);
//     // vec4 maskColor2 = texture2D(uMaskBuffer, vUv);
//     // if(maskColor != vec4(1.0) || maskColor2 != vec4(1.0)){
//     //     pos = vUv;
//     // }

//     vec4 color = texture2D(uColorBuffer, pos);
//     gl_FragColor = color;
//   }
// `;

// const distortVertShader = `
//   varying vec2 vUv;
//   void main() {
//     vUv = uv;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//   }
// `;

// // Setup post processing stage
// const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
// const postMaterial = new THREE.ShaderMaterial({
//   vertexShader: distortVertShader,
//   fragmentShader: distortFragShader,
//   uniforms: {
//     uColorBuffer: { value: mainTarget.texture },
//     // uMaskBuffer: { value: maskTarget.texture },
//     uTime: { value: 0 },
//   },
// });

// const postPlane = new THREE.PlaneBufferGeometry(2, 2);
// const postQuad = new THREE.Mesh(postPlane, postMaterial);
// const postScene = new THREE.Scene();
// postScene.add(postQuad);

// postScene.postMaterial = postMaterial;

const waterLinesTexture = new THREE.TextureLoader().load(WaterTexture);
waterLinesTexture.wrapS = THREE.RepeatWrapping;
waterLinesTexture.wrapT = THREE.RepeatWrapping;
// waterLinesTexture.repeat.set(40, 40);

const uniforms = {
  uTime: { value: 0.0 },
  uSurfaceTexture: { type: 't', value: waterLinesTexture },
  cameraNear: { value: 150 },
  cameraFar: { value: 500 },
  uDepthMap: { value: depthTarget.depthTexture },
  uDepthMap2: { value: depthTarget2.depthTexture },
  isMask: { value: false },
  uScreenSize: {
    value: new THREE.Vector4(window.innerWidth, window.innerHeight, 1 / window.innerWidth, 1 / window.innerHeight),
  },
  fogNearColor: { value: new THREE.Color(0xfc4848) },
  fogNoiseFreq: { value: 0.0012 },
  fogNoiseSpeed: { value: 100 },
  fogNoiseImpact: { value: 0.5 },
  time: { value: 0.0 },
};

// water.rotation.x = -Math.PI/2;
// water.position.y = -1;

// water.uniforms = uniforms;

// const waterGeometry = new THREE.PlaneGeometry(500, 500, 500, 500);
const waterMaterial = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: vertShader,
  fragmentShader: fragShader,
  transparent: true,
  depthWrite: false,
  alphaToCoverage: true,
  // fog: true,
});

const Water = () => {
  const waterRef = useRef<THREE.Mesh>(null);

  const onFrame = useCallback(() => {
    if (!waterRef.current) return;
    uniforms.uTime.value += 0.075;
    uniforms.time.value += 0.05;
    // postMaterial.uniforms.uTime.value += 0.1;
  }, []);

  useFrame(onFrame);
  return (
    <group rotation={[0, -Math.PI / 6, 0]}>
      <mesh material={waterMaterial} position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} ref={waterRef}>
        <planeGeometry args={[400, 400, 400, 400]} />
      </mesh>
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2000, 2000, 200, 200]} />
        {/* <meshBasicMaterial color={0x0c73ac} /> */}
        <meshBasicMaterial color={0x518791} />
      </mesh>
    </group>
  );
};

export default Water;
