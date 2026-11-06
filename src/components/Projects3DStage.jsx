import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  RotateCw, 
  Sparkles, 
  ExternalLink,
  Layers,
  Cpu,
  ShieldCheck,
  Terminal,
  Activity
} from 'lucide-react';

/**
 * ==============================================================================
 * PROJECTS 3D WEBGL FLOATING STAGE (Spline / Futuristic 3D Cyber Deck)
 * ==============================================================================
 * Floating holographic OLED glass slabs rotating in a 3D cylindrical arena.
 * Features:
 * - Dynamic high-res 2D canvas textures (vector-sharp typography & HUD telemetry)
 * - Physical Three.js materials with specular sheen, glass refractions & neon rims
 * - Smooth pointer drag with momentum physics & spring snapping
 * - Interactive raycasting: hover elevation, click-to-focus & click-to-open
 * - Concentric holographic pedestal rings, ground grid & floating cyber motes
 * - Sleek glassmorphic HUD dock with tactile navigation, category filters & telemetry
 * - IntersectionObserver lifecycle optimization (0 CPU/GPU drain when off-screen)
 * ==============================================================================
 */

// Generate razor-sharp dynamic canvas texture for each project card
function createCardTexture(project, index, total) {
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1060;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return null;

  const w = canvas.width;
  const h = canvas.height;
  const accent = project.accentColor || '#ef4151';

  // 1. Deep Cyber Glass Background
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, '#090e18');
  bgGrad.addColorStop(0.5, '#0b1322');
  bgGrad.addColorStop(1, '#060a12');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Subtle accent ambient glow at top right corner
  const radialGlow = ctx.createRadialGradient(w * 0.85, h * 0.15, 10, w * 0.85, h * 0.15, 600);
  radialGlow.addColorStop(0, accent + '30');
  radialGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, w, h);

  // 2. Cybernetic Blueprint Grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  const gridSize = 50;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // 3. Futuristic Corner Brackets & Registration Marks
  const pad = 48;
  const bracketLen = 42;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3.5;

  // Top-Left bracket
  ctx.beginPath();
  ctx.moveTo(pad, pad + bracketLen);
  ctx.lineTo(pad, pad);
  ctx.lineTo(pad + bracketLen, pad);
  ctx.stroke();

  // Top-Right bracket
  ctx.beginPath();
  ctx.moveTo(w - pad - bracketLen, pad);
  ctx.lineTo(w - pad, pad);
  ctx.lineTo(w - pad, pad + bracketLen);
  ctx.stroke();

  // Bottom-Left bracket
  ctx.beginPath();
  ctx.moveTo(pad, h - pad - bracketLen);
  ctx.lineTo(pad, h - pad);
  ctx.lineTo(pad + bracketLen, h - pad);
  ctx.stroke();

  // Bottom-Right bracket
  ctx.beginPath();
  ctx.moveTo(w - pad - bracketLen, h - pad);
  ctx.lineTo(w - pad, h - pad);
  ctx.lineTo(w - pad, h - pad - bracketLen);
  ctx.stroke();

  // Top glowing neon accent line
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4.5;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.moveTo(pad + bracketLen + 24, pad);
  ctx.lineTo(w - pad - bracketLen - 24, pad);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 4. Header Section: Category Badge, Index & Status Dot
  const topY = 120;

  // Category Badge Box
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(pad + 18, topY - 36, 320, 54, 8);
  ctx.fill();
  ctx.stroke();

  // Glowing status beacon dot
  ctx.fillStyle = accent;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(pad + 44, topY - 9, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Category label
  ctx.fillStyle = '#f2efeb';
  ctx.font = '700 22px "Manrope", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(project.category.toUpperCase(), pad + 64, topY - 2);

  // System ID / Index
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.font = '600 22px monospace';
  ctx.textAlign = 'right';
  const indexStr = `SYS // ${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  ctx.fillText(indexStr, w - pad - 200, topY - 2);

  // Year Badge
  ctx.fillStyle = accent;
  ctx.font = '700 20px monospace';
  ctx.fillText(`[ ${project.year} ]`, w - pad - 18, topY - 2);
  ctx.textAlign = 'left';

  // 5. Hero Project Title (Bold, Futuristic Display Typography)
  const titleY = 250;
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 78px "Anton", Impact, sans-serif';
  ctx.letterSpacing = '1.5px';

  let titleLine1 = project.title;
  let titleLine2 = '';
  if (titleLine1.includes('—')) {
    const parts = titleLine1.split('—');
    titleLine1 = parts[0].trim();
    titleLine2 = parts[1].trim();
  } else if (titleLine1.length > 28) {
    const words = titleLine1.split(' ');
    titleLine1 = words.slice(0, 3).join(' ');
    titleLine2 = words.slice(3).join(' ');
  }

  // Draw Line 1 with subtle drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowOffsetY = 4;
  ctx.shadowBlur = 14;
  ctx.fillText(titleLine1.toUpperCase(), pad + 18, titleY);

  // Draw Line 2 or Tagline
  if (titleLine2) {
    ctx.font = '700 36px "Manrope", sans-serif';
    ctx.fillStyle = accent;
    ctx.letterSpacing = '0.5px';
    ctx.fillText(titleLine2, pad + 20, titleY + 52);
  } else {
    ctx.font = '500 28px "Manrope", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(project.tagline || project.subtitle || '', pad + 20, titleY + 48);
  }
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // 6. Project Architecture Summary Paragraph
  ctx.fillStyle = 'rgba(242, 239, 235, 0.84)';
  ctx.font = '400 27px "Manrope", sans-serif';
  const summaryY = titleY + 128;
  const summaryText = project.summary || project.tagline;
  
  const words = summaryText.split(' ');
  let line = '';
  let lineY = summaryY;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > (w - pad * 2 - 40) && n > 0) {
      ctx.fillText(line, pad + 18, lineY);
      line = words[n] + ' ';
      lineY += 38;
      if (lineY > summaryY + 80) {
        line = line.trim() + '...';
        break;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, pad + 18, lineY);

  // 7. Telemetry HUD Deck: 3 Key Metrics Slabs
  const deckY = lineY + 58;
  const deckW = (w - pad * 2 - 36 - 40) / 3;
  const deckH = 124;

  const metricsList = project.metrics && project.metrics.length > 0
    ? project.metrics.slice(0, 3)
    : [
        { label: 'Platform', value: 'Production' },
        { label: 'Stack', value: project.tools[0] || 'FastAPI' },
        { label: 'Status', value: 'Verified' }
      ];

  metricsList.forEach((m, i) => {
    const mx = pad + 18 + i * (deckW + 20);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(mx, deckY, deckW, deckH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = i === 0 ? accent : 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(mx + 20, deckY + 16, 22, 3.5);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 36px "Anton", Impact, sans-serif';
    ctx.fillText(m.value, mx + 20, deckY + 68);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '600 17px "Manrope", sans-serif';
    ctx.letterSpacing = '0.5px';
    ctx.fillText(m.label.toUpperCase(), mx + 20, deckY + 100);
  });

  // 8. Tech Stack Pills Row
  const toolsY = deckY + deckH + 46;
  ctx.font = '600 19px "Manrope", monospace';
  let pillX = pad + 18;
  const visibleTools = (project.tools || []).slice(0, 5);

  visibleTools.forEach((tool) => {
    const textWidth = ctx.measureText(tool).width;
    const pillW = textWidth + 32;
    const pillH = 40;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.055)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(pillX, toolsY, pillW, pillH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#d2d9e6';
    ctx.fillText(tool, pillX + 16, toolsY + 27);
    pillX += pillW + 14;
  });

  // 9. Card Footer Call to Action
  const footY = h - pad - 20;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad + 18, footY - 32);
  ctx.lineTo(w - pad - 18, footY - 32);
  ctx.stroke();

  // Client / Lab
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '600 18px "Manrope", sans-serif';
  ctx.fillText(project.client || 'Sharkify Technology Private Limited', pad + 18, footY);

  // Interactive Prompt with glowing arrow
  ctx.textAlign = 'right';
  ctx.fillStyle = accent;
  ctx.font = '800 20px "Manrope", sans-serif';
  ctx.shadowColor = accent;
  ctx.shadowBlur = 10;
  ctx.fillText('[ CLICK TO INSPECT SYSTEM ARCHITECTURE ➔ ]', w - pad - 18, footY);
  ctx.shadowBlur = 0;
  ctx.textAlign = 'left';

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

export default function Projects3DStage({
  projects = [],
  activeCategory = 'All',
  onSelectProject = () => {}
}) {
  const containerRef = useRef(null);
  const canvasMountRef = useRef(null);

  const displayProjects = useMemo(() => {
    if (!activeCategory || activeCategory === 'All') return projects;
    return projects.filter(p => p.category === activeCategory);
  }, [projects, activeCategory]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const threeState = useRef({
    scene: null,
    camera: null,
    renderer: null,
    stageGroup: null,
    cardMeshes: [],
    cardMaterials: [],
    cardTextures: [],
    targetRotation: 0,
    currentRotation: 0,
    rotationVelocity: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartRotation: 0,
    lastDragX: 0,
    lastDragTime: 0,
    animFrameId: null,
    clock: new THREE.Clock(),
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(-999, -999),
    hoveredIndex: -1,
    haloLight: null,
    focalRingMesh: null,
    pedestalPulse: 0,
    particles: null,
    isInViewport: true
  });

  const totalCards = displayProjects.length;
  const angleStep = totalCards > 0 ? (2 * Math.PI) / totalCards : 0;
  const carouselRadius = Math.max(6.0, totalCards * 0.98);

  const rotateToIndex = useCallback((index) => {
    if (totalCards === 0) return;
    const normalized = (index % totalCards + totalCards) % totalCards;
    setCurrentIndex(normalized);
    threeState.current.targetRotation = -normalized * angleStep;
  }, [totalCards, angleStep]);

  const handlePrev = useCallback(() => {
    rotateToIndex(currentIndex - 1);
  }, [currentIndex, rotateToIndex]);

  const handleNext = useCallback(() => {
    rotateToIndex(currentIndex + 1);
  }, [currentIndex, rotateToIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!threeState.current.isInViewport) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (displayProjects[currentIndex]) {
          onSelectProject(displayProjects[currentIndex]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, currentIndex, displayProjects, onSelectProject]);

  // Build Three.js Scene
  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 1000;
    const height = mount.clientHeight || 740;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.032);

    // 2. Camera (Perspective)
    const isMobile = width < 768;
    const fov = isMobile ? 58 : 44;
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 100);
    const camDistance = isMobile ? carouselRadius + 5.8 : carouselRadius + 4.2;
    // Set camera height and lookAt to comfortably place the floating card in the upper 65% of viewport
    camera.position.set(0, isMobile ? 0.65 : 0.55, camDistance);
    camera.lookAt(0, isMobile ? 0.2 : 0.05, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(0, 9, 11);
    scene.add(keyLight);

    const redRimLight = new THREE.PointLight(0xef4151, 3.4, 28);
    redRimLight.position.set(-carouselRadius - 2.5, 2.5, 2.5);
    scene.add(redRimLight);

    const blueRimLight = new THREE.PointLight(0x00e5ff, 3.2, 28);
    blueRimLight.position.set(carouselRadius + 2.5, 2.5, 2.5);
    scene.add(blueRimLight);

    const haloLight = new THREE.SpotLight(0xffffff, 2.2, 22, Math.PI / 4, 0.5, 1.2);
    haloLight.position.set(0, 7.5, carouselRadius + 1.5);
    haloLight.target.position.set(0, 0.4, 0);
    scene.add(haloLight);
    scene.add(haloLight.target);

    // 5. Holographic Floor Stage & Pedestal
    const stageFloorGroup = new THREE.Group();
    stageFloorGroup.position.y = -1.6;
    scene.add(stageFloorGroup);

    const gridHelper = new THREE.GridHelper(36, 36, 0xef4151, 0x152236);
    gridHelper.position.y = -0.02;
    // @ts-ignore
    gridHelper.material.opacity = 0.45;
    // @ts-ignore
    gridHelper.material.transparent = true;
    stageFloorGroup.add(gridHelper);

    // Concentric Holographic Pedestal Rings
    const ringGeo1 = new THREE.RingGeometry(carouselRadius - 1.2, carouselRadius - 1.14, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xef4151,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = -Math.PI / 2;
    stageFloorGroup.add(ringMesh1);

    const ringGeo2 = new THREE.RingGeometry(carouselRadius + 1.2, carouselRadius + 1.24, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = -Math.PI / 2;
    stageFloorGroup.add(ringMesh2);

    const focalRingGeo = new THREE.RingGeometry(2.0, 2.06, 48);
    const focalRingMat = new THREE.MeshBasicMaterial({
      color: 0xff3b5c,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const focalRingMesh = new THREE.Mesh(focalRingGeo, focalRingMat);
    focalRingMesh.rotation.x = -Math.PI / 2;
    focalRingMesh.position.set(0, 0.02, 0);
    stageFloorGroup.add(focalRingMesh);

    // 6. Floating Cyber Dust
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 22;
      particlePositions[i + 1] = Math.random() * 8 - 2;
      particlePositions[i + 2] = (Math.random() - 0.5) * 22;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xef4151,
      size: 0.07,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Carousel Stage Group
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const cardMeshes = [];
    const cardMaterials = [];
    const cardTextures = [];

    const cardWidth = 3.65;
    const cardHeight = 2.4;
    const cardDepth = 0.06;
    const cardGeometry = new THREE.BoxGeometry(cardWidth, cardHeight, cardDepth);
    const cardEdges = new THREE.EdgesGeometry(cardGeometry);
    const rivetGeo = new THREE.SphereGeometry(0.026, 8, 8);

    displayProjects.forEach((proj, idx) => {
      const cardGroup = new THREE.Group();

      const theta = idx * angleStep;
      cardGroup.position.x = Math.sin(theta) * carouselRadius;
      cardGroup.position.z = Math.cos(theta) * carouselRadius;
      cardGroup.position.y = 0.72; // Elevated nicely in viewport
      cardGroup.rotation.y = theta;

      const texture = createCardTexture(proj, idx, displayProjects.length);
      if (texture) cardTextures.push(texture);

      const sideMat = new THREE.MeshStandardMaterial({
        color: 0x090e18,
        metalness: 0.8,
        roughness: 0.25,
        transparent: true,
        opacity: 0.95
      });

      const frontMat = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.15,
        roughness: 0.2,
        transparent: true,
        opacity: 0.98,
        side: THREE.FrontSide
      });

      const backMat = new THREE.MeshStandardMaterial({
        color: 0x0c1422,
        metalness: 0.8,
        roughness: 0.3,
        transparent: true,
        opacity: 0.9
      });

      const materials = [sideMat, sideMat, sideMat, sideMat, frontMat, backMat];
      cardMaterials.push(...materials);

      const cardMesh = new THREE.Mesh(cardGeometry, materials);
      cardMesh.castShadow = true;
      cardMesh.receiveShadow = true;
      cardGroup.add(cardMesh);

      const accentHex = proj.accentColor ? parseInt(proj.accentColor.replace('#', '0x'), 16) : 0xef4151;
      const edgeMat = new THREE.LineBasicMaterial({
        color: accentHex,
        linewidth: 2,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });
      cardMaterials.push(edgeMat);
      const edgeLine = new THREE.LineSegments(cardEdges, edgeMat);
      cardGroup.add(edgeLine);

      const rivetMat = new THREE.MeshBasicMaterial({
        color: accentHex,
        blending: THREE.AdditiveBlending
      });
      cardMaterials.push(rivetMat);

      const hw = cardWidth / 2;
      const hh = cardHeight / 2;
      [
        [-hw + 0.05, hh - 0.05],
        [hw - 0.05, hh - 0.05],
        [-hw + 0.05, -hh + 0.05],
        [hw - 0.05, -hh + 0.05]
      ].forEach(([cx, cy]) => {
        const rivetMesh = new THREE.Mesh(rivetGeo, rivetMat);
        rivetMesh.position.set(cx, cy, 0.035);
        cardGroup.add(rivetMesh);
      });

      cardMesh.userData = {
        project: proj,
        index: idx,
        cardGroup,
        edgeLine,
        frontMat
      };

      stageGroup.add(cardGroup);
      cardMeshes.push(cardMesh);
    });

    threeState.current = {
      ...threeState.current,
      scene,
      camera,
      renderer,
      stageGroup,
      cardMeshes,
      cardMaterials,
      cardTextures,
      focalRingMesh,
      particles,
      haloLight
    };

    threeState.current.targetRotation = -currentIndex * angleStep;
    threeState.current.currentRotation = -currentIndex * angleStep;
    stageGroup.rotation.y = threeState.current.currentRotation;

    const handleResize = () => {
      if (!mount || !camera || !renderer) return;
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      const mob = nw < 768;
      camera.fov = mob ? 58 : 44;
      camera.aspect = nw / nh;
      camera.position.z = mob ? carouselRadius + 5.8 : carouselRadius + 4.2;
      camera.position.y = mob ? 0.65 : 0.55;
      camera.lookAt(0, mob ? 0.2 : 0.05, 0);
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    window.addEventListener('resize', handleResize);

    const observer = new IntersectionObserver(([entry]) => {
      threeState.current.isInViewport = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(mount);

    let lastTime = performance.now();
    const animate = () => {
      threeState.current.animFrameId = requestAnimationFrame(animate);

      if (!threeState.current.isInViewport) return;

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const state = threeState.current;

      if (isAutoRotate && !state.isDragging) {
        state.targetRotation -= 0.15 * delta;
      }

      state.currentRotation = THREE.MathUtils.lerp(
        state.currentRotation,
        state.targetRotation,
        state.isDragging ? 0.25 : 0.08
      );
      state.stageGroup.rotation.y = state.currentRotation;

      if (state.particles) {
        state.particles.rotation.y += 0.03 * delta;
        const posAttr = state.particles.geometry.attributes.position;
        for (let i = 1; i < posAttr.count * 3; i += 3) {
          posAttr.array[i] += 0.3 * delta;
          if (posAttr.array[i] > 6) {
            posAttr.array[i] = -2;
          }
        }
        posAttr.needsUpdate = true;
      }

      if (state.focalRingMesh) {
        state.pedestalPulse += delta * 2.5;
        const scale = 1 + Math.sin(state.pedestalPulse) * 0.04;
        state.focalRingMesh.scale.set(scale, scale, 1);
      }

      if (!state.isDragging) {
        const normalizedAngle = (-state.currentRotation) % (2 * Math.PI);
        const positiveAngle = (normalizedAngle + 2 * Math.PI) % (2 * Math.PI);
        const approxIndex = Math.round(positiveAngle / angleStep) % totalCards;
        if (approxIndex !== currentIndex && totalCards > 0) {
          setCurrentIndex(approxIndex);
        }
      }

      cardMeshes.forEach((mesh) => {
        const group = mesh.userData.cardGroup;
        const worldAngle = (mesh.userData.index * angleStep + state.currentRotation) % (2 * Math.PI);
        let diff = worldAngle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;

        const isFront = Math.abs(diff) < 0.28;
        const isHoveredCard = mesh.userData.index === state.hoveredIndex;

        const targetScale = isHoveredCard ? 1.08 : (isFront ? 1.03 : 0.94);
        group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);

        if (mesh.userData.edgeLine) {
          mesh.userData.edgeLine.material.opacity = isHoveredCard ? 1.0 : (isFront ? 0.9 : 0.4);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      if (threeState.current.animFrameId) {
        cancelAnimationFrame(threeState.current.animFrameId);
      }
      cardMeshes.forEach(m => {
        m.geometry.dispose();
      });
      cardMaterials.forEach(mat => mat.dispose());
      cardTextures.forEach(tex => tex.dispose());
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [displayProjects, carouselRadius, angleStep, totalCards, isAutoRotate, currentIndex]);

  const handlePointerDown = (e) => {
    const state = threeState.current;
    state.isDragging = true;
    state.dragStartX = e.clientX;
    state.dragStartRotation = state.targetRotation;
    state.lastDragX = e.clientX;
    state.lastDragTime = performance.now();
    state.rotationVelocity = 0;
  };

  const handlePointerMove = (e) => {
    const state = threeState.current;
    const rect = canvasMountRef.current?.getBoundingClientRect();
    if (!rect) return;

    state.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    state.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (state.camera && state.cardMeshes.length > 0) {
      state.raycaster.setFromCamera(state.mouse, state.camera);
      const intersects = state.raycaster.intersectObjects(state.cardMeshes);
      if (intersects.length > 0) {
        const hitIndex = intersects[0].object.userData.index;
        state.hoveredIndex = hitIndex;
        setIsHovered(true);
      } else {
        state.hoveredIndex = -1;
        setIsHovered(false);
      }
    }

    if (!state.isDragging) return;

    const deltaX = e.clientX - state.dragStartX;
    const sensitivity = 0.0038;
    state.targetRotation = state.dragStartRotation + deltaX * sensitivity;

    const now = performance.now();
    const dt = (now - state.lastDragTime) || 16;
    state.rotationVelocity = (e.clientX - state.lastDragX) / dt;
    state.lastDragX = e.clientX;
    state.lastDragTime = now;
  };

  const handlePointerUp = (e) => {
    const state = threeState.current;
    if (!state.isDragging) return;
    state.isDragging = false;

    const dragDist = Math.abs(e.clientX - state.dragStartX);

    if (Math.abs(state.rotationVelocity) > 0.3) {
      state.targetRotation += state.rotationVelocity * 0.45;
    }

    if (totalCards > 0) {
      const snapIndex = Math.round(-state.targetRotation / angleStep);
      rotateToIndex(snapIndex);
    }

    if (dragDist < 6) {
      if (state.camera && state.cardMeshes.length > 0) {
        state.raycaster.setFromCamera(state.mouse, state.camera);
        const intersects = state.raycaster.intersectObjects(state.cardMeshes);
        if (intersects.length > 0) {
          const clickedIndex = intersects[0].object.userData.index;
          if (clickedIndex === currentIndex) {
            onSelectProject(displayProjects[clickedIndex]);
          } else {
            rotateToIndex(clickedIndex);
          }
        }
      }
    }
  };

  const currentProject = displayProjects[currentIndex] || displayProjects[0];

  return (
    <div 
      ref={containerRef}
      className="projects-3d-stage-wrapper"
      role="region"
      aria-label="Interactive 3D Projects Carousel"
    >
      {/* 3D WebGL Canvas Stage Container */}
      <div 
        ref={canvasMountRef}
        className={`projects-3d-canvas-mount ${isHovered ? 'cursor-pointer' : 'cursor-grab'}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => {
          threeState.current.isDragging = false;
          threeState.current.hoveredIndex = -1;
          setIsHovered(false);
        }}
      />

      {/* Cybernetic HUD Overlay: Orbit Mode, Status & Counter */}
      <div className="stage-top-hud">
        <div className="stage-beacon">
          <span className="beacon-pip" />
          <span className="beacon-text">3D WEBGL STAGE ACTIVE</span>
          <span className="beacon-coords">DRAG TO ORBIT • CLICK TO INSPECT</span>
        </div>

        <button
          type="button"
          className={`stage-orbit-toggle ${isAutoRotate ? 'active' : ''}`}
          onClick={() => setIsAutoRotate(prev => !prev)}
          title="Toggle Auto Orbit"
          aria-label="Toggle Auto Orbit Rotation"
        >
          <RotateCw size={13} className={isAutoRotate ? 'spin-anim' : ''} />
          <span>{isAutoRotate ? 'AUTO-ORBIT: ON' : 'AUTO-ORBIT: OFF'}</span>
        </button>
      </div>

      {/* Tactile Lower Navigation HUD Dock */}
      {currentProject && (
        <div className="stage-bottom-hud">
          {/* Previous Arrow Button */}
          <button
            type="button"
            className="stage-hud-btn"
            onClick={handlePrev}
            aria-label="Previous project"
            title="Previous project (Left Arrow)"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Center Project Telemetry & Direct Action */}
          <div className="stage-hud-card">
            <div className="hud-card-meta">
              <span className="hud-category-chip">
                <Cpu size={12} className="accent" />
                {currentProject.category}
              </span>
              <span className="hud-counter">
                {String(currentIndex + 1).padStart(2, '0')} / {String(totalCards).padStart(2, '0')}
              </span>
            </div>

            <div className="hud-card-title-row">
              <h3 className="hud-project-title">{currentProject.title}</h3>
            </div>

            {/* Quick Metrics & Technology Highlights */}
            <div className="hud-chips-row">
              {currentProject.metrics && currentProject.metrics[0] && (
                <span className="hud-metric-pill">
                  <Activity size={12} className="accent" />
                  <strong>{currentProject.metrics[0].value}</strong> {currentProject.metrics[0].label}
                </span>
              )}
              {currentProject.tools && currentProject.tools.slice(0, 3).map((tool, i) => (
                <span key={i} className="hud-tool-pill">
                  {tool}
                </span>
              ))}
            </div>

            {/* Interactive Timeline Dots / Jump Links */}
            <div className="hud-dots-track" role="tablist" aria-label="Project Selection Dots">
              {displayProjects.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === currentIndex}
                  className={`hud-dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={() => rotateToIndex(idx)}
                  title={`Jump to ${p.title}`}
                />
              ))}
            </div>
          </div>

          {/* Next Arrow Button */}
          <button
            type="button"
            className="stage-hud-btn"
            onClick={handleNext}
            aria-label="Next project"
            title="Next project (Right Arrow)"
          >
            <ChevronRight size={18} />
          </button>

          {/* Primary CTA Button: Inspect Full Architecture */}
          <button
            type="button"
            className="stage-cta-btn"
            onClick={() => onSelectProject(currentProject)}
            aria-label={`Open full case study for ${currentProject.title}`}
          >
            <Maximize2 size={15} />
            <span>INSPECT SYSTEM [ENTER]</span>
          </button>
        </div>
      )}
    </div>
  );
}
