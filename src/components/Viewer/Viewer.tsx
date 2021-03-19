import React, {
  ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { interval } from 'rxjs';
import {
  AmbientLight,
  AnimationMixer,
  BufferGeometry,
  Clock,
  Group,
  Line,
  LineBasicMaterial,
  Object3D,
  Vector3,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper';
import * as TWEEN from '@tweenjs/tween.js';
import { DxfEntity } from '../../common/interfaces';
import { useInitRenderer } from '../../hooks';
import { getDxfDimension } from '../../utils';
import FloorMapJson from '../../common/sample/floorMap.json';
import CarModel from '../../common/sample/car.glb';
import { StyledViewerCanvas, StyledViewerContainer } from './Viewer.styles';
import { getThree3DModel } from '../../utils/three';

const SAMPLE_CAR_ID = 'SAMPLE_CAR_ID';

const sampleDxfEntities = FloorMapJson as DxfEntity[];
const { lowerLeft, upperRight } = getDxfDimension(sampleDxfEntities);
const { x: minX, y: minY, z: minZ } = lowerLeft;
const { x: maxX, y: maxY } = upperRight;

type ViewerProps = ComponentPropsWithoutRef<'div'>;

export const Viewer: React.FC<ViewerProps> = (props) => {
  const viewerCanvasRef = useRef<HTMLCanvasElement>(null);

  const { scene, renderer, camera, render } = useInitRenderer(
    viewerCanvasRef.current
  );

  const orbitControls = useMemo(() => {
    if (!camera || !renderer) return undefined;

    return new OrbitControls(camera, renderer.domElement);
  }, [camera, renderer]);

  const updateCamera = useCallback(() => {
    if (!orbitControls || !render) return;

    requestAnimationFrame(updateCamera);
    orbitControls.update();
    render();
  }, [orbitControls, render]);

  useLayoutEffect(() => {
    if (!updateCamera) return;

    updateCamera();
  }, [updateCamera]);

  useLayoutEffect(() => {
    if (
      !viewerCanvasRef.current ||
      !scene ||
      !camera ||
      !renderer ||
      !orbitControls ||
      !render
    )
      return;

    renderer.setClearColor(0xffffffff);

    // Set camera position
    const centerX = (maxX - minX) / 2;
    const centerY = (maxY - minY) / 2;
    camera.position.set(centerX, centerY, 1000);
    orbitControls.target.set(centerX, centerY, 0);

    // Global light
    const ambientLight = new AmbientLight(0xffffff);
    scene.add(ambientLight);

    const rootObject = new Object3D();

    // Dxf map
    const dxfMap = new Group();
    const dxfMapLines = new Group();
    const dxfMapPolyLines = new Group();
    sampleDxfEntities.forEach((entity) => {
      if (entity.type === 'LINE') {
        const { vertices } = entity;
        const linePoints: Vector3[] = vertices.map(
          ({ x, y, z = 0 }) => new Vector3(x - minX, y - minY, z - minZ)
        );
        const lineGeometry = new BufferGeometry().setFromPoints(linePoints);
        const lineMaterial = new LineBasicMaterial({ color: 0xff00ff });
        const mapLine = new Line(lineGeometry, lineMaterial);
        dxfMapLines.add(mapLine);
      }

      if (entity.type === 'LWPOLYLINE') {
        const { vertices } = entity;
        const polyLinePoints: Vector3[] = vertices.map(
          ({ x, y, z = 0 }) => new Vector3(x - minX, y - minY, z - minZ)
        );
        const polyLineGeometry = new BufferGeometry().setFromPoints(
          polyLinePoints
        );
        const polyLineMaterial = new LineBasicMaterial({ color: 0x0000ff });
        const mapPolyLine = new Line(polyLineGeometry, polyLineMaterial);
        dxfMapPolyLines.add(mapPolyLine);
      }
    });
    dxfMap.add(dxfMapLines, dxfMapPolyLines);
    rootObject.add(dxfMap);

    scene.add(rootObject);
    render();
  }, [scene, camera, renderer, orbitControls, render]);

  // Handle animation
  const animationFrameRef = useRef<number>();
  const mixer = useRef<AnimationMixer>();
  const clock = useRef(new Clock());
  const animate = useCallback((): void => {
    if (!render) return undefined;

    const requestFrameId = requestAnimationFrame(animate);
    animationFrameRef.current = requestFrameId;

    TWEEN.update();
    render();
    mixer.current?.update(clock.current.getDelta());
  }, [render]);

  useEffect(() => {
    if (!renderer || !scene || !animate) return;

    const roughnessMipmapper = new RoughnessMipmapper(renderer);
    getThree3DModel(CarModel).then((gltf) => {
      gltf.scene.name = SAMPLE_CAR_ID;
      gltf.scene.scale.set(0.12, 0.12, 0.12);
      gltf.scene.rotateX(Math.PI / 2);
      scene.add(gltf.scene);
      roughnessMipmapper.dispose();

      mixer.current = new AnimationMixer(gltf.scene);
      const clips = gltf.animations;
      clips.forEach((clip) => {
        mixer.current?.clipAction(clip).play();
      });

      animate();
    });

    const subscription = interval(1000).subscribe(() => {
      const carModel = scene.getObjectByName(SAMPLE_CAR_ID);

      if (!carModel) return;

      if (carModel.position.x > maxX - minX) carModel.position.x = 0;
      const currentModelX = carModel.position.x;

      new TWEEN.Tween(carModel.position)
        .to({ ...carModel.position, x: currentModelX + 10 }, 1000)
        .start()
        .onComplete(() => {
          animationFrameRef.current &&
            cancelAnimationFrame(animationFrameRef.current);
        });
      animate();
    });

    return (): void => {
      subscription.unsubscribe();
      animationFrameRef.current &&
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [renderer, scene, animate, render]);

  return (
    <StyledViewerContainer {...props}>
      <StyledViewerCanvas
        ref={viewerCanvasRef}
        style={{ width: '100%', height: '100%' }}
      />
    </StyledViewerContainer>
  );
};
