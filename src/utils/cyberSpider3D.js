import * as THREE from 'three';

/**
 * Procedural Chitin Normal Map Texture Generator (Exact from cyber_spider_3d.html)
 */
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

/**
 * Creates organic curved tube geometry for biomimetic cyber limb segments
 */
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

/**
 * Inverse Kinematics Leg Class (Exact kinematics from cyber_spider_3d.html)
 * Formats high arched spider knee joint (coxa -> femur -> tibia -> tarsus/claw).
 */
export class SculptedCyberLeg3D {
  constructor(side, mountAngle, mountRadius, l1, l2, l3, index, legScene, materials) {
    this.side = side;
    this.mountAngle = mountAngle;
    this.mountRadius = mountRadius;
    this.l1 = l1;
    this.l2 = l2;
    this.l3 = l3;
    this.index = index;
    this.legScene = legScene;

    this.footPos = new THREE.Vector3();
    this.startFootPos = new THREE.Vector3();
    this.targetFootPos = new THREE.Vector3();
    this.stepProgress = 1.0;

    // 1. Root group (holds coxa and femur)
    this.rootGroup = new THREE.Group();
    legScene.add(this.rootGroup);

    // Coxa Socket
    const coxaSocketGeo = new THREE.SphereGeometry(0.45, 18, 18);
    this.coxaMesh = new THREE.Mesh(coxaSocketGeo, materials.darkSubChassisMat);
    this.rootGroup.add(this.coxaMesh);

    const coxaRing = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.055, 12, 24), materials.bioLuminousRed);
    this.coxaMesh.add(coxaRing);

    // Femur Bone 1 (arches upward and outward to high knee)
    const femurGeo = createSculptedLimbGeometry(this.l1, 0.28, 0.32, 0.22, 0.28);
    this.bone1Mesh = new THREE.Mesh(femurGeo, materials.chitinMaterial);
    this.bone1Mesh.castShadow = true;
    this.rootGroup.add(this.bone1Mesh);

    // Knee 1 joint assembly
    this.knee1 = new THREE.Group();
    this.knee1.position.set(0, this.l1, 0);
    this.bone1Mesh.add(this.knee1);

    const kneeCup = new THREE.Mesh(new THREE.SphereGeometry(0.38, 18, 18), materials.ceramicArmorMaterial);
    this.knee1.add(kneeCup);

    const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 12), materials.sinewMaterial);
    piston.position.set(0, -0.28, -0.15);
    this.knee1.add(piston);

    // Tibia Bone 2 (angles downward from knee 1 to knee 2)
    const tibiaGeo = createSculptedLimbGeometry(this.l2, 0.24, 0.25, 0.15, -0.32);
    this.bone2Mesh = new THREE.Mesh(tibiaGeo, materials.chitinMaterial);
    this.bone2Mesh.castShadow = true;
    legScene.add(this.bone2Mesh);

    // Knee 2 joint
    this.knee2 = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 14), materials.darkSubChassisMat);
    legScene.add(this.knee2);

    // Tarsus / Claw (angles downward to touch floor)
    const clawCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.08, -this.l3 * 0.4, 0.08),
      new THREE.Vector3(0.03, -this.l3 * 0.8, -0.1),
      new THREE.Vector3(0, -this.l3, 0)
    ]);
    const clawGeo = new THREE.TubeGeometry(clawCurve, 16, 0.12, 10, false);
    this.clawMesh = new THREE.Mesh(clawGeo, materials.bioLuminousRed);
    this.clawMesh.castShadow = true;
    legScene.add(this.clawMesh);

    // Floor contact spike
    this.spikeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), materials.ceramicArmorMaterial);
    legScene.add(this.spikeMesh);
  }

  getMountPos(bodyPos, bodyHeading) {
    const theta = bodyHeading + this.mountAngle;
    return new THREE.Vector3(
      bodyPos.x + Math.sin(theta) * this.mountRadius,
      bodyPos.y + 0.05,
      bodyPos.z + Math.cos(theta) * this.mountRadius
    );
  }

  getIdealGroundPos(bodyPos, bodyHeading, spiderVelocity, groundY = 0) {
    const spreadAngle = bodyHeading + (this.mountAngle * 1.32);
    const reach = (this.l1 + this.l2 + this.l3) * 0.72;
    const lead = spiderVelocity ? spiderVelocity.clone().multiplyScalar(0.22) : new THREE.Vector3();

    // Altitude-aware posing: if airborne during descent/retreat, maintain a menacing poised stance
    // relative to the spider body so the legs NEVER invert or point straight into the sky!
    const isAirborne = bodyPos.y > groundY + 1.6;
    const footY = isAirborne ? (bodyPos.y - 1.45) : groundY;

    return new THREE.Vector3(
      bodyPos.x + Math.sin(spreadAngle) * reach + lead.x,
      footY,
      bodyPos.z + Math.cos(spreadAngle) * reach + lead.z
    );
  }

  update(bodyPos, bodyHeading, spiderVelocity, canStep, isMoving, time = 0, onStepCallback = null, groundY = 0) {
    const mount = this.getMountPos(bodyPos, bodyHeading);
    this.rootGroup.position.copy(mount);

    const isAirborne = bodyPos.y > groundY + 1.6;
    const ideal = this.getIdealGroundPos(bodyPos, bodyHeading, spiderVelocity, groundY);

    if (isAirborne) {
      // Natural midair spider leg flexing & twitching while descending on silk
      const twitch = Math.sin(time * 3.5 + this.index * 1.2) * 0.22;
      this.footPos.copy(ideal);
      this.footPos.y += twitch;
    } else {
      const distToIdeal = this.footPos.distanceTo(ideal);
      const threshold = isMoving ? 1.6 : 2.2;

      if (canStep && distToIdeal > threshold && this.stepProgress >= 1.0) {
        this.stepProgress = 0.0;
        this.startFootPos.copy(this.footPos);
        this.targetFootPos.copy(ideal);
        if (onStepCallback) onStepCallback(1.0 + (this.index % 4) * 0.12);
      }

      if (this.stepProgress < 1.0) {
        this.stepProgress += 0.24;
        if (this.stepProgress > 1.0) this.stepProgress = 1.0;
        const t = this.stepProgress;
        this.footPos.lerpVectors(this.startFootPos, this.targetFootPos, t);
        this.footPos.y = groundY + Math.sin(t * Math.PI) * 1.3;
      } else {
        this.footPos.y = groundY;
      }
    }

    // Solve 3-bone IK
    const footRel = new THREE.Vector3().subVectors(this.footPos, mount);
    const planarDist = Math.hypot(footRel.x, footRel.z);
    const effectiveReach = Math.min(footRel.length(), (this.l1 + this.l2 + this.l3) * 0.96);

    const azimuth = Math.atan2(footRel.x, footRel.z);
    const L_upper = this.l1;
    const L_lower = this.l2 + this.l3 * 0.55;

    const cosAlpha = (L_upper * L_upper + effectiveReach * effectiveReach - L_lower * L_lower) / (2 * L_upper * effectiveReach);
    const alpha = Math.acos(Math.min(1, Math.max(-1, cosAlpha)));
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

  dispose() {
    this.legScene.remove(this.rootGroup);
    this.legScene.remove(this.bone2Mesh);
    this.legScene.remove(this.knee2);
    this.legScene.remove(this.clawMesh);
    this.legScene.remove(this.spikeMesh);

    this.bone1Mesh.geometry.dispose();
    this.bone2Mesh.geometry.dispose();
    this.knee2.geometry.dispose();
    this.clawMesh.geometry.dispose();
    this.spikeMesh.geometry.dispose();
  }
}

/**
 * Exact 3D MK-IX Cyber Spider Rig Builder
 */
export function createCyberSpiderRig(options = {}) {
  const scene = options.scene;
  if (!scene) throw new Error("createCyberSpiderRig requires options.scene");
  const scale = options.scale || 1.0;

  // 1. Chitin normal map texture
  const chitinNormalMap = generateChitinTexture();

  // 2. Materials
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

  const materials = {
    chitinNormalMap,
    chitinMaterial,
    ceramicArmorMaterial,
    darkSubChassisMat,
    sinewMaterial,
    bioLuminousRed,
    eyeLensGlass
  };

  // 3. Spider state and groups
  const group = new THREE.Group();
  group.scale.set(scale, scale, scale);
  scene.add(group);

  const spider = {
    group,
    scene,
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
    eyes: [],
    webProjectiles: [],
    webs: [],
    materials
  };

  const bodyGroup = new THREE.Group();
  group.add(bodyGroup);

  // ------------------------------------------------ ABDOMEN
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
  spider.coreSphere = coreSphere;

  const coreLight = new THREE.PointLight(0xff2244, 4.0, 16, 1.8);
  coreLight.position.set(0, 0.84, 0.08);
  abdomenGroup.add(coreLight);
  spider.coreLight = coreLight;

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
  spider.spinneret = spinneretGroup;
  spider.nozzleRing = nozzleRing;

  // ------------------------------------------------ CEPHALOTHORAX (HEAD)
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

  // Multi-Lens Ocular Cluster
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

    spider.eyes.push({ holder: eyeHolder, retina, cornea, isPrimary: idx < 2 });
  });

  // Chelicerae (Fangs)
  function createSculptedFang(side) {
    const fGroup = new THREE.Group();
    fGroup.position.set(side * 0.42, -0.15, 1.62);

    const baseGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.65, 16);
    baseGeo.rotateX(Math.PI / 4);
    const baseMesh = new THREE.Mesh(baseGeo, darkSubChassisMat);
    fGroup.add(baseMesh);

    const fangCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0.26),
      new THREE.Vector3(0, -0.26, 0.4),
      new THREE.Vector3(-side * 0.12, -0.66, 0.5),
      new THREE.Vector3(-side * 0.21, -1.0, 0.34)
    ]);
    const fangGeo = new THREE.TubeGeometry(fangCurve, 20, 0.11, 12, false);
    const fangMesh = new THREE.Mesh(fangGeo, chitinMaterial);
    fGroup.add(fangMesh);

    const tipGlow = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), bioLuminousRed);
    tipGlow.position.set(-side * 0.21, -1.0, 0.34);
    fGroup.add(tipGlow);

    return fGroup;
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

  // ------------------------------------------------ 8 BIOMIMETIC LEGS (EXACT CONFIGS)
  const legConfigs = [
    { side: -1, angle: -0.62, radius: 1.5, l1: 2.5, l2: 2.6, l3: 1.7 }, // L-Front
    { side: -1, angle: -1.22, radius: 1.4, l1: 2.6, l2: 2.7, l3: 1.8 }, // L-Mid1
    { side: -1, angle: -1.82, radius: 1.5, l1: 2.7, l2: 2.8, l3: 1.9 }, // L-Mid2
    { side: -1, angle: -2.42, radius: 1.7, l1: 3.0, l2: 3.1, l3: 2.0 }, // L-Rear
    { side:  1, angle:  0.62, radius: 1.5, l1: 2.5, l2: 2.6, l3: 1.7 }, // R-Front
    { side:  1, angle:  1.22, radius: 1.4, l1: 2.6, l2: 2.7, l3: 1.8 }, // R-Mid1
    { side:  1, angle:  1.82, radius: 1.5, l1: 2.7, l2: 2.8, l3: 1.9 }, // R-Mid2
    { side:  1, angle:  2.42, radius: 1.7, l1: 3.0, l2: 3.1, l3: 2.0 }  // R-Rear
  ];

  legConfigs.forEach((cfg, idx) => {
    const leg = new SculptedCyberLeg3D(
      cfg.side,
      cfg.angle,
      cfg.radius,
      cfg.l1,
      cfg.l2,
      cfg.l3,
      idx,
      scene,
      materials
    );
    const initialIdeal = leg.getIdealGroundPos(spider.position, spider.heading, new THREE.Vector3(), 0);
    leg.footPos.copy(initialIdeal);
    spider.legs.push(leg);
  });

  // ------------------------------------------------ SLEEK HIGH-TECH CYBER-SILK (NO CARTOON WEBS)
  class WebProjectile3D {
    constructor(origin, target, targetScene) {
      this.start = origin.clone();
      this.target = target.clone();
      this.target.y = 0.05;
      this.current = origin.clone();
      this.speed = 52;
      this.finished = false;
      this.scene = targetScene;

      this.totalDist = this.start.distanceTo(this.target) || 1;
      this.dir = new THREE.Vector3().subVectors(this.target, this.start).normalize();

      const geo = new THREE.BufferGeometry().setFromPoints([this.start, this.current]);
      const mat = new THREE.LineBasicMaterial({ color: 0x00e5ff, linewidth: 2, transparent: true, opacity: 0.95 });
      this.line = new THREE.Line(geo, mat);
      targetScene.add(this.line);

      this.sparkMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      targetScene.add(this.sparkMesh);
    }

    update(delta) {
      const step = this.speed * delta;
      this.current.add(this.dir.clone().multiplyScalar(step));
      this.sparkMesh.position.copy(this.current);
      this.line.geometry.setFromPoints([this.start, this.current]);

      if (this.current.distanceTo(this.start) >= this.totalDist) {
        this.finished = true;
        this.destroy();
        spider.create3DWeb(this.target, this.start);
      }
    }

    destroy() {
      this.scene.remove(this.line);
      this.scene.remove(this.sparkMesh);
      this.line.geometry.dispose();
      this.sparkMesh.geometry.dispose();
    }
  }

  spider.create3DWeb = function () {
    // No cartoon static webs on the floor! Clean, cinematic locomotion only.
  };

  spider.fireWeb = function (targetPos) {
    spider.recoil = 1.0;
    const nozzleWorld = new THREE.Vector3();
    if (spider.nozzleRing) {
      spider.nozzleRing.getWorldPosition(nozzleWorld);
    } else {
      nozzleWorld.copy(spider.position);
    }
    const proj = new WebProjectile3D(nozzleWorld, targetPos, scene);
    spider.webProjectiles.push(proj);
    return proj;
  };

  // ------------------------------------------------ SPIDER UPDATE CYCLE
  spider.update = function (delta, time, walkSpeed = 0, targetHeading = 0, onStepCallback = null) {
    // 1. Heading interpolation
    spider.targetHeading = targetHeading;
    let angleDiff = spider.targetHeading - spider.heading;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    spider.heading += angleDiff * Math.min(1.0, 5.2 * delta);

    // 2. Position & Group Transformation
    spider.gaitTimer += walkSpeed * delta * 5.2;
    const walkBob = Math.sin(spider.gaitTimer * 2) * 0.12;
    const breathe = Math.sin(time * 2.2) * 0.04;

    spider.group.position.set(spider.position.x, spider.position.y + walkBob + breathe, spider.position.z);
    spider.group.rotation.y = spider.heading;

    bodyGroup.rotation.z = THREE.MathUtils.lerp(bodyGroup.rotation.z, -angleDiff * 0.35, 0.12);
    bodyGroup.rotation.x = THREE.MathUtils.lerp(bodyGroup.rotation.x, (walkSpeed / spider.maxSpeed) * 0.08, 0.12);

    // 3. Reactor & light pulse
    const corePulse = 1.0 + Math.sin(time * 5.0) * 0.18;
    coreSphere.scale.set(corePulse, corePulse, corePulse);
    coreLight.intensity = 3.5 + Math.sin(time * 5.0) * 1.8;

    // 4. Eye blinking
    spider.eyeBlinkTimer += delta;
    if (spider.eyeBlinkTimer > 3.8) {
      spider.eyes.forEach(e => {
        e.cornea.scale.y = 0.1;
        e.retina.scale.y = 0.1;
      });
      if (spider.eyeBlinkTimer > 3.95) {
        spider.eyes.forEach(e => {
          e.cornea.scale.y = 1.0;
          e.retina.scale.y = 1.0;
        });
        spider.eyeBlinkTimer = 0.0;
      }
    }

    // 5. Palps & Chelicerae twitching
    leftPedipalp.rotation.y = Math.sin(time * 3.2) * 0.14;
    rightPedipalp.rotation.y = -Math.sin(time * 3.2 + 0.4) * 0.14;
    cheliceraL.rotation.z = Math.sin(time * 2.4) * 0.06;
    cheliceraR.rotation.z = -Math.sin(time * 2.4) * 0.06;

    // 6. Recoil from web firing
    if (spider.recoil > 0.01) {
      spider.recoil = THREE.MathUtils.lerp(spider.recoil, 0, 8.0 * delta);
      spinneretGroup.position.z = -2.85 + spider.recoil * 0.5;
      spinneretGroup.rotation.x = -spider.recoil * 0.35;
    }

    // 7. Biomimetic Alternating Gait Leg Stepping
    const gaitPhase = Math.floor(spider.gaitTimer) % 2 === 0;
    const isMoving = walkSpeed > 0.2;

    spider.legs.forEach((leg, index) => {
      const isSetA = (index === 0 || index === 2 || index === 5 || index === 7);
      const canStep = gaitPhase ? isSetA : !isSetA;
      leg.update(
        spider.position,
        spider.heading,
        spider.velocity,
        canStep,
        isMoving,
        time,
        onStepCallback,
        0 // ground level
      );
    });

    // 8. Update Web Projectiles
    for (let i = spider.webProjectiles.length - 1; i >= 0; i--) {
      spider.webProjectiles[i].update(delta);
      if (spider.webProjectiles[i].finished) {
        spider.webProjectiles.splice(i, 1);
      }
    }

    // 9. Update Web expansion
    spider.webs.forEach(w => {
      if (w.scale < 1.0) {
        w.scale = THREE.MathUtils.lerp(w.scale, 1.0, 8.0 * delta);
        w.group.scale.set(w.scale, 1.0, w.scale);
      }
    });
  };

  spider.dispose = function () {
    spider.legs.forEach(leg => leg.dispose());
    spider.webProjectiles.forEach(p => p.destroy());
    spider.webs.forEach(w => scene.remove(w.group));

    scene.remove(group);
    chitinNormalMap.dispose();
    chitinMaterial.dispose();
    ceramicArmorMaterial.dispose();
    darkSubChassisMat.dispose();
    sinewMaterial.dispose();
    bioLuminousRed.dispose();
    eyeLensGlass.dispose();
  };

  return spider;
}

// ------------------------------------------------ AUTHENTIC SPIDER-MAN MULTI-FILAMENT SILK & PERSISTENT ANCHOR WEBS
class PersistentAnchorWeb {
  constructor(scene, position, normal, color = 0x00f0ff, baseRadius = 5.6) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.copy(position);

    // Orient facing camera/viewer so the entire 360-degree radial spiderweb is directly visible on screen!
    const faceVector = new THREE.Vector3(0, 0.25, 0.97).normalize();
    this.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), faceVector);

    this.scene.add(this.group);
    this.scale = 0.05;
    this.targetScale = 1.0;
    this.opacity = 1.0;
    this.isFading = false;
    this.isDisposed = false;

    // 1. Spoke lines and catenary curved spiral rings
    const spokeCount = 20;
    const ringLevels = [1.2, 2.6, 4.4, 6.4];
    const points = [new THREE.Vector3(0, 0, 0)]; // hub index 0
    const indices = [];

    // Outer spokes with organic wavy jitter
    for (let s = 0; s < spokeCount; s++) {
      const angle = (s / spokeCount) * Math.PI * 2;
      const r = baseRadius * (0.90 + Math.sin(s * 2.8) * 0.16);
      const z = Math.cos(s * 1.9) * 0.25 - 0.1;
      points.push(new THREE.Vector3(Math.cos(angle) * r, Math.sin(angle) * r, z));
      indices.push(0, s + 1); // radial spoke from hub
    }

    // Concentric spiral rings with catenary droop between spokes
    for (let rIdx = 0; rIdx < ringLevels.length; rIdx++) {
      const ringRadius = ringLevels[rIdx];

      for (let s = 0; s < spokeCount; s++) {
        const nextS = (s + 1) % spokeCount;
        const angleA = (s / spokeCount) * Math.PI * 2;
        const angleB = (nextS / spokeCount) * Math.PI * 2;

        // 3 points per sector to form realistic catenary sag
        const p1 = new THREE.Vector3(Math.cos(angleA) * ringRadius, Math.sin(angleA) * ringRadius, 0.02 * rIdx);
        // Midpoint sagged inward (16% droop)
        const midAngle = (angleA + (nextS === 0 ? angleA + (Math.PI * 2) / spokeCount : angleB)) / 2;
        const sagRadius = ringRadius * 0.84;
        const pMid = new THREE.Vector3(Math.cos(midAngle) * sagRadius, Math.sin(midAngle) * sagRadius, 0.02 * rIdx - 0.05);
        const p2 = new THREE.Vector3(Math.cos(angleB) * ringRadius, Math.sin(angleB) * ringRadius, 0.02 * rIdx);

        const idx1 = points.length;
        points.push(p1, pMid, p2);
        indices.push(idx1, idx1 + 1, idx1 + 1, idx1 + 2);
      }
    }

    // 16 Micro-Anchor Barbs / Tendrils radiating outward
    const barbCount = 16;
    for (let b = 0; b < barbCount; b++) {
      const angle = (b / barbCount) * Math.PI * 2 + 0.12;
      const rInner = baseRadius * 0.90;
      const rOuter = baseRadius * (1.28 + Math.sin(b * 3.7) * 0.24);
      const pStart = new THREE.Vector3(Math.cos(angle) * rInner, Math.sin(angle) * rInner, 0);
      const pEnd = new THREE.Vector3(Math.cos(angle + 0.1) * rOuter, Math.sin(angle + 0.1) * rOuter, -0.2);
      const bIdx = points.length;
      points.push(pStart, pEnd);
      indices.push(bIdx, bIdx + 1);
    }

    this.geo = new THREE.BufferGeometry().setFromPoints(points);
    this.geo.setIndex(indices);

    this.mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.96,
      blending: THREE.AdditiveBlending,
      linewidth: 1.8
    });

    this.mesh = new THREE.LineSegments(this.geo, this.mat);
    this.group.add(this.mesh);

    // Luminous Impact Central Hub
    const hubGeo = new THREE.CircleGeometry(0.75, 20);
    this.hubMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending
    });
    this.hubMesh = new THREE.Mesh(hubGeo, this.hubMat);
    this.hubMesh.position.z = 0.04;
    this.group.add(this.hubMesh);

    // Expanding Impact Shockwave Ring
    const shockGeo = new THREE.RingGeometry(0.4, 0.95, 24);
    this.shockMat = new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    this.shockMesh = new THREE.Mesh(shockGeo, this.shockMat);
    this.shockMesh.position.z = 0.05;
    this.group.add(this.shockMesh);

    this.group.scale.set(0.05, 0.05, 0.05);
  }

  update(delta) {
    if (this.isDisposed) return false;

    // Elastic spring outward expansion on impact
    if (this.scale < this.targetScale) {
      this.scale = THREE.MathUtils.lerp(this.scale, this.targetScale, 16.0 * delta);
      if (Math.abs(this.scale - this.targetScale) < 0.01) this.scale = this.targetScale;
      this.group.scale.set(this.scale, this.scale, this.scale);
    }

    // Shockwave expansion & dissipation
    if (this.shockMat.opacity > 0) {
      this.shockMesh.scale.multiplyScalar(1.0 + delta * 6.5);
      this.shockMat.opacity = Math.max(0, this.shockMat.opacity - delta * 3.2);
    }

    // Central hub flash fade
    if (this.hubMat.opacity > 0.4) {
      this.hubMat.opacity = Math.max(0.4, this.hubMat.opacity - delta * 4.0);
    }

    // Fading out after release
    if (this.isFading) {
      this.opacity -= delta * 0.45; // ~2.2s fadeout
      if (this.opacity <= 0.02) {
        this.dispose();
        return false;
      }
      this.mat.opacity = this.opacity;
      this.hubMat.opacity = this.opacity * 0.4;
      this.shockMat.opacity = Math.min(this.shockMat.opacity, this.opacity);
    }

    return true;
  }

  startFade() {
    this.isFading = true;
  }

  dispose() {
    if (this.isDisposed) return;
    this.isDisposed = true;
    this.scene.remove(this.group);
    this.geo.dispose();
    this.mat.dispose();
    this.hubMesh.geometry.dispose();
    this.hubMat.dispose();
    this.shockMesh.geometry.dispose();
    this.shockMat.dispose();
  }
}

class ActiveWebSling {
  constructor(targetScene) {
    this.scene = targetScene;
    this.origin = new THREE.Vector3();
    this.target = new THREE.Vector3();
    this.tip = new THREE.Vector3();
    this.active = false;
    this.isShooting = false;
    this.shootProgress = 0;
    this.shootSpeed = 2.4; // Controlled, cinematic web discharge (~0.42s)
    this.time = 0;
    this.colorHex = 0x00f0ff;

    // Anchor Webs management
    this.anchorWebs = [];
    this.currentAnchorWeb = null;

    // Cable Group
    this.cableGroup = new THREE.Group();
    this.scene.add(this.cableGroup);

    // 8 Braided micro-strands + 1 luminous core strand
    this.strands = [];
    const strandCount = 9;
    const sampleCount = 36;

    for (let i = 0; i < strandCount; i++) {
      const geo = new THREE.BufferGeometry();
      const posArr = new Float32Array(sampleCount * 3);
      geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));

      const isCore = i === 0;
      const mat = new THREE.LineBasicMaterial({
        color: isCore ? 0xffffff : 0x00f0ff,
        transparent: true,
        opacity: isCore ? 1.0 : 0.85,
        blending: THREE.AdditiveBlending,
        linewidth: isCore ? 2.5 : 1
      });
      const line = new THREE.Line(geo, mat);
      line.visible = false;
      this.cableGroup.add(line);
      this.strands.push({
        line,
        geo,
        posArr,
        mat,
        phase: (i / (strandCount - 1)) * Math.PI * 2,
        radius: isCore ? 0 : 0.28,
        freq: 6 + (i % 3) * 3
      });
    }

    // Cross-connecting micro-fibers along the cable
    this.crossGeo = new THREE.BufferGeometry();
    const crossPosArr = new Float32Array(24 * 2 * 3);
    this.crossGeo.setAttribute('position', new THREE.BufferAttribute(crossPosArr, 3));
    this.crossMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    this.crossMesh = new THREE.LineSegments(this.crossGeo, this.crossMat);
    this.crossMesh.visible = false;
    this.cableGroup.add(this.crossMesh);
    this.crossPosArr = crossPosArr;
  }

  shoot(originPos, targetPos, color = 0x00f0ff) {
    this.origin.copy(originPos);
    this.target.copy(targetPos);
    this.tip.copy(originPos);
    this.active = true;
    this.isShooting = true;
    this.shootProgress = 0;
    this.time = 0;
    this.colorHex = color;

    // Update strand colors (core white, perimeter alternating theme color)
    this.strands.forEach((s, idx) => {
      s.mat.color.setHex(idx === 0 ? 0xffffff : color);
      s.mat.opacity = idx === 0 ? 1.0 : 0.85;
      s.line.visible = true;
    });
    this.crossMat.color.setHex(color);
    this.crossMesh.visible = true;

    // Release old active anchor web if any to let it fade
    if (this.currentAnchorWeb) {
      this.currentAnchorWeb.startFade();
      this.currentAnchorWeb = null;
    }
  }

  update(delta, currentOrigin) {
    this.time += delta;
    this.origin.copy(currentOrigin);

    // Update existing persistent anchor webs
    for (let i = this.anchorWebs.length - 1; i >= 0; i--) {
      const alive = this.anchorWebs[i].update(delta);
      if (!alive) {
        this.anchorWebs.splice(i, 1);
      }
    }

    if (!this.active) return;

    if (this.isShooting) {
      this.shootProgress += delta * this.shootSpeed;
      if (this.shootProgress >= 1.0) {
        this.shootProgress = 1.0;
        this.isShooting = false;

        // IMPACT! Spawn spreading anchor web
        const toTarget = new THREE.Vector3().subVectors(this.target, this.origin).normalize();
        const normal = toTarget.clone().negate();
        const anchor = new PersistentAnchorWeb(this.scene, this.target, normal, this.colorHex, 6.8);
        this.anchorWebs.push(anchor);
        this.currentAnchorWeb = anchor;
      }
      this.tip.lerpVectors(this.origin, this.target, this.shootProgress);
    } else {
      this.tip.copy(this.target);
    }

    // Dynamic cable line geometry with helical braiding & conical anchor flare!
    const dir = new THREE.Vector3().subVectors(this.tip, this.origin);
    const normDir = dir.clone().normalize();
    const up = Math.abs(normDir.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    const perp1 = new THREE.Vector3().crossVectors(normDir, up).normalize();
    const perp2 = new THREE.Vector3().crossVectors(normDir, perp1).normalize();

    const sampleCount = 36;
    const strandPts = [];

    for (let k = 0; k < this.strands.length; k++) {
      const strand = this.strands[k];
      const pos = strand.posArr;
      const pts = [];

      for (let s = 0; s < sampleCount; s++) {
        const t = s / (sampleCount - 1);
        const pt = new THREE.Vector3().lerpVectors(this.origin, this.tip, t);

        if (k > 0) {
          // Braid twisting
          const braidAngle = strand.phase + t * strand.freq * Math.PI + this.time * 5.0;
          let r = strand.radius;

          // Flare into wide trumpet cone near anchor point (matching user reference!)
          if (t > 0.60) {
            const flareT = (t - 0.60) / 0.40;
            r += Math.pow(flareT, 1.8) * 3.6;
          }

          const offX = perp1.x * Math.cos(braidAngle) * r + perp2.x * Math.sin(braidAngle) * r;
          const offY = perp1.y * Math.cos(braidAngle) * r + perp2.y * Math.sin(braidAngle) * r;
          const offZ = perp1.z * Math.cos(braidAngle) * r + perp2.z * Math.sin(braidAngle) * r;
          pt.x += offX; pt.y += offY; pt.z += offZ;
        }

        pos[s * 3] = pt.x;
        pos[s * 3 + 1] = pt.y;
        pos[s * 3 + 2] = pt.z;
        pts.push(pt);
      }
      strand.geo.attributes.position.needsUpdate = true;
      strandPts.push(pts);
    }

    // Cross-connecting micro-fibers along the cable
    if (strandPts.length > 2) {
      const crossPos = this.crossPosArr;
      let crossIdx = 0;
      const crossRings = 12;

      for (let cr = 0; cr < crossRings; cr++) {
        const sampleIdx = Math.floor(4 + (cr / crossRings) * (sampleCount - 10));
        const sA = 1 + (cr % (this.strands.length - 1));
        const sB = 1 + ((cr + 1) % (this.strands.length - 1));
        const ptA = strandPts[sA][sampleIdx];
        const ptB = strandPts[sB][sampleIdx];

        if (ptA && ptB && crossIdx < crossPos.length - 6) {
          crossPos[crossIdx++] = ptA.x;
          crossPos[crossIdx++] = ptA.y;
          crossPos[crossIdx++] = ptA.z;
          crossPos[crossIdx++] = ptB.x;
          crossPos[crossIdx++] = ptB.y;
          crossPos[crossIdx++] = ptB.z;
        }
      }
      this.crossGeo.attributes.position.needsUpdate = true;
    }
  }

  release() {
    this.isShooting = false;
    this.active = false;
    this.strands.forEach(s => (s.line.visible = false));
    this.crossMesh.visible = false;
    if (this.currentAnchorWeb) {
      this.currentAnchorWeb.startFade();
      this.currentAnchorWeb = null;
    }
  }

  dispose() {
    this.release();
    this.strands.forEach(s => {
      s.geo.dispose();
      s.mat.dispose();
      this.cableGroup.remove(s.line);
    });
    this.crossGeo.dispose();
    this.crossMat.dispose();
    this.cableGroup.remove(this.crossMesh);
    this.scene.remove(this.cableGroup);

    this.anchorWebs.forEach(w => w.dispose());
    this.anchorWebs = [];
  }
}

/**
 * Mounts the Giant 3D Mother Queen Spider inside Swarm Rebuild.
 * Fullscreen perspective with:
 * - 3D Silk tether descent with organic midair leg flexing
 * - Accurate 3-bone biomimetic leg spread and articulation (legs NEVER point up!)
 * - High-tech laser tether web anchors (no cartoon spiderwebs)
 * - Reactor core flaring with crimson overdrive + triggering Swarm Birth
 * - Active Patrol Crawling across the viewport during the rebuild tour
 * - Retreat & Trapping sequence: scuttles into the Hero containment vault when complete!
 */
export function mount3DCyberSpiderQueen(containerEl, onSwarmBirth) {
  if (!containerEl) return null;

  const w = window.innerWidth;
  const h = window.innerHeight;

  // Scene & Camera matching full-screen dynamic perspective
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 400);
  camera.position.set(0, 32, 34);
  camera.lookAt(0, 1.2, 0);
  const currentCamLook = new THREE.Vector3(0, 1.2, 0);

  // Transparent WebGL Renderer covering full screen
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100vw';
  renderer.domElement.style.height = '100vh';
  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.inset = '0';
  renderer.domElement.style.pointerEvents = 'none';
  containerEl.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x0b111c, 2.5);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 2.2);
  mainLight.position.set(20, 40, 25);
  mainLight.castShadow = true;
  scene.add(mainLight);

  const rimLightBlue = new THREE.DirectionalLight(0x00e5ff, 2.0);
  rimLightBlue.position.set(-28, 20, -25);
  scene.add(rimLightBlue);

  const rimLightRed = new THREE.DirectionalLight(0xff1e42, 2.6);
  rimLightRed.position.set(22, -6, -20);
  scene.add(rimLightRed);

  // Floor Hologram Radar Rings
  const radarGroup = new THREE.Group();
  radarGroup.position.set(0, 0.02, 0);
  scene.add(radarGroup);

  const ringGeo1 = new THREE.RingGeometry(3.6, 3.75, 48);
  const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xff2a4b, side: THREE.DoubleSide, transparent: true, opacity: 0.65 });
  const radarRing1 = new THREE.Mesh(ringGeo1, ringMat1);
  radarRing1.rotation.x = -Math.PI / 2;
  radarGroup.add(radarRing1);

  const ringGeo2 = new THREE.RingGeometry(6.2, 6.36, 64);
  const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x00e5ff, side: THREE.DoubleSide, transparent: true, opacity: 0.45 });
  const radarRing2 = new THREE.Mesh(ringGeo2, ringMat2);
  radarRing2.rotation.x = -Math.PI / 2;
  radarGroup.add(radarRing2);

  // Ceiling Cyber-Silk Tether Line
  const silkGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 40, -2.1),
    new THREE.Vector3(0, 16, -2.1)
  ]);
  const silkMat = new THREE.LineBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.95,
    linewidth: 2.5
  });
  const silkLine = new THREE.Line(silkGeo, silkMat);
  scene.add(silkLine);

  // Birth Shockwave Ring
  const shockwaveGeo = new THREE.RingGeometry(0.5, 0.75, 48);
  const shockwaveMat = new THREE.MeshBasicMaterial({ color: 0xff2a4b, side: THREE.DoubleSide, transparent: true, opacity: 0 });
  const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat);
  shockwaveMesh.rotation.x = -Math.PI / 2;
  shockwaveMesh.position.y = 0.03;
  scene.add(shockwaveMesh);

  // Construct Exact MK-IX Cyber Spider Rig
  const spider = createCyberSpiderRig({ scene, scale: 1.0 });
  spider.position.set(0, 15.0, 0);

  // Timeline variables
  let clock = new THREE.Clock();
  let timeTotal = 0;
  let hasLanded = false;
  let hasFiredWebs = false;
  let hasBirthedSwarm = false;
  let shockwaveScale = 1.0;
  let shockwaveActive = false;
  let animId = null;

  // Active Patrol Crawl state
  const patrolWaypoints = [
    new THREE.Vector3(-8.5, 1.45, -2.0),
    new THREE.Vector3(-4.0, 1.45, 4.5),
    new THREE.Vector3(6.5, 1.45, 3.5),
    new THREE.Vector3(9.5, 1.45, -2.5),
    new THREE.Vector3(2.0, 1.45, -5.5),
    new THREE.Vector3(-6.0, 1.45, -4.0),
  ];
  let currentWaypointIndex = 0;
  let waypointPauseTimer = 0;

  // Active Web-Slinging Locomotion State (Single Navbar Ascent -> Scroll to Top -> Container Dive & Dock)
  const activeSlingWeb = new ActiveWebSling(scene);
  let isWebSlinging = false;
  let webSlingOpts = null;
  let trappingScale = 1.0;
  let currentStageIndex = 0;
  let stageTimer = 0;
  let stage6Timer = 0;
  let stageShootDone = false;
  let stageOrigin = new THREE.Vector3();
  let stageTarget = new THREE.Vector3();
  let stageAnchor = new THREE.Vector3();
  let startScrollSnapshot = 0;

  const slingStages = [
    {
      id: 1,
      isNavAscent: true,
      dip: 0.5,
      color: 0x00f0ff, // Electric Cyan silk tether to Navbar
      scrollPct: 0.0,  // Scrolls 100% smoothly to top (scrollY = 0)
      bank: 0.0,
      duration: 2.3,   // Deliberate, smooth upward reel
      status: "ENGAGING TITAN WEB-PROPULSION // TETHERED TO NAVBAR // REELING TO APEX..."
    },
    {
      id: 2,
      isFinalDive: true,
      dip: 0.35,
      color: 0xef4151, // Crimson web guide to Hero container
      scrollPct: 0.0,
      bank: 0.0,
      duration: 1.4,   // Graceful dive into portrait frame
      status: "TARGET ACQUIRED // DOCKING WITH HERO CONTAINMENT MATRIX..."
    }
  ];

  function startSwingStage(idx) {
    currentStageIndex = idx;
    stageTimer = 0;
    stageShootDone = false;
    stageOrigin.copy(spider.position);

    const stageCfg = slingStages[idx];
    if (stageCfg.isNavAscent) {
      // 1. Raycast to find exact 3D position of Navbar on screen
      const navEl = document.querySelector('.site-header') || document.querySelector('header');
      let navScreenX = window.innerWidth * 0.5;
      let navScreenY = 32; // Navbar vertical center
      if (navEl) {
        const nr = navEl.getBoundingClientRect();
        navScreenX = nr.left + nr.width * 0.5;
        navScreenY = Math.max(22, nr.top + nr.height * 0.5);
      }
      const ndcX = (navScreenX / window.innerWidth) * 2 - 1;
      const ndcY = -(navScreenY / window.innerHeight) * 2 + 1;
      const ray = new THREE.Raycaster();
      ray.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
      const navPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 8.0); // Z = -8
      const hit = new THREE.Vector3();
      const intersect = ray.ray.intersectPlane(navPlane, hit);
      const navAnchorPos = intersect ? hit : new THREE.Vector3(0, 21.0, -8.0);

      stageAnchor.copy(navAnchorPos);
      // Target position: spider reels up toward the navbar, reaching upper midfield
      stageTarget.set(0, 10.5, -6.5);
    } else if (stageCfg.isFinalDive) {
      // Find portrait frame in Hero section via raycast
      const sx = (webSlingOpts && webSlingOpts.targetScreenX) || (window.innerWidth * 0.72);
      const sy = (webSlingOpts && webSlingOpts.targetScreenY) || (window.innerHeight * 0.38);
      const ndcX = (sx / window.innerWidth) * 2 - 1;
      const ndcY = -(sy / window.innerHeight) * 2 + 1;
      const ray = new THREE.Raycaster();
      ray.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
      const portraitPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -2.2);
      const hit = new THREE.Vector3();
      const intersect = ray.ray.intersectPlane(portraitPlane, hit);
      const pointD = intersect ? hit : new THREE.Vector3(7.6, 2.2, -4.2);

      stageAnchor.copy(pointD);
      stageTarget.copy(pointD);
    } else {
      stageAnchor.copy(stageCfg.anchor);
      stageTarget.copy(stageCfg.target);
    }

    // Shoot the braided multi-filament silk line!
    activeSlingWeb.shoot(spider.position, stageAnchor, stageCfg.color);
    if (webSlingOpts && typeof webSlingOpts.onThwip === 'function') {
      webSlingOpts.onThwip();
    }
    if (webSlingOpts && typeof webSlingOpts.onStatus === 'function') {
      webSlingOpts.onStatus(stageCfg.status);
    }
  }

  function startSling(options) {
    webSlingOpts = options || {};
    isWebSlinging = true;
    trappingScale = 1.0;
    stage6Timer = 0;
    startScrollSnapshot = (webSlingOpts && typeof webSlingOpts.startScrollY === 'number')
      ? webSlingOpts.startScrollY
      : (window.scrollY || 0);
    startSwingStage(0);
  }

  const onWindowResize = () => {
    const curW = window.innerWidth;
    const curH = window.innerHeight;
    camera.aspect = curW / curH;
    camera.updateProjectionMatrix();
    renderer.setSize(curW, curH);
  };
  window.addEventListener('resize', onWindowResize);

  function renderLoop() {
    animId = requestAnimationFrame(renderLoop);
    const delta = Math.min(clock.getDelta(), 0.05);
    timeTotal += delta;

    radarRing1.rotation.z += delta * 0.6;
    radarRing2.rotation.z -= delta * 0.4;

    // ------------------------------------ TIMELINE PHASES:
    // Phase 1: Silk Descent (0.0s - 1.25s)
    if (timeTotal < 1.25) {
      const t = timeTotal / 1.25;
      const easeT = 1 - Math.pow(1 - t, 3);
      spider.position.y = THREE.MathUtils.lerp(15.0, 1.45, easeT);
      spider.update(delta, timeTotal, 2.5, 0);
    }
    // Phase 2: Touchdown & Scanning (1.25s - 2.1s)
    else if (timeTotal < 2.1) {
      if (!hasLanded) {
        hasLanded = true;
        shockwaveActive = true;
        shockwaveScale = 1.0;
      }
      spider.position.y = 1.45;
      const scanHeading = Math.sin((timeTotal - 1.25) * 3.5) * 0.35;
      spider.update(delta, timeTotal, 0.8, scanHeading);
    }
    // Phase 3: Core Charge Priming (2.1s - 2.7s) - Clean, high-tech, NO static floor webs!
    else if (timeTotal < 2.7) {
      spider.position.y = 1.45;
      spider.update(delta, timeTotal, 0.2, 0);
      if (spider.coreLight) spider.coreLight.intensity = 10.0 + Math.sin(timeTotal * 16.0) * 4.0;
    }
    // Phase 4: Crimson Reactor Overdrive & Swarm Birth (2.7s - 3.4s)
    else if (timeTotal < 3.4) {
      spider.position.y = 1.45;
      spider.update(delta, timeTotal, 0.1, 0);

      if (!hasBirthedSwarm) {
        hasBirthedSwarm = true;
        shockwaveActive = true;
        shockwaveScale = 1.0;
        if (spider.coreLight) spider.coreLight.intensity = 18.0;
        if (spider.coreSphere) spider.coreSphere.scale.set(1.9, 1.9, 1.9);

        if (typeof onSwarmBirth === 'function') {
          onSwarmBirth();
        }
      }
    }
    // Phase 5: Dynamic Locomotion (Web-Slinging or Active Patrol Crawling)
    else {
      if (isWebSlinging) {
        // Fade out floor radar rings smoothly during flight
        ringMat1.opacity = THREE.MathUtils.lerp(ringMat1.opacity, 0.0, 6.0 * delta);
        ringMat2.opacity = THREE.MathUtils.lerp(ringMat2.opacity, 0.0, 6.0 * delta);
        if (ringMat1.opacity < 0.02) radarGroup.visible = false;

        // Smoothly adjust camera to dynamic angle so all web anchors remain 100% inside viewport
        const targetCamPos = window.__targetCamPos || new THREE.Vector3(0, 20.0, 32.0);
        const targetCamLook = window.__targetCamLook || new THREE.Vector3(0, 7.2, -6.0);
        camera.position.lerp(targetCamPos, 6.0 * delta);
        currentCamLook.lerp(targetCamLook, 6.0 * delta);
        camera.lookAt(currentCamLook);

        if (currentStageIndex < slingStages.length) {
          const stageCfg = slingStages[currentStageIndex];
          stageTimer += delta;

          // Phase 1: Web shooting & latching
          if (activeSlingWeb.isShooting) {
            activeSlingWeb.update(delta, spider.position);

            // Aiming while shooting: BACK FACES TOWARDS CAMERA, head points UP toward anchor
            const toAnchor = new THREE.Vector3().subVectors(stageAnchor, spider.position);
            const aimHeading = typeof window.__targetHeading === 'number' ? window.__targetHeading : Math.atan2(toAnchor.x, 8.0);
            const shootPitch = typeof window.__targetPitch === 'number' ? window.__targetPitch : -1.45;
            spider.group.rotation.x = THREE.MathUtils.lerp(spider.group.rotation.x, shootPitch, 8.0 * delta);
            spider.group.rotation.z = THREE.MathUtils.lerp(spider.group.rotation.z, stageCfg.bank * 0.25, 8.0 * delta);
            spider.update(delta, timeTotal, 2.5, aimHeading);
          } else {
            // Phase 2: Web has latched and splayed open! Taut pendulum swing in progress!
            if (!stageShootDone) {
              stageShootDone = true;
              if (webSlingOpts && typeof webSlingOpts.onThwip === 'function') {
                webSlingOpts.onThwip();
              }
            }

            const shootDur = 1.0 / activeSlingWeb.shootSpeed;
            const swingTime = Math.max(0, stageTimer - shootDur);
            const swingDur = stageCfg.duration;
            const progress = Math.min(1.0, swingTime / swingDur);

            // True pendulum sinusoidal harmonic ease (starts slow, whips fast at nadir, slows at apex)
            const ease = 0.5 - 0.5 * Math.cos(progress * Math.PI);

            // Calculate 3D position along the pendulum arc
            const curPos = new THREE.Vector3().lerpVectors(stageOrigin, stageTarget, ease);
            const sag = Math.sin(progress * Math.PI) * stageCfg.dip;
            curPos.y -= sag;

            spider.position.copy(curPos);
            activeSlingWeb.update(delta, spider.position);

            // SPIDER ORIENTATION & GAIT
            if (stageCfg.isFinalDive) {
              // Diving smoothly down-right into the Hero portrait container:
              const toDest = new THREE.Vector3().subVectors(stageTarget, spider.position);
              const diveHeading = Math.atan2(toDest.x, 3.5);
              spider.group.rotation.x = THREE.MathUtils.lerp(spider.group.rotation.x, -1.25, 6.0 * delta);
              spider.group.rotation.z = THREE.MathUtils.lerp(spider.group.rotation.z, 0.0, 6.0 * delta);
              spider.update(delta, timeTotal, 12.0, diveHeading);
            } else {
              // Ascending to navbar: Option 1 Wall-Crawler pose (head UP, back to camera)
              const defaultPitch = -1.45; // Natural wall-crawler orientation (head UP, back facing camera)
              const targetPitch = typeof window.__targetPitch === 'number' ? window.__targetPitch : defaultPitch;
              const moveX = (stageTarget.x - stageOrigin.x);
              const defaultHeading = Math.atan2(moveX, 8.0); // Steer slightly towards swing direction
              const targetHeading = typeof window.__targetHeading === 'number' ? window.__targetHeading : defaultHeading;
              const targetRoll = -stageCfg.bank * 0.45 * Math.sin(progress * Math.PI);

              spider.group.rotation.x = THREE.MathUtils.lerp(spider.group.rotation.x, targetPitch, 8.0 * delta);
              spider.group.rotation.z = THREE.MathUtils.lerp(spider.group.rotation.z, targetRoll, 8.0 * delta);

              // Leg articulation speed matches upward climbing velocity
              const swingSpeed = 6.0 + Math.sin(progress * Math.PI) * 12.0;
              spider.update(delta, timeTotal, swingSpeed, targetHeading);
            }

            // Coordinate smooth page scrolling with the swing: scrolls steadily to 0 as spider ascends
            if (webSlingOpts && typeof webSlingOpts.onScroll === 'function') {
              const curScrollPct = currentStageIndex === 0 ? (1.0 - ease) : 0;
              const scrollY = Math.max(0, Math.round(startScrollSnapshot * curScrollPct));
              webSlingOpts.onScroll(scrollY);
            }

            // Swing complete!
            if (progress >= 1.0) {
              activeSlingWeb.release();

              if (currentStageIndex + 1 < slingStages.length) {
                // Advance to next swing stage!
                startSwingStage(currentStageIndex + 1);
              } else {
                // Trapping stage in portrait frame!
                currentStageIndex = slingStages.length; // Stage 6
                trappingScale = 1.0;
                stage6Timer = 0;
                if (webSlingOpts && typeof webSlingOpts.onStatus === 'function') {
                  webSlingOpts.onStatus("SPECIMEN DETECTED // DOCKING WITH CONTAINMENT MATRIX...");
                }
              }
            }
          }
        } else {
          // STAGE 6: Settling & Trapping into Containment Matrix (deliberate, slow, smooth transition)
          activeSlingWeb.update(delta, spider.position); // keeps persistent anchor webs updating/fading!
          stage6Timer += delta;

          // Phase 6A: Spider docks and articulates legs right onto the portrait frame for 0.85s (back facing viewer)
          if (stage6Timer < 0.85) {
            spider.position.lerp(stageAnchor, 4.0 * delta);
            spider.group.rotation.x = THREE.MathUtils.lerp(spider.group.rotation.x, -1.45, 6.0 * delta);
            spider.group.rotation.z = THREE.MathUtils.lerp(spider.group.rotation.z, 0.0, 6.0 * delta);
            spider.update(delta, timeTotal, 2.2, 0);
            if (spider.coreLight) spider.coreLight.intensity = 20.0 + Math.sin(timeTotal * 14.0) * 8.0;
          } else {
            // Phase 6B: Smooth, controlled compression into containment matrix
            trappingScale = THREE.MathUtils.lerp(trappingScale, 0.0, 2.2 * delta);
            spider.group.scale.set(trappingScale, trappingScale, trappingScale);
            spider.position.lerp(stageAnchor, 5.0 * delta);
            spider.group.rotation.x = THREE.MathUtils.lerp(spider.group.rotation.x, -1.45, 6.0 * delta);

            if (spider.coreLight) spider.coreLight.intensity = 35.0 * trappingScale;
            spider.position.x += (Math.random() - 0.5) * 0.04 * trappingScale;
            spider.position.y += (Math.random() - 0.5) * 0.04 * trappingScale;

            if (trappingScale < 0.025) {
              spider.group.visible = false;
              isWebSlinging = false;
              if (webSlingOpts && typeof webSlingOpts.onComplete === 'function') {
                const cb = webSlingOpts.onComplete;
                webSlingOpts.onComplete = null;
                cb();
              }
            }
          }
        }
      } else {
        // ACTIVE PATROL CRAWLING ACROSS THE VIEWPORT
        spider.position.y = 1.45;
        radarGroup.position.x = spider.position.x;
        radarGroup.position.z = spider.position.z;

        if (waypointPauseTimer > 0) {
          waypointPauseTimer -= delta;
          const scanHeading = spider.heading + Math.sin(timeTotal * 2.0) * 0.15;
          spider.update(delta, timeTotal, 0.4, scanHeading);
        } else {
          const targetWp = patrolWaypoints[currentWaypointIndex];
          const toWp = new THREE.Vector3().subVectors(targetWp, spider.position);
          toWp.y = 0;
          const distToWp = toWp.length();

          if (distToWp < 1.4) {
            currentWaypointIndex = (currentWaypointIndex + 1) % patrolWaypoints.length;
            waypointPauseTimer = 1.5; // pause momentarily to scan
            spider.update(delta, timeTotal, 0.2, spider.heading);
          } else {
            const moveDir = toWp.clone().normalize();
            const wpHeading = Math.atan2(moveDir.x, moveDir.z);
            spider.position.add(moveDir.multiplyScalar(4.5 * delta));
            spider.update(delta, timeTotal, 4.8, wpHeading);
          }
        }
      }
    }

    // Shockwave expansion animation
    if (shockwaveActive) {
      shockwaveScale += delta * 12.0;
      shockwaveMesh.scale.set(shockwaveScale, shockwaveScale, shockwaveScale);
      shockwaveMat.opacity = Math.max(0, 0.85 - shockwaveScale / 10.0);
      if (shockwaveMat.opacity <= 0) {
        shockwaveActive = false;
      }
    }

    // Update Silk Tether connection (Only during initial descent, then cleanly dissolves)
    const spinneretPos = new THREE.Vector3();
    if (spider.spinneret) {
      spider.spinneret.getWorldPosition(spinneretPos);
    } else {
      spinneretPos.copy(spider.position);
    }

    if (timeTotal < 1.25) {
      silkLine.visible = true;
      silkMat.opacity = 0.95;
      silkGeo.setFromPoints([
        new THREE.Vector3(0, 40, -2.1),
        spinneretPos
      ]);
    } else {
      silkMat.opacity = THREE.MathUtils.lerp(silkMat.opacity, 0.0, 8.0 * delta);
      if (silkMat.opacity <= 0.02) {
        silkLine.visible = false;
      } else {
        silkGeo.setFromPoints([
          new THREE.Vector3(0, 40, -2.1),
          spinneretPos
        ]);
      }
    }

    renderer.render(scene, camera);
  }

  animId = requestAnimationFrame(renderLoop);

  return {
    destroy() {
      window.removeEventListener('resize', onWindowResize);
      if (animId) cancelAnimationFrame(animId);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      spider.dispose();
      activeSlingWeb.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      silkGeo.dispose();
      silkMat.dispose();
      shockwaveGeo.dispose();
      shockwaveMat.dispose();
    },
    spider,
    /**
     * Executes the authentic Spider-Man multi-stage web-slinging locomotion (A -> B -> C -> D),
     * dynamically coordinating page scroll and diving into the Hero portrait frame.
     */
    startWebSlingAscent(options) {
      startSling(options);
    },
    retreatToVault(screenX, screenY, onComplete) {
      startSling({
        targetScreenX: screenX,
        targetScreenY: screenY,
        startScrollY: 0,
        onComplete
      });
    },
    startAscent() {
      startSling({});
    }
  };
}
