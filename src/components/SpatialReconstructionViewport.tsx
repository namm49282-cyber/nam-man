import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RotateCcw } from 'lucide-react';
import {
  getDirectionLabel,
  getLocalizedDirections,
} from '../i18n/domainTranslations';
import { UI_STRINGS } from '../i18n/uiStrings';
import {
  CaptureDirection,
  CapturedAngleImage,
  LocaleCode,
  SurfaceMetrics,
} from '../types/artifact';
import { loadImageElement } from '../utils/imageAnalysis';

interface SpatialReconstructionViewportProps {
  locale: LocaleCode;
  angles: CapturedAngleImage[];
  metrics: SurfaceMetrics;
}

type ReconstructionMode = 'volumetric_rig' | 'surface_relief';
type ReliefFinish = 'original' | 'limestone' | 'bronze';

const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();

function detectSoftwareWebGL(): boolean {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createGraduatedDegreeRingTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#B89246';
    ctx.fillRect(0, 0, 1024, 128);
    ctx.strokeStyle = '#3B2A0E';
    ctx.fillStyle = '#2B1E08';
    ctx.font = '600 20px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';

    for (let deg = 0; deg < 360; deg += 5) {
      const x = (deg / 360) * 1024;
      const isMajor = deg % 30 === 0;
      ctx.lineWidth = isMajor ? 3 : 1.5;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, isMajor ? 44 : 22);
      ctx.stroke();

      if (deg % 45 === 0) {
        ctx.fillText(`${deg}°`, x, 82);
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createSoftContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 18, 128, 128, 124);
    grad.addColorStop(0, 'rgba(18, 16, 14, 0.55)');
    grad.addColorStop(0.55, 'rgba(18, 16, 14, 0.22)');
    grad.addColorStop(1, 'rgba(18, 16, 14, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const SpatialReconstructionViewport: React.FC<
  SpatialReconstructionViewportProps
> = ({ locale, angles, metrics }) => {
  const t = UI_STRINGS[locale];
  const isRtl = locale === 'ar';
  const localizedDirs = getLocalizedDirections(locale);

  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const [viewMode, setViewMode] = useState<ReconstructionMode>('volumetric_rig');
  const [reliefFinish, setReliefFinish] = useState<ReliefFinish>('original');
  const [reliefDepth, setReliefDepth] = useState<number>(0.36);
  const [activeAngleIdx, setActiveAngleIdx] = useState<number>(0);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [webglLost, setWebglLost] = useState<boolean>(false);
  const [orbitalScrubber2D, setOrbitalScrubber2D] = useState<boolean>(false);

  const sceneApiRef = useRef<{
    rebuildArtifactContent: (
      currentAngles: CapturedAngleImage[],
      mode: ReconstructionMode,
      finish: ReliefFinish,
      depth: number,
      selectedIdx: number
    ) => Promise<void>;
    glideCameraToAngle: (azimuthDeg: number, elevationDeg: number) => void;
    resetCamera: () => void;
  } | null>(null);

  const meetsMinimum = angles.length >= 3;

  useEffect(() => {
    if (activeAngleIdx >= angles.length && angles.length > 0) {
      setActiveAngleIdx(0);
    }
  }, [angles.length, activeAngleIdx]);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: false,
      });
    } catch {
      setWebglLost(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2)
    );
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 560;
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglLost(true);
    };
    const handleContextRestored = () => {
      setWebglLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener(
      'webglcontextrestored',
      handleContextRestored
    );

    const scene = new THREE.Scene();
    const bgHex = 0x171513;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.042);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(3.4, 2.35, 4.1);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.1;
    controls.maxDistance = 9.5;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.target.set(0, 1.05, 0);
    controls.update();

    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x3b332b, 0.65);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1dc, 1.85);
    keyLight.position.set(4.2, 6.5, 3.8);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 16;
      keyLight.shadow.camera.left = -3.5;
      keyLight.shadow.camera.right = 3.5;
      keyLight.shadow.camera.top = 3.5;
      keyLight.shadow.camera.bottom = -3.5;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.95);
    rimLight.position.set(-4.5, 3.8, -3.6);
    scene.add(rimLight);

    const floorGeo = new THREE.CircleGeometry(14, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b18,
      roughness: 0.88,
      metalness: 0.08,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const shadowTex = createSoftContactShadowTexture();
    const contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 4.4),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.62,
      })
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.02;
    scene.add(contactShadow);

    // Composite 8-Part Procedural Robotic Turntable & Gantry Rig
    const scannerRigGroup = new THREE.Group();
    scene.add(scannerRigGroup);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const degreeTex = createGraduatedDegreeRingTexture(maxAniso);

    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0xd8cfc0,
      roughness: 0.78,
      metalness: 0.05,
    });
    const lowerPlinth = new THREE.Mesh(
      new THREE.CylinderGeometry(1.58, 1.68, 0.18, 64),
      plinthMat
    );
    lowerPlinth.position.y = 0.09;
    lowerPlinth.receiveShadow = true;
    lowerPlinth.castShadow = true;
    scannerRigGroup.add(lowerPlinth);

    const slateMetalMat = new THREE.MeshStandardMaterial({
      color: 0x2c323b,
      roughness: 0.44,
      metalness: 0.68,
    });
    const motorHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(1.38, 1.44, 0.14, 64),
      slateMetalMat
    );
    motorHousing.position.y = 0.25;
    motorHousing.castShadow = true;
    scannerRigGroup.add(motorHousing);

    const brassRingMat = new THREE.MeshStandardMaterial({
      map: degreeTex,
      roughness: 0.22,
      metalness: 0.88,
    });
    const brassRing = new THREE.Mesh(
      new THREE.CylinderGeometry(1.41, 1.41, 0.08, 64, 1, true),
      brassRingMat
    );
    brassRing.position.y = 0.25;
    scannerRigGroup.add(brassRing);

    const platterMat = new THREE.MeshStandardMaterial({
      color: 0x262320,
      roughness: 0.62,
      metalness: 0.18,
    });
    const specimenPlatter = new THREE.Mesh(
      new THREE.CylinderGeometry(1.22, 1.26, 0.07, 64),
      platterMat
    );
    specimenPlatter.position.y = 0.355;
    specimenPlatter.receiveShadow = true;
    scannerRigGroup.add(specimenPlatter);

    const gantrySwivelGroup = new THREE.Group();
    gantrySwivelGroup.position.y = 0.35;
    scannerRigGroup.add(gantrySwivelGroup);

    const archRadius = 1.95;
    const archGeo = new THREE.TorusGeometry(archRadius, 0.042, 20, 72, Math.PI);
    const archMesh = new THREE.Mesh(archGeo, slateMetalMat);
    archMesh.position.y = 0.05;
    archMesh.castShadow = true;
    gantrySwivelGroup.add(archMesh);

    const brassTrimMat = new THREE.MeshStandardMaterial({
      color: 0xc59b48,
      roughness: 0.2,
      metalness: 0.9,
    });
    const archBrassRail = new THREE.Mesh(
      new THREE.TorusGeometry(archRadius + 0.048, 0.014, 12, 72, Math.PI),
      brassTrimMat
    );
    archBrassRail.position.y = 0.05;
    gantrySwivelGroup.add(archBrassRail);

    for (const side of [-1, 1]) {
      const anchor = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.22, 0.22),
        brassTrimMat
      );
      anchor.position.set(side * archRadius, 0.04, 0);
      gantrySwivelGroup.add(anchor);
    }

    const sensorCarriage = new THREE.Group();
    const carriageBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.18, 0.26),
      brassTrimMat
    );
    sensorCarriage.add(carriageBody);

    const lensBarrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.068, 0.082, 0.18, 32),
      slateMetalMat
    );
    lensBarrel.rotation.x = Math.PI / 2;
    lensBarrel.position.z = -0.16;
    sensorCarriage.add(lensBarrel);

    const lensOpticalGlass = new THREE.Mesh(
      new THREE.CircleGeometry(0.058, 24),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.1,
        metalness: 0.9,
      })
    );
    lensOpticalGlass.rotation.y = Math.PI;
    lensOpticalGlass.position.z = -0.252;
    sensorCarriage.add(lensOpticalGlass);

    const elevRad = THREE.MathUtils.degToRad(34);
    sensorCarriage.position.set(
      Math.cos(elevRad) * archRadius,
      0.05 + Math.sin(elevRad) * archRadius,
      0
    );
    sensorCarriage.lookAt(0, 1.15, 0);
    gantrySwivelGroup.add(sensorCarriage);

    const dynamicArtifactGroup = new THREE.Group();
    scene.add(dynamicArtifactGroup);

    const activeDisposables: Array<{ dispose: () => void }> = [];
    const clearDynamicGroup = () => {
      while (dynamicArtifactGroup.children.length > 0) {
        dynamicArtifactGroup.remove(dynamicArtifactGroup.children[0]);
      }
      while (activeDisposables.length > 0) {
        const d = activeDisposables.pop();
        d?.dispose();
      }
    };

    let cameraTransitionActive = false;
    let targetGantryAzimuth = 0;

    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let unmounted = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (unmounted) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function requestRender() {
      if (unmounted) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        if (unmounted) return;
        renderDirty = false;
        const dt = Math.min(clock.getDelta(), 0.05);

        let needsMoreFrames = false;

        const gantryDiff = Math.abs(
          gantrySwivelGroup.rotation.y - targetGantryAzimuth
        );
        if (gantryDiff > 0.003) {
          gantrySwivelGroup.rotation.y = THREE.MathUtils.damp(
            gantrySwivelGroup.rotation.y,
            targetGantryAzimuth,
            6,
            dt || 0.016
          );
          needsMoreFrames = true;
        }

        if (cameraTransitionActive) {
          camera.position.lerp(_targetPos, 1 - Math.exp(-6.5 * (dt || 0.016)));
          controls.target.lerp(_targetLook, 1 - Math.exp(-6.5 * (dt || 0.016)));
          if (camera.position.distanceTo(_targetPos) < 0.03) {
            cameraTransitionActive = false;
          } else {
            needsMoreFrames = true;
          }
        }

        const controlsMoved = controls.update();
        if (controlsMoved && !isSoftwareGl) {
          needsMoreFrames = true;
        }

        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (renderDirty || needsMoreFrames) {
            requestRender();
          }
        };

        if (isSoftwareGl) {
          afterDraw(done);
        } else {
          done();
        }
      });
    }

    controls.addEventListener('start', () => {
      cameraTransitionActive = false;
    });
    controls.addEventListener('change', () => {
      requestRender();
    });

    const handleResize = () => {
      if (!container || unmounted) return;
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', handleResize);

    const rebuildArtifactContent = async (
      currentAngles: CapturedAngleImage[],
      mode: ReconstructionMode,
      finish: ReliefFinish,
      depth: number,
      selectedIdx: number
    ) => {
      clearDynamicGroup();
      if (currentAngles.length < 3) {
        requestRender();
        return;
      }

      const activeItem =
        currentAngles[Math.min(selectedIdx, currentAngles.length - 1)] ??
        currentAngles[0];
      targetGantryAzimuth = THREE.MathUtils.degToRad(
        -activeItem.azimuthDeg + 90
      );

      const loadedEntries: Array<{
        angle: CapturedAngleImage;
        img: HTMLImageElement;
        tex: THREE.CanvasTexture;
      }> = [];

      for (const ang of currentAngles.slice(0, 6)) {
        try {
          const img = await loadImageElement(ang.dataUrl);
          const c = document.createElement('canvas');
          c.width = 512;
          c.height = 512;
          const cCtx = c.getContext('2d');
          if (cCtx) {
            const side = Math.min(
              img.naturalWidth || 512,
              img.naturalHeight || 512
            );
            const sx = ((img.naturalWidth || side) - side) / 2;
            const sy = ((img.naturalHeight || side) - side) / 2;
            cCtx.drawImage(img, sx, sy, side, side, 0, 0, 512, 512);
          }
          const tex = new THREE.CanvasTexture(c);
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = maxAniso;
          activeDisposables.push(tex);
          loadedEntries.push({ angle: ang, img, tex });
        } catch {
          // Skip broken entry safely
        }
      }

      if (loadedEntries.length === 0 || unmounted) {
        requestRender();
        return;
      }

      if (mode === 'volumetric_rig') {
        const findTexByDir = (dir: CaptureDirection, fallbackIdx: number) =>
          loadedEntries.find((e) => e.angle.direction === dir)?.tex ??
          loadedEntries[fallbackIdx % loadedEntries.length].tex;

        const frontTex = findTexByDir(CaptureDirection.Front, 0);
        const rightTex = findTexByDir(CaptureDirection.Right, 1);
        const backTex = findTexByDir(CaptureDirection.Back, 2);
        const leftTex = findTexByDir(CaptureDirection.Left, 1);
        const topTex = findTexByDir(CaptureDirection.Top, 0);

        const makeFaceMat = (texObj: THREE.CanvasTexture) => {
          const m = new THREE.MeshStandardMaterial({
            map: texObj,
            roughness: 0.45,
            metalness: 0.08,
          });
          activeDisposables.push(m);
          return m;
        };

        const bottomMat = new THREE.MeshStandardMaterial({
          color: 0x2d2925,
          roughness: 0.85,
        });
        activeDisposables.push(bottomMat);

        const riserGeo = new THREE.CylinderGeometry(0.62, 0.7, 0.14, 48);
        const riserMat = new THREE.MeshStandardMaterial({
          color: 0xe6dfd3,
          roughness: 0.7,
        });
        activeDisposables.push(riserGeo, riserMat);
        const riser = new THREE.Mesh(riserGeo, riserMat);
        riser.position.y = 0.46;
        riser.castShadow = true;
        riser.receiveShadow = true;
        dynamicArtifactGroup.add(riser);

        const boxGeo = new THREE.BoxGeometry(1.12, 1.18, 1.12);
        activeDisposables.push(boxGeo);
        const materials = [
          makeFaceMat(rightTex),
          makeFaceMat(leftTex),
          makeFaceMat(topTex),
          bottomMat,
          makeFaceMat(frontTex),
          makeFaceMat(backTex),
        ];
        const artifactVolume = new THREE.Mesh(boxGeo, materials);
        artifactVolume.position.y = 1.12;
        artifactVolume.castShadow = true;
        artifactVolume.receiveShadow = true;
        dynamicArtifactGroup.add(artifactVolume);

        const frameGeo = new THREE.EdgesGeometry(
          new THREE.BoxGeometry(1.15, 1.21, 1.15)
        );
        const frameMat = new THREE.LineBasicMaterial({
          color: 0xc59b48,
          transparent: true,
          opacity: 0.55,
        });
        activeDisposables.push(frameGeo, frameMat);
        const wireframe = new THREE.LineSegments(frameGeo, frameMat);
        wireframe.position.copy(artifactVolume.position);
        dynamicArtifactGroup.add(wireframe);

        loadedEntries.forEach((entry, idx) => {
          const isTop = entry.angle.direction === CaptureDirection.Top;
          const azRad = THREE.MathUtils.degToRad(entry.angle.azimuthDeg);
          const orbitR = isTop ? 0.01 : 1.72;
          const plateY = isTop ? 2.48 : 1.16 + (idx % 2) * 0.04;

          const plateGroup = new THREE.Group();
          const px = Math.sin(azRad) * orbitR;
          const pz = Math.cos(azRad) * orbitR;
          plateGroup.position.set(px, plateY, pz);
          plateGroup.lookAt(0, 1.12, 0);

          const plateGeo = new THREE.PlaneGeometry(0.56, 0.56);
          const plateMat = new THREE.MeshBasicMaterial({
            map: entry.tex,
            side: THREE.DoubleSide,
          });
          const borderGeo = new THREE.PlaneGeometry(0.61, 0.61);
          const isSelected = idx === selectedIdx;
          const borderMat = new THREE.MeshStandardMaterial({
            color: isSelected ? 0x2dd4bf : 0xc59b48,
            roughness: 0.35,
            metalness: 0.75,
            side: THREE.DoubleSide,
          });
          activeDisposables.push(plateGeo, plateMat, borderGeo, borderMat);

          const borderMesh = new THREE.Mesh(borderGeo, borderMat);
          borderMesh.position.z = -0.008;
          plateGroup.add(borderMesh);

          const photoMesh = new THREE.Mesh(plateGeo, plateMat);
          plateGroup.add(photoMesh);

          dynamicArtifactGroup.add(plateGroup);
        });
      } else {
        const chosen =
          loadedEntries[Math.min(selectedIdx, loadedEntries.length - 1)] ??
          loadedEntries[0];

        const segs = 96;
        const sampleCanvas = document.createElement('canvas');
        sampleCanvas.width = segs + 1;
        sampleCanvas.height = segs + 1;
        const sCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
        if (sCtx) {
          sCtx.drawImage(chosen.img, 0, 0, segs + 1, segs + 1);
        }
        const pixels = sCtx?.getImageData(0, 0, segs + 1, segs + 1).data;

        const reliefGeo = new THREE.PlaneGeometry(1.68, 1.68, segs, segs);
        const posAttr = reliefGeo.attributes.position;

        if (pixels) {
          for (let i = 0; i < posAttr.count; i++) {
            const pIdx = i * 4;
            const luma =
              (0.299 * pixels[pIdx] +
                0.587 * pixels[pIdx + 1] +
                0.114 * pixels[pIdx + 2]) /
              255;
            posAttr.setZ(i, (luma - 0.35) * depth);
          }
          posAttr.needsUpdate = true;
          reliefGeo.computeVertexNormals();
        }
        activeDisposables.push(reliefGeo);

        let reliefMat: THREE.MeshStandardMaterial;
        if (finish === 'limestone') {
          reliefMat = new THREE.MeshStandardMaterial({
            color: 0xd9cdb8,
            roughness: 0.76,
            metalness: 0.06,
          });
        } else if (finish === 'bronze') {
          reliefMat = new THREE.MeshStandardMaterial({
            color: 0x9b7940,
            roughness: 0.3,
            metalness: 0.86,
          });
        } else {
          reliefMat = new THREE.MeshStandardMaterial({
            map: chosen.tex,
            roughness: 0.52,
            metalness: 0.12,
          });
        }
        activeDisposables.push(reliefMat);

        const slabGeo = new THREE.BoxGeometry(1.78, 1.78, 0.12);
        const slabMat = new THREE.MeshStandardMaterial({
          color: 0x302b26,
          roughness: 0.78,
        });
        activeDisposables.push(slabGeo, slabMat);

        const reliefHolder = new THREE.Group();
        reliefHolder.position.set(0, 1.28, 0);
        reliefHolder.rotation.x = -0.14;

        const slabMesh = new THREE.Mesh(slabGeo, slabMat);
        slabMesh.position.z = -0.09;
        slabMesh.castShadow = true;
        reliefHolder.add(slabMesh);

        const reliefMesh = new THREE.Mesh(reliefGeo, reliefMat);
        reliefMesh.castShadow = true;
        reliefMesh.receiveShadow = true;
        reliefHolder.add(reliefMesh);

        dynamicArtifactGroup.add(reliefHolder);
      }

      if (!isSoftwareGl) {
        renderer.compile(scene, camera);
      }
      requestRender();
    };

    const glideCameraToAngle = (azimuthDeg: number, elevationDeg: number) => {
      if (elevationDeg > 70) {
        _targetPos.set(0.01, 4.35, 0.65);
      } else {
        const rad = THREE.MathUtils.degToRad(azimuthDeg);
        const dist = 3.95;
        _targetPos.set(Math.sin(rad) * dist, 2.05, Math.cos(rad) * dist);
      }
      _targetLook.set(0, 1.12, 0);
      targetGantryAzimuth = THREE.MathUtils.degToRad(-azimuthDeg + 90);
      cameraTransitionActive = true;
      requestRender();
    };

    const resetCamera = () => {
      _targetPos.set(3.4, 2.35, 4.1);
      _targetLook.set(0, 1.05, 0);
      cameraTransitionActive = true;
      requestRender();
    };

    sceneApiRef.current = {
      rebuildArtifactContent,
      glideCameraToAngle,
      resetCamera,
    };

    requestRender();

    return () => {
      unmounted = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener(
        'webglcontextlost',
        handleContextLost
      );
      renderer.domElement.removeEventListener(
        'webglcontextrestored',
        handleContextRestored
      );
      clearDynamicGroup();
      controls.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      shadowTex.dispose();
      degreeTex.dispose();
      envTarget.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (sceneApiRef.current) {
      sceneApiRef.current.rebuildArtifactContent(
        angles,
        viewMode,
        reliefFinish,
        reliefDepth,
        activeAngleIdx
      );
    }
  }, [angles, viewMode, reliefFinish, reliefDepth, activeAngleIdx]);

  const getShortDirLabel = (dir: CaptureDirection) =>
    localizedDirs.find((d) => d.id === dir)?.shortLabel ??
    getDirectionLabel(locale, dir);

  return (
    <section
      id="spatial-studio"
      className="py-14 border-b border-[#DED4C3] bg-[#EDE5D6]"
    >
      <div className="max-w-[1160px] mx-auto px-6">
        {/* Clean Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-[#0F4C45] mb-1 tabular-nums">
              {t.sec2Kicker3(metrics.angularCoveragePct)}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1814] balance-text">
              {t.sec2Title}
            </h2>
          </div>

          <p className="text-xs text-[#5C5247]">{t.viewportOrbitHint}</p>
        </div>

        {/* Viewport Container */}
        <div className="relative w-full h-[460px] sm:h-[520px] rounded-2xl overflow-hidden border border-[#3B332A] bg-[#171513] shadow-[0_8px_28px_rgba(28,24,20,0.12)]">
          <div
            ref={canvasMountRef}
            className={`w-full h-full ${
              !meetsMinimum || orbitalScrubber2D || webglLost ? 'hidden' : 'block'
            }`}
          />

          {/* Gate Overlay when fewer than 3 photos are uploaded/captured */}
          {!meetsMinimum && (
            <div className="absolute inset-0 bg-[#171513] flex flex-col items-center justify-center p-8 text-center">
              <div className="max-w-lg">
                <p className="text-xs text-[#F3D28C] mb-2 tabular-nums">
                  {t.gateCurrentAngles(angles.length)}
                </p>
                <h3 className="font-display-heritage text-2xl sm:text-3xl font-bold text-[#FBF9F5] mb-3 balance-text">
                  {t.gateTitle}
                </h3>
                <p className="text-sm text-[#C7BEB2] leading-relaxed mb-6">
                  {t.gateDesc}
                </p>
                <a
                  href="#capture-studio"
                  className="btn-guardian-primary px-6 py-2.5 text-xs"
                >
                  {t.gateBackBtn}
                </a>
              </div>
            </div>
          )}

          {/* 2D Orbital Angle Scrubber */}
          {meetsMinimum && (orbitalScrubber2D || webglLost) && (
            <div className="absolute inset-0 bg-[#171513] flex flex-col items-center justify-between p-6">
              <div className="w-full flex items-center justify-between text-xs text-[#D6CEBE]">
                <span>
                  {angles[activeAngleIdx]
                    ? getDirectionLabel(locale, angles[activeAngleIdx].direction)
                    : ''}
                </span>
                <span className="font-mono tabular-nums">
                  {t.scrubberCounter(activeAngleIdx + 1, angles.length)}
                </span>
              </div>

              <div className="my-auto max-h-[380px] aspect-square rounded-xl overflow-hidden border border-[#3B332A] bg-[#12100E]">
                {angles[activeAngleIdx] && (
                  <img
                    src={angles[activeAngleIdx].dataUrl}
                    alt={getDirectionLabel(locale, angles[activeAngleIdx].direction)}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              <div className="w-full max-w-xl bg-[#201C18] border border-[#3B332A] rounded-full px-6 py-3">
                <label
                  htmlFor="orbital-scrubber-range"
                  className="block text-xs text-[#D6CEBE] mb-2 text-center"
                >
                  {t.scrubberHint}
                </label>
                <input
                  id="orbital-scrubber-range"
                  type="range"
                  min={0}
                  max={Math.max(0, angles.length - 1)}
                  step={1}
                  value={activeAngleIdx}
                  onChange={(e) => setActiveAngleIdx(Number(e.target.value))}
                  className="w-full accent-[#C89B4F] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Sculpted Floating Dark Museum Control Bar */}
          {meetsMinimum && !orbitalScrubber2D && !webglLost && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[94%] max-w-[840px] bg-[#181512]/90 backdrop-blur-sm border border-[#453B30] rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-2.5 text-[#FBF9F5]">
              <div className="flex items-center gap-1 bg-[#110F0D] p-1 rounded-full border border-[#332B23]">
                <button
                  type="button"
                  onClick={() => setViewMode('volumetric_rig')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    viewMode === 'volumetric_rig'
                      ? 'bg-[#155E56] text-[#FBF9F5]'
                      : 'text-[#C7BEB2] hover:text-white'
                  }`}
                >
                  {t.volumetricModeBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('surface_relief')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    viewMode === 'surface_relief'
                      ? 'bg-[#155E56] text-[#FBF9F5]'
                      : 'text-[#C7BEB2] hover:text-white'
                  }`}
                >
                  {t.reliefModeBtn}
                </button>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-0.5">
                {angles.map((ang, idx) => (
                  <button
                    key={ang.id}
                    type="button"
                    onClick={() => {
                      setActiveAngleIdx(idx);
                      sceneApiRef.current?.glideCameraToAngle(
                        ang.azimuthDeg,
                        ang.elevationDeg
                      );
                    }}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      activeAngleIdx === idx
                        ? 'bg-[#F3D28C] text-[#1C1814] border-[#F3D28C] font-bold'
                        : 'bg-[#211D19] text-[#D6CEBE] border-[#453B30] hover:border-[#C89B4F]'
                    }`}
                  >
                    {getShortDirLabel(ang.direction)}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => sceneApiRef.current?.resetCamera()}
                className="btn-guardian-dark px-3.5 py-1.5 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#F3D28C]" />
                <span>{t.resetViewBtn}</span>
              </button>
            </div>
          )}
        </div>

        {/* Concise 3-Metric Summary Line */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 bg-[#FBF9F5] border border-[#D8CCB7] rounded-2xl text-xs text-[#5C5247] font-mono tabular-nums">
          <span>
            {t.kpi1Label}: <strong className="text-[#0F4C45]">{metrics.totalAngles}</strong>
          </span>
          <span>
            {t.kpi2Label}: <strong className="text-[#0F4C45]">{metrics.angularCoveragePct}%</strong>
          </span>
          <span>
            {t.kpi3Label}: <strong className="text-[#0F4C45]">{metrics.illuminationConsistencyPct}%</strong>
          </span>
        </div>
      </div>
    </section>
  );
};
