import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

if (typeof window !== 'undefined') {
  window.THREE = THREE;
  window.THREE.OrbitControls = OrbitControls;
}
export { THREE, OrbitControls };

