import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function CyberSpider3D({ className = '', height = '520px', interactive = true, initialInspectMode = 0 }) {
  const mountRef = useRef(null);
  const simRef = useRef(null);

  const [audioEnabled, setAudioEnabled] = useState(false);
  const [inspectMode, setInspectMode] = useState(initialInspectMode); // 0: PBR, 1: Wireframe, 2: Cyber Glow
  const [telemetry, setTelemetry] = useState({ pos: 'POS [X:00.0 Z:00.0]', hdg: 'HDG: 000°', webs: 0, lock: 'LOCK: 0.0m', lockVis: false });

  // Web Audio Synthesizer ref
  const audioCtxRef = useRef(null);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const playStepSound = useCallback((rate = 1.0) => {
    if (!audioEnabled || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140 * rate, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (_) {}
  }, [audioEnabled]);

  const playWebSound = useCallback(() => {
    if (!audioEnabled || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(960, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } catch (_) {}
  }, [audioEnabled]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera & Transparent WebGL Renderer (Pure Glassmorphic Substrate)
    const scene = new THREE.Scene();
    // Do not set scene.background or scene.fog so canvas remains 100% transparent for glassmorphism!

    const getW = () => container.clientWidth || 440;
    const getH = () => container.clientHeight || 520;

    const camera = new THREE.PerspectiveCamera(45, getW() / getH(), 0.1, 350);
    const initialCamPos = new THREE.Vector3(0, 16, 20);
    camera.position.copy(initialCamPos);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0x000000, 0); // 100% transparent!
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    container.appendChild(renderer.domElement);

    const updateSize = () => {
      if (!container) return;
      const w = container.clientWidth || 440;
      const h = container.clientHeight || 520;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      }
    };
    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minDistance = 6;
    controls.maxDistance = 45;
    controls.target.set(0, 0.8, 0);
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.NONE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE
    };

    // 2. Lights - Calibrated for delicate, low-scatter glassmorphism
    const ambientLight = new THREE.AmbientLight(0x182030, 1.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
    mainLight.position.set(25, 45, 30);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.camera.near = 1;
    mainLight.shadow.camera.far = 180;
    const shadowD = 90;
    mainLight.shadow.camera.left = -shadowD;
    mainLight.shadow.camera.right = shadowD;
    mainLight.shadow.camera.top = shadowD;
    mainLight.shadow.camera.bottom = -shadowD;
    mainLight.shadow.bias = -0.0005;
    scene.add(mainLight);

    // Dual Spider-Man Rim Lights: Delicate low-intensity edge illumination
    const rimLightRed = new THREE.DirectionalLight(0xef4151, 1.0);
    rimLightRed.position.set(-25, 16, -20);
    scene.add(rimLightRed);

    const rimLightBlue = new THREE.DirectionalLight(0x0066ff, 1.0);
    rimLightBlue.position.set(25, 16, -20);
    scene.add(rimLightBlue);

    const spiderCoreLight = new THREE.PointLight(0xff2244, 0.6, 6, 2.0);
    scene.add(spiderCoreLight);

    // 3. Transparent Floor Shadow Catcher (Pure Glassmorphism - completely transparent substrate)
    const floorSize = 160;
    const floorGeo = new THREE.PlaneGeometry(floorSize, floorSize);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // 4. Reticles
    const reticleGroup = new THREE.Group();
    reticleGroup.position.set(0, 0.03, 0);
    scene.add(reticleGroup);

    const ringGeo1 = new THREE.RingGeometry(1.2, 1.28, 32);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xff2a4b, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const reticleRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    reticleRing1.rotation.x = -Math.PI / 2;
    reticleGroup.add(reticleRing1);

    const ringGeo2 = new THREE.RingGeometry(2.1, 2.18, 32);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xff3b5c, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
    const reticleRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    reticleRing2.rotation.x = -Math.PI / 2;
    reticleGroup.add(reticleRing2);

    const spiderRadarGroup = new THREE.Group();
    spiderRadarGroup.position.set(0, 0.02, 0);
    scene.add(spiderRadarGroup);

    const spiderRadarRingOuter = new THREE.Mesh(
      new THREE.RingGeometry(3.6, 3.68, 48),
      new THREE.MeshBasicMaterial({ color: 0xff2a4b, side: THREE.DoubleSide, transparent: true, opacity: 0.25 })
    );
    spiderRadarRingOuter.rotation.x = -Math.PI / 2;
    spiderRadarGroup.add(spiderRadarRingOuter);

    const spiderRadarRingInner = new THREE.Mesh(
      new THREE.RingGeometry(1.8, 1.88, 36),
      new THREE.MeshBasicMaterial({ color: 0xff2a4b, side: THREE.DoubleSide, transparent: true, opacity: 0.35 })
    );
    spiderRadarRingInner.rotation.x = -Math.PI / 2;
    spiderRadarGroup.add(spiderRadarRingInner);

    // 5. Procedural Normal Texture & PBR Materials
    function generateChitinTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#8080ff';
      ctx.fillRect(0, 0, 512, 512);

      for (let i = 0; i < 512; i += 4) {
        ctx.fillStyle = i % 8 === 0 ? '#7d7dfa' : '#8585ff';
        ctx.fillRect(0, i, 512, 2);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
      return texture;
    }
    const chitinNormalMap = generateChitinTexture();

    const chitinMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x07090e,
      emissive: 0x050102,
      metalness: 0.85,
      roughness: 0.22,
      clearcoat: 1.0,
      clearcoatRoughness: 0.12,
      reflectivity: 0.95,
      normalMap: chitinNormalMap,
      normalScale: new THREE.Vector2(0.25, 0.25)
    });

    const ceramicArmorMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf4f7fa,
      metalness: 0.2,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.98
    });

    const darkSubChassisMat = new THREE.MeshStandardMaterial({
      color: 0x111622,
      metalness: 0.9,
      roughness: 0.4
    });

    const sinewMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f060a,
      emissive: 0x470511,
      metalness: 0.7,
      roughness: 0.35
    });

    const bioLuminousRed = new THREE.MeshStandardMaterial({
      color: 0x220005,
      emissive: 0xff1e40,
      emissiveIntensity: 2.2,
      roughness: 0.2
    });

    const eyeLensGlass = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
      clearcoat: 1.0
    });

    const sculptMaterials = [chitinMaterial, ceramicArmorMaterial, darkSubChassisMat, sinewMaterial, bioLuminousRed];

    // 6. Sculpted Spider Body
    const spider = {
      position: new THREE.Vector3(0, 1.45, 0),
      velocity: new THREE.Vector3(0, 0, 0),
      heading: 0,
      targetHeading: 0,
      targetPoint: new THREE.Vector3(0, 0, 0),
      speed: 0,
      maxSpeed: 8.5,
      gaitTimer: 0,
      legs: [],
      recoil: 0,
      eyeBlinkTimer: 0,
      group: new THREE.Group()
    };
    scene.add(spider.group);

    const bodyGroup = new THREE.Group();
    spider.group.add(bodyGroup);

    // Abdomen
    const abdomenGroup = new THREE.Group();
    abdomenGroup.position.set(0, 0.32, -2.1);
    bodyGroup.add(abdomenGroup);

    function createSculptedAbdomenGeometry() {
      const geo = new THREE.SphereGeometry(2.05, 48, 36);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        let z = pos.getZ(i);
        z *= 1.42;
        const taper = (z + 2.8) / 5.8;
        const widthFactor = 0.55 + 0.82 * Math.sin(Math.min(Math.max(taper, 0), 1) * Math.PI * 0.9);
        x *= widthFactor * 1.2;
        if (y < 0) {
          y *= 0.62;
        } else {
          const spineCenter = Math.exp(-Math.pow(x * 2.2, 2));
          y *= 0.88 + spineCenter * 0.22;
          y -= Math.sin(Math.abs(x) * 1.2) * 0.1;
        }
        pos.setXYZ(i, x, y, z);
      }
      geo.computeVertexNormals();
      return geo;
    }

    const sculptedAbdomenGeo = createSculptedAbdomenGeometry();
    const abdomenMesh = new THREE.Mesh(sculptedAbdomenGeo, chitinMaterial);
    abdomenMesh.castShadow = true;
    abdomenMesh.receiveShadow = true;
    abdomenGroup.add(abdomenMesh);

    // Segmented Ventral Sternites
    for (let s = 0; s < 5; s++) {
      const sterniteGeo = new THREE.TorusGeometry(1.0 - s * 0.14, 0.08, 16, 32, Math.PI);
      sterniteGeo.rotateX(Math.PI / 2);
      sterniteGeo.rotateZ(Math.PI);
      const sternite = new THREE.Mesh(sterniteGeo, darkSubChassisMat);
      sternite.position.set(0, -0.68 + s * 0.05, -1.2 + s * 0.58);
      sternite.scale.set(1.35 - s * 0.12, 1.0, 0.7);
      abdomenGroup.add(sternite);
    }

    // Core Cavity & Pulsing Reactor Sphere
    const coreCavityGeo = new THREE.TorusGeometry(0.58, 0.12, 16, 48);
    coreCavityGeo.rotateX(Math.PI / 2);
    const coreCavity = new THREE.Mesh(coreCavityGeo, ceramicArmorMaterial);
    coreCavity.position.set(0, 0.96, 0.08);
    coreCavity.scale.set(1.4, 0.9, 1.0);
    abdomenGroup.add(coreCavity);

    const coreSphere = new THREE.Mesh(new THREE.SphereGeometry(0.48, 24, 24), bioLuminousRed);
    coreSphere.position.set(0, 0.84, 0.08);
    abdomenGroup.add(coreSphere);

    // Spine Glow Strip
    const spineCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.95, 0.95),
      new THREE.Vector3(0, 1.08, 0.08),
      new THREE.Vector3(0, 1.02, -0.8),
      new THREE.Vector3(0, 0.78, -1.8),
      new THREE.Vector3(0, 0.3, -2.7)
    ]);
    const spineTubeGeo = new THREE.TubeGeometry(spineCurve, 36, 0.055, 12, false);
    const spineStrip = new THREE.Mesh(spineTubeGeo, bioLuminousRed);
    abdomenGroup.add(spineStrip);

    // Spinneret Web Cannon
    const spinneretGroup = new THREE.Group();
    spinneretGroup.position.set(0, -0.05, -2.85);
    abdomenGroup.add(spinneretGroup);

    const spinneretBaseGeo = new THREE.CylinderGeometry(0.34, 0.58, 0.8, 24);
    spinneretBaseGeo.rotateX(Math.PI / 2);
    const spinneretMesh = new THREE.Mesh(spinneretBaseGeo, darkSubChassisMat);
    spinneretGroup.add(spinneretMesh);

    const nozzleRing = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.065, 16, 32), bioLuminousRed);
    nozzleRing.position.set(0, 0, -0.42);
    spinneretGroup.add(nozzleRing);

    // Cephalothorax (Sculpted Head)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.16, 1.15);
    bodyGroup.add(headGroup);

    function createSculptedCephalothorax() {
      const geo = new THREE.SphereGeometry(1.5, 48, 36);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        let z = pos.getZ(i);
        z *= 1.25;
        const wedge = (z + 1.6) / 3.4;
        x *= (1.2 - wedge * 0.45);
        if (z > 0) y *= (1.0 - z * 0.16);
        const centerDent = Math.exp(-Math.pow(x * 3.2, 2)) * Math.exp(-Math.pow((z + 0.2) * 1.8, 2));
        y -= centerDent * 0.22;
        if (y < 0) y *= 0.55;
        pos.setXYZ(i, x, y, z);
      }
      geo.computeVertexNormals();
      return geo;
    }

    const sculptedHeadGeo = createSculptedCephalothorax();
    const headMesh = new THREE.Mesh(sculptedHeadGeo, ceramicArmorMaterial);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Pedicel Joint
    const pedicelGeo = new THREE.CylinderGeometry(0.48, 0.62, 0.8, 20);
    pedicelGeo.rotateX(Math.PI / 2);
    const pedicel = new THREE.Mesh(pedicelGeo, sinewMaterial);
    pedicel.position.set(0, 0.1, -0.9);
    headGroup.add(pedicel);

    // 8-Lens Multi-Ocular Cluster
    const eyes = [];
    const eyeCoords = [
      { pos: [-0.32, 0.28, 1.58], r: 0.20 },
      { pos: [ 0.32, 0.28, 1.58], r: 0.20 },
      { pos: [-0.64, 0.22, 1.35], r: 0.15 },
      { pos: [ 0.64, 0.22, 1.35], r: 0.15 },
      { pos: [-0.35, 0.48, 1.08], r: 0.13 },
      { pos: [ 0.35, 0.48, 1.08], r: 0.13 },
      { pos: [-0.76, 0.36, 0.78], r: 0.12 },
      { pos: [ 0.76, 0.36, 0.78], r: 0.12 }
    ];

    eyeCoords.forEach((ec, idx) => {
      const eyeHolder = new THREE.Group();
      eyeHolder.position.set(...ec.pos);
      headGroup.add(eyeHolder);

      const bezelGeo = new THREE.TorusGeometry(ec.r * 1.15, ec.r * 0.22, 12, 24);
      const bezel = new THREE.Mesh(bezelGeo, darkSubChassisMat);
      eyeHolder.add(bezel);

      const retinaGeo = new THREE.SphereGeometry(ec.r * 0.85, 16, 16);
      const retina = new THREE.Mesh(retinaGeo, bioLuminousRed);
      eyeHolder.add(retina);

      const corneaGeo = new THREE.SphereGeometry(ec.r * 0.96, 16, 16);
      const cornea = new THREE.Mesh(corneaGeo, eyeLensGlass);
      eyeHolder.add(cornea);

      eyes.push({ holder: eyeHolder, retina, cornea, isPrimary: idx < 2 });
    });

    // Fangs (Chelicerae)
    function createSculptedFang(side) {
      const group = new THREE.Group();
      group.position.set(side * 0.42, -0.15, 1.62);

      const baseGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.65, 16);
      baseGeo.rotateX(Math.PI / 4);
      const baseMesh = new THREE.Mesh(baseGeo, darkSubChassisMat);
      group.add(baseMesh);

      const fangCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0.26),
        new THREE.Vector3(0, -0.26, 0.4),
        new THREE.Vector3(-side * 0.12, -0.66, 0.5),
        new THREE.Vector3(-side * 0.21, -1.0, 0.34)
      ]);
      const fangGeo = new THREE.TubeGeometry(fangCurve, 20, 0.11, 12, false);
      const fangMesh = new THREE.Mesh(fangGeo, chitinMaterial);
      group.add(fangMesh);

      const tipGlow = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), bioLuminousRed);
      tipGlow.position.set(-side * 0.21, -1.0, 0.34);
      group.add(tipGlow);

      return group;
    }

    const cheliceraL = createSculptedFang(-1);
    const cheliceraR = createSculptedFang(1);
    headGroup.add(cheliceraL);
    headGroup.add(cheliceraR);

    // Pedipalps
    function createSculptedPalp(side) {
      const palp = new THREE.Group();
      palp.position.set(side * 0.75, -0.1, 1.3);

      const c1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(side * 0.2, -0.14, 0.4),
        new THREE.Vector3(side * 0.16, -0.06, 0.85),
        new THREE.Vector3(0, -0.2, 1.2)
      ]);
      const geo = new THREE.TubeGeometry(c1, 24, 0.12, 12, false);
      const mesh = new THREE.Mesh(geo, ceramicArmorMaterial);
      palp.add(mesh);

      const claw = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.4, 12), darkSubChassisMat);
      claw.position.set(0, -0.2, 1.2);
      claw.rotation.x = Math.PI / 3;
      palp.add(claw);

      return palp;
    }

    const leftPedipalp = createSculptedPalp(-1);
    const rightPedipalp = createSculptedPalp(1);
    headGroup.add(leftPedipalp);
    headGroup.add(rightPedipalp);

    // 7. Biomimetic Inverse Kinematics Legs
    function createSculptedLimbGeometry(length, rStart, rMid, rEnd, curveIntensity = 0.25) {
      const points = [];
      const steps = 16;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const y = t * length;
        const curve = Math.sin(t * Math.PI) * curveIntensity;
        points.push(new THREE.Vector3(curve, y, 0));
      }
      const path = new THREE.CatmullRomCurve3(points);
      return new THREE.TubeGeometry(path, 20, rMid, 14, false);
    }

    class SculptedCyberLeg3D {
      constructor(side, mountAngle, mountRadius, l1, l2, l3, index) {
        this.side = side;
        this.mountAngle = mountAngle;
        this.mountRadius = mountRadius;
        this.l1 = l1;
        this.l2 = l2;
        this.l3 = l3;
        this.index = index;

        this.footPos = new THREE.Vector3();
        this.startFootPos = new THREE.Vector3();
        this.targetFootPos = new THREE.Vector3();
        this.stepProgress = 1.0;

        this.rootGroup = new THREE.Group();
        scene.add(this.rootGroup);

        const coxaSocketGeo = new THREE.SphereGeometry(0.45, 18, 18);
        this.coxaMesh = new THREE.Mesh(coxaSocketGeo, darkSubChassisMat);
        this.rootGroup.add(this.coxaMesh);

        const coxaRing = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.055, 12, 24), bioLuminousRed);
        this.coxaMesh.add(coxaRing);

        const femurGeo = createSculptedLimbGeometry(this.l1, 0.28, 0.32, 0.22, 0.28);
        this.bone1Mesh = new THREE.Mesh(femurGeo, chitinMaterial);
        this.bone1Mesh.castShadow = true;
        this.rootGroup.add(this.bone1Mesh);

        this.knee1 = new THREE.Group();
        this.knee1.position.set(0, this.l1, 0);
        this.bone1Mesh.add(this.knee1);

        const kneeCup = new THREE.Mesh(new THREE.SphereGeometry(0.38, 18, 18), ceramicArmorMaterial);
        this.knee1.add(kneeCup);

        const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 12), sinewMaterial);
        piston.position.set(0, -0.28, -0.15);
        this.knee1.add(piston);

        const tibiaGeo = createSculptedLimbGeometry(this.l2, 0.24, 0.25, 0.15, -0.32);
        this.bone2Mesh = new THREE.Mesh(tibiaGeo, chitinMaterial);
        this.bone2Mesh.castShadow = true;
        scene.add(this.bone2Mesh);

        this.knee2 = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 14), darkSubChassisMat);
        scene.add(this.knee2);

        const clawCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0.08, -this.l3 * 0.4, 0.08),
          new THREE.Vector3(0.03, -this.l3 * 0.8, -0.1),
          new THREE.Vector3(0, -this.l3, 0)
        ]);
        const clawGeo = new THREE.TubeGeometry(clawCurve, 16, 0.12, 10, false);
        this.clawMesh = new THREE.Mesh(clawGeo, bioLuminousRed);
        this.clawMesh.castShadow = true;
        scene.add(this.clawMesh);

        this.spikeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), ceramicArmorMaterial);
        scene.add(this.spikeMesh);
      }

      getMountPos(bodyPos, bodyHeading) {
        const theta = bodyHeading + this.mountAngle;
        return new THREE.Vector3(
          bodyPos.x + Math.sin(theta) * this.mountRadius,
          bodyPos.y + 0.05,
          bodyPos.z + Math.cos(theta) * this.mountRadius
        );
      }

      getIdealGroundPos(bodyPos, bodyHeading, spiderVelocity) {
        const spreadAngle = bodyHeading + (this.mountAngle * 1.32);
        const reach = (this.l1 + this.l2 + this.l3) * 0.72;
        const lead = spiderVelocity.clone().multiplyScalar(0.22);
        return new THREE.Vector3(
          bodyPos.x + Math.sin(spreadAngle) * reach + lead.x,
          0.0,
          bodyPos.z + Math.cos(spreadAngle) * reach + lead.z
        );
      }

      update(bodyPos, bodyHeading, spiderVelocity, canStep, isMoving) {
        const mount = this.getMountPos(bodyPos, bodyHeading);
        this.rootGroup.position.copy(mount);

        const ideal = this.getIdealGroundPos(bodyPos, bodyHeading, spiderVelocity);
        const distToIdeal = this.footPos.distanceTo(ideal);

        const threshold = isMoving ? 2.0 : 2.6;
        if (canStep && distToIdeal > threshold && this.stepProgress >= 1.0) {
          this.stepProgress = 0.0;
          this.startFootPos.copy(this.footPos);
          this.targetFootPos.copy(ideal);
          playStepSound(1.0 + (this.index % 4) * 0.12);

          for (let s = 0; s < 3; s++) {
            particles.push(new SparkParticle3D(
              ideal,
              new THREE.Vector3((Math.random() - 0.5) * 2.5, Math.random() * 2 + 1, (Math.random() - 0.5) * 2.5)
            ));
          }
        }

        if (this.stepProgress < 1.0) {
          this.stepProgress += 0.18;
          if (this.stepProgress > 1.0) this.stepProgress = 1.0;
          const t = this.stepProgress;
          this.footPos.lerpVectors(this.startFootPos, this.targetFootPos, t);
          this.footPos.y = Math.sin(t * Math.PI) * 1.4;
        } else {
          this.footPos.y = 0;
        }

        const footRel = new THREE.Vector3().subVectors(this.footPos, mount);
        const planarDist = Math.hypot(footRel.x, footRel.z);
        const effectiveReach = Math.min(footRel.length(), (this.l1 + this.l2 + this.l3) * 0.96);

        const azimuth = Math.atan2(footRel.x, footRel.z);
        const L_upper = this.l1;
        const L_lower = this.l2 + this.l3 * 0.55;

        const alpha = Math.acos(
          Math.min(1, Math.max(-1, (L_upper * L_upper + effectiveReach * effectiveReach - L_lower * L_lower) / (2 * L_upper * effectiveReach)))
        );
        const pitchToFoot = Math.atan2(footRel.y, planarDist);
        const femurPitch = pitchToFoot + alpha;

        this.rootGroup.rotation.set(0, azimuth, 0);
        this.bone1Mesh.rotation.set(0, 0, 0);
        this.bone1Mesh.rotation.x = -femurPitch + Math.PI / 2;

        const knee1Pos = new THREE.Vector3();
        this.knee1.getWorldPosition(knee1Pos);

        const tarsusTarget = this.footPos.clone().add(new THREE.Vector3(0, this.l3 * 0.75, 0));
        const s2Dir = new THREE.Vector3().subVectors(tarsusTarget, knee1Pos);
        const s2Len = s2Dir.length();

        this.bone2Mesh.position.copy(knee1Pos);
        this.bone2Mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), s2Dir.clone().normalize());
        this.bone2Mesh.scale.set(1, s2Len / this.l2, 1);

        this.knee2.position.copy(tarsusTarget);

        const clawDir = new THREE.Vector3().subVectors(this.footPos, tarsusTarget);
        this.clawMesh.position.copy(tarsusTarget);
        this.clawMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), clawDir.clone().normalize());
        this.clawMesh.scale.set(1, clawDir.length() / this.l3, 1);

        this.spikeMesh.position.copy(this.footPos);
      }
    }

    const legConfigs = [
      { side: -1, angle: -0.62, radius: 1.5, l1: 2.5, l2: 2.6, l3: 1.7 },
      { side: -1, angle: -1.22, radius: 1.4, l1: 2.6, l2: 2.7, l3: 1.8 },
      { side: -1, angle: -1.82, radius: 1.5, l1: 2.7, l2: 2.8, l3: 1.9 },
      { side: -1, angle: -2.42, radius: 1.7, l1: 3.0, l2: 3.1, l3: 2.0 },
      { side:  1, angle:  0.62, radius: 1.5, l1: 2.5, l2: 2.6, l3: 1.7 },
      { side:  1, angle:  1.22, radius: 1.4, l1: 2.6, l2: 2.7, l3: 1.8 },
      { side:  1, angle:  1.82, radius: 1.5, l1: 2.7, l2: 2.8, l3: 1.9 },
      { side:  1, angle:  2.42, radius: 1.7, l1: 3.0, l2: 3.1, l3: 2.0 }
    ];

    legConfigs.forEach((cfg, idx) => {
      const leg = new SculptedCyberLeg3D(cfg.side, cfg.angle, cfg.radius, cfg.l1, cfg.l2, cfg.l3, idx);
      const ideal = leg.getIdealGroundPos(spider.position, spider.heading, new THREE.Vector3());
      leg.footPos.copy(ideal);
      spider.legs.push(leg);
    });

    // 8. 3D Web Projectiles & Sparks
    const webs = [];
    const projectiles = [];
    const particles = [];

    class WebProjectile3D {
      constructor(origin, target) {
        this.start = origin.clone();
        this.target = target.clone();
        this.target.y = 0.05;
        this.current = origin.clone();
        this.speed = 48;
        this.finished = false;
        this.totalDist = this.start.distanceTo(this.target) || 1;
        this.dir = new THREE.Vector3().subVectors(this.target, this.start).normalize();

        const geo = new THREE.BufferGeometry().setFromPoints([this.start, this.current]);
        const mat = new THREE.LineBasicMaterial({ color: 0xff2a4b, linewidth: 2 });
        this.line = new THREE.Line(geo, mat);
        scene.add(this.line);

        this.sparkMesh = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        scene.add(this.sparkMesh);
      }

      update(delta) {
        const step = this.speed * delta;
        this.current.add(this.dir.clone().multiplyScalar(step));
        this.sparkMesh.position.copy(this.current);
        this.line.geometry.setFromPoints([this.start, this.current]);
        if (this.current.distanceTo(this.start) >= this.totalDist) {
          this.finished = true;
          this.destroy();
          create3DWeb(this.target, this.start);
        }
      }

      destroy() {
        scene.remove(this.line);
        scene.remove(this.sparkMesh);
        this.line.geometry.dispose();
      }
    }

    function create3DWeb(center, anchor) {
      playWebSound();
      const webGroup = new THREE.Group();
      webGroup.position.copy(center);
      scene.add(webGroup);

      // Sleek, high-tensile cyber-silk filaments with natural catenary sag (no cartoon concentric rings!)
      const linesPoints = [];
      const numTethers = 8;
      const tetherAngles = [];
      for (let i = 0; i < numTethers; i++) {
        tetherAngles.push((i / numTethers) * Math.PI * 2 + (Math.random() - 0.5) * 0.3);
      }

      tetherAngles.forEach((ang) => {
        const radius = 3.2 + Math.random() * 2.2;
        const pEnd = new THREE.Vector3(Math.cos(ang) * radius, 0.02, Math.sin(ang) * radius);

        const midPoint = new THREE.Vector3(pEnd.x * 0.5, 0.07, pEnd.z * 0.5);
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0.04, 0),
          midPoint,
          pEnd
        ]);
        const pts = curve.getPoints(12);
        for (let p = 0; p < pts.length - 1; p++) {
          linesPoints.push(pts[p], pts[p + 1]);
        }

        // Branching fibrils
        const branchAng = ang + (Math.random() - 0.5) * 0.7;
        const bLen = radius * 0.5;
        linesPoints.push(
          midPoint,
          new THREE.Vector3(midPoint.x + Math.cos(branchAng) * bLen, 0.02, midPoint.z + Math.sin(branchAng) * bLen)
        );

        // Hex node ring
        const nodeGeo = new THREE.RingGeometry(0.1, 0.16, 6);
        const nodeMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, side: THREE.DoubleSide, transparent: true, opacity: 0.65 });
        const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
        nodeMesh.rotation.x = -Math.PI / 2;
        nodeMesh.position.copy(pEnd);
        nodeMesh.position.y = 0.03;
        webGroup.add(nodeMesh);
      });

      // Connecting cross-filaments
      for (let c = 1; c <= 3; c++) {
        const r = c * 1.1;
        for (let i = 0; i < numTethers; i++) {
          const a1 = tetherAngles[i];
          const a2 = tetherAngles[(i + 1) % numTethers];
          linesPoints.push(
            new THREE.Vector3(Math.cos(a1) * r, 0.03, Math.sin(a1) * r),
            new THREE.Vector3(Math.cos(a2) * r, 0.03, Math.sin(a2) * r)
          );
        }
      }

      const webGeo = new THREE.BufferGeometry().setFromPoints(linesPoints);
      const webMat = new THREE.LineBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending
      });
      const webMesh = new THREE.LineSegments(webGeo, webMat);
      webGroup.add(webMesh);

      const tetherGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0.03, 0),
        new THREE.Vector3().subVectors(anchor, center)
      ]);
      const tetherMat = new THREE.LineBasicMaterial({
        color: 0xef4151,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      webGroup.add(new THREE.Line(tetherGeo, tetherMat));

      const orbMesh = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), new THREE.MeshBasicMaterial({ color: 0xef4151 }));
      orbMesh.position.y = 0.06;
      webGroup.add(orbMesh);

      for (let i = 0; i < 18; i++) {
        const vel = new THREE.Vector3((Math.random() - 0.5) * 8, Math.random() * 5 + 1.5, (Math.random() - 0.5) * 8);
        particles.push(new SparkParticle3D(center, vel));
      }

      webs.push({ group: webGroup, mat: webMat, tetherMat, scale: 0.01, maxRadius: 5.5 });
      setTelemetry(prev => ({ ...prev, webs: webs.length }));
    }

    class SparkParticle3D {
      constructor(pos, vel) {
        this.mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 6, 6),
          new THREE.MeshBasicMaterial({ color: Math.random() > 0.3 ? 0x00e5ff : 0xef4151 })
        );
        this.mesh.position.copy(pos);
        this.vel = vel;
        this.alpha = 1.0;
        scene.add(this.mesh);
      }
      update(delta) {
        this.mesh.position.add(this.vel.clone().multiplyScalar(delta));
        this.vel.y -= 14 * delta;
        this.alpha -= 1.8 * delta;
        if (this.mesh.position.y < 0.04) {
          this.mesh.position.y = 0.04;
          this.vel.multiplyScalar(0.6);
        }
      }
      destroy() {
        scene.remove(this.mesh);
        this.mesh.geometry.dispose();
      }
    }

    // 9. Raycasting & Localized Interaction (Clamped to prevent spider escaping!)
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const updatePointerCoord = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      // Check if pointer is within container or near it
      if (
        clientX < rect.left - 40 || clientX > rect.right + 40 ||
        clientY < rect.top - 40 || clientY > rect.bottom + 40
      ) {
        // Outside container: smoothly return spider to resting center
        spider.targetPoint.lerp(new THREE.Vector3(0, 0, 0), 0.1);
        return;
      }

      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(floorMesh);
      if (intersects.length > 0) {
        const hit = intersects[0].point;
        // Strictly clamp within visible observation arena radius (7.5 units)
        const hitRadius = Math.hypot(hit.x, hit.z);
        if (hitRadius > 7.5) {
          hit.multiplyScalar(7.5 / hitRadius);
        }
        spider.targetPoint.copy(hit);
        reticleGroup.position.x = spider.targetPoint.x;
        reticleGroup.position.z = spider.targetPoint.z;
      }
    };

    const handlePointerMove = (e) => {
      updatePointerCoord(e.clientX, e.clientY);
    };

    const handlePointerLeave = () => {
      // Gently return to center
      spider.targetPoint.set(0, 0, 0);
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        updatePointerCoord(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const fireWeb = () => {
      if (projectiles.length < 6) {
        initAudio();
        spider.recoil = 1.0;
        const nozzleWorld = new THREE.Vector3();
        nozzleRing.getWorldPosition(nozzleWorld);
        projectiles.push(new WebProjectile3D(nozzleWorld, spider.targetPoint));
      }
    };

    const handleClick = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) return;
      fireWeb();
    };

    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        const rect = container.getBoundingClientRect();
        // Only trigger space-web if container is on screen
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          e.preventDefault();
          fireWeb();
        }
      }
    };

    if (interactive) {
      container.addEventListener('pointermove', handlePointerMove);
      container.addEventListener('pointerleave', handlePointerLeave);
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
      container.addEventListener('click', handleClick);
      window.addEventListener('keydown', handleKeyDown);
    }

    const handleResize = () => {
      updateSize();
    };
    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    const clock = new THREE.Clock();
    let animId = null;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      controls.update();

      reticleRing1.rotation.z += 0.025;
      reticleRing2.rotation.z -= 0.035;
      spiderRadarRingOuter.rotation.z += 0.015;
      spiderRadarRingInner.rotation.z -= 0.02;

      spiderRadarGroup.position.x = spider.position.x;
      spiderRadarGroup.position.z = spider.position.z;

      const corePulse = 1.0 + Math.sin(time * 5.0) * 0.18;
      coreSphere.scale.set(corePulse, corePulse, corePulse);
      spiderCoreLight.intensity = 3.5 + Math.sin(time * 5.0) * 1.8;

      spider.eyeBlinkTimer += delta;
      if (spider.eyeBlinkTimer > 3.8) {
        eyes.forEach(e => {
          e.cornea.scale.y = 0.1;
          e.retina.scale.y = 0.1;
        });
        if (spider.eyeBlinkTimer > 3.95) {
          eyes.forEach(e => {
            e.cornea.scale.y = 1.0;
            e.retina.scale.y = 1.0;
          });
          spider.eyeBlinkTimer = 0.0;
        }
      }

      leftPedipalp.rotation.y = Math.sin(time * 3.2) * 0.14;
      rightPedipalp.rotation.y = -Math.sin(time * 3.2 + 0.4) * 0.14;
      cheliceraL.rotation.z = Math.sin(time * 2.4) * 0.06;
      cheliceraR.rotation.z = -Math.sin(time * 2.4) * 0.06;

      if (spider.recoil > 0.01) {
        spider.recoil = THREE.MathUtils.lerp(spider.recoil, 0, 8.0 * delta);
        spinneretGroup.position.z = -2.85 + spider.recoil * 0.5;
        spinneretGroup.rotation.x = -spider.recoil * 0.35;
      }

      const toTarget = new THREE.Vector3().subVectors(spider.targetPoint, spider.position);
      toTarget.y = 0;
      const targetDist = toTarget.length();

      spider.targetHeading = Math.atan2(toTarget.x, toTarget.z);
      let angleDiff = spider.targetHeading - spider.heading;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;

      spider.heading += angleDiff * Math.min(1.0, 5.2 * delta);

      const deadZone = 1.6;
      const isMoving = targetDist > deadZone;

      if (isMoving) {
        const targetSpeed = Math.min(spider.maxSpeed, (targetDist - deadZone) * 3.6);
        spider.speed = THREE.MathUtils.lerp(spider.speed, targetSpeed, 6.0 * delta);
        const moveDir = new THREE.Vector3(Math.sin(spider.heading), 0, Math.cos(spider.heading));
        spider.velocity.copy(moveDir.multiplyScalar(spider.speed));
        spider.position.add(spider.velocity.clone().multiplyScalar(delta));
        spider.gaitTimer += spider.speed * delta * 5.2;
      } else {
        spider.speed = THREE.MathUtils.lerp(spider.speed, 0, 8.0 * delta);
        spider.velocity.set(0, 0, 0);
      }

      const walkBob = Math.sin(spider.gaitTimer * 2) * 0.12;
      const breathe = Math.sin(time * 2.2) * 0.04;
      spider.group.position.set(spider.position.x, spider.position.y + walkBob + breathe, spider.position.z);
      spider.group.rotation.y = spider.heading;

      bodyGroup.rotation.z = THREE.MathUtils.lerp(bodyGroup.rotation.z, -angleDiff * 0.35, 0.12);
      bodyGroup.rotation.x = THREE.MathUtils.lerp(bodyGroup.rotation.x, (spider.speed / spider.maxSpeed) * 0.08, 0.12);

      spiderCoreLight.position.set(spider.position.x, spider.position.y + 0.5, spider.position.z);

      const gaitPhase = Math.floor(spider.gaitTimer) % 2 === 0;
      spider.legs.forEach((leg, index) => {
        const isSetA = (index === 0 || index === 2 || index === 5 || index === 7);
        const canStep = gaitPhase ? isSetA : !isSetA;
        leg.update(spider.position, spider.heading, spider.velocity, canStep, isMoving);
      });

      for (let i = projectiles.length - 1; i >= 0; i--) {
        projectiles[i].update(delta);
        if (projectiles[i].finished) {
          projectiles.splice(i, 1);
        }
      }

      webs.forEach(w => {
        if (w.scale < 1.0) {
          w.scale = THREE.MathUtils.lerp(w.scale, 1.0, 8.0 * delta);
          w.group.scale.set(w.scale, 1.0, w.scale);
        }
      });

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update(delta);
        if (p.alpha <= 0) {
          p.destroy();
          particles.splice(i, 1);
        }
      }

      const deg = Math.round(((spider.heading * 180 / Math.PI) % 360 + 360) % 360);
      setTelemetry({
        pos: `POS [X:${spider.position.x.toFixed(1)} Z:${spider.position.z.toFixed(1)}]`,
        hdg: `HDG: ${deg.toString().padStart(3, '0')}°`,
        webs: webs.length,
        lock: `LOCK: ${targetDist.toFixed(1)}m`,
        lockVis: targetDist > 1.2
      });

      renderer.render(scene, camera);
    };

    animate();

    // Store refs for external control
    simRef.current = {
      resetCam: () => {
        camera.position.copy(initialCamPos);
        controls.target.set(spider.position.x, 0, spider.position.z);
      },
      focusBody: () => {
        controls.target.set(spider.position.x, spider.position.y + 0.3, spider.position.z);
        camera.position.set(spider.position.x + 5.5, spider.position.y + 4.5, spider.position.z + 7.0);
      },
      clearWebs: () => {
        webs.forEach(w => scene.remove(w.group));
        webs.length = 0;
        setTelemetry(prev => ({ ...prev, webs: 0 }));
      },
      setMaterialMode: (mode) => {
        if (mode === 0) {
          sculptMaterials.forEach(m => { m.wireframe = false; });
          bioLuminousRed.emissiveIntensity = 2.2;
        } else if (mode === 1) {
          sculptMaterials.forEach(m => { m.wireframe = true; });
        } else {
          sculptMaterials.forEach(m => { m.wireframe = false; });
          bioLuminousRed.emissiveIntensity = 4.5;
        }
      }
    };

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      if (interactive) {
        container.removeEventListener('pointermove', handlePointerMove);
        container.removeEventListener('pointerleave', handlePointerLeave);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('click', handleClick);
        window.removeEventListener('keydown', handleKeyDown);
      }
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive, playStepSound, playWebSound, initAudio]);

  // Handle material mode changes
  const toggleInspectMode = () => {
    const nextMode = (inspectMode + 1) % 3;
    setInspectMode(nextMode);
    if (simRef.current) simRef.current.setMaterialMode(nextMode);
  };

  const getInspectModeLabel = () => {
    if (inspectMode === 0) return 'MODE: SCULPT (PBR)';
    if (inspectMode === 1) return 'MODE: WIREFRAME';
    return 'MODE: CYBER GLOW';
  };

  return (
    <div
      className={`cyber-spider-viewport ${className || ''}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '100%',
        overflow: 'hidden',
        background: 'transparent',
        userSelect: 'none'
      }}
    >
      {/* 3D Canvas Mount */}
      <div ref={mountRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} />

      {/* Clean, Minimalist Overlay - Pure 3D Spider Visual Focus */}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          zIndex: 20,
          pointerEvents: 'auto'
        }}
      >
        <button
          type="button"
          onClick={() => {
            initAudio();
            setAudioEnabled(prev => !prev);
          }}
          title="Toggle Synth Audio"
          style={{
            cursor: 'pointer',
            padding: '5px 12px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: '600',
            background: audioEnabled ? 'rgba(16,185,129,0.25)' : 'rgba(0,0,0,0.65)',
            border: `1px solid ${audioEnabled ? '#10b981' : 'rgba(255,255,255,0.18)'}`,
            color: audioEnabled ? '#6ee7b7' : 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <span>{audioEnabled ? '🔊 AUDIO ON' : '🔇 AUDIO'}</span>
        </button>
      </div>

      {/* Subtle Interaction Hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          pointerEvents: 'none',
          fontSize: '10.5px',
          color: 'rgba(255,255,255,0.5)',
          background: 'rgba(0,0,0,0.6)',
          padding: '4px 14px',
          borderRadius: '999px',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap'
        }}
      >
        Move pointer to crawl • Click to throw 3D webs
      </div>
    </div>
  );
}

