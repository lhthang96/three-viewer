import React, {
  ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { interval } from 'rxjs';
import {
  AmbientLight,
  BufferGeometry,
  Group,
  Line,
  LineBasicMaterial,
  Object3D,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { DxfEntity } from '../../common/interfaces';
import { useInitThree } from '../../hooks';
import { getDxfDimension } from '../../utils';
import FloorMapJson from '../../common/sample/floorMap.json';
import { StyledViewerCanvas, StyledViewerContainer } from './Viewer.styles';
import { onLoadModel } from '../../utils';
import { getNumberOfMockModels } from './mock';

const MOCK_MODELS = getNumberOfMockModels(5);

const sampleDxfEntities = FloorMapJson as DxfEntity[];
const { lowerLeft, upperRight } = getDxfDimension(sampleDxfEntities);
const { x: minX, y: minY, z: minZ } = lowerLeft;
const { x: maxX, y: maxY } = upperRight;

type ViewerProps = ComponentPropsWithoutRef<'div'>;

export const Viewer: React.FC<ViewerProps> = (props) => {
  const viewerCanvasRef = useRef<HTMLCanvasElement>(null);

  const { scene, renderer, camera, controls, render } =
    useInitThree(viewerCanvasRef.current) || {};

  /**
   * Init static scene
   */
  useEffect(() => {
    if (
      !viewerCanvasRef.current ||
      !scene ||
      !camera ||
      !renderer ||
      !controls ||
      !render
    )
      return;

    renderer.setClearColor(0xffffffff);

    // Set camera position
    const centerX = (maxX - minX) / 2;
    const centerY = (maxY - minY) / 2;
    camera.position.set(centerX, centerY, 1000);
    controls.target.set(centerX, centerY, 0);

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
  }, [scene, camera, renderer, controls, render]);

  /**
   * Handle object moving animation
   */
  const animationFrameRef = useRef<{ [name: string]: number }>({});
  const animate = useCallback(
    (name: string): void => {
      if (!render) return undefined;
      const requestFrameId = requestAnimationFrame(() => animate(name));
      animationFrameRef.current[name] = requestFrameId;

      TWEEN.update();
      render();
    },
    [render]
  );

  const onLoadMockModels = (scene: Scene, renderer: WebGLRenderer): void => {
    MOCK_MODELS.forEach(({ url, name }) => {
      onLoadModel(url, renderer).then(({ gltf }) => {
        if (!gltf) return;

        gltf.scene.name = name;
        gltf.scene.scale.set(0.12, 0.12, 0.12);
        gltf.scene.rotateX(Math.PI / 2);

        scene.add(gltf.scene);
      });
    });
  };

  useEffect(() => {
    if (!renderer || !scene || !animate) return;

    onLoadMockModels(scene, renderer);

    const subscription = interval(1000).subscribe(() => {
      MOCK_MODELS.forEach(({ name, velocity }, index) => {
        const carModel = scene.getObjectByName(name);

        if (!carModel) return;

        carModel.position.y = lowerLeft.y + 240 + 60 * index;

        if (carModel.position.x > maxX - minX) carModel.position.x = 0;
        const currentModelX = carModel.position.x;

        new TWEEN.Tween(carModel.position)
          .to(
            {
              ...carModel.position,
              x: currentModelX + velocity,
            },
            1000
          )
          .onComplete(() => {
            animationFrameRef.current[name] &&
              cancelAnimationFrame(animationFrameRef.current[name]);
          })
          .start();

        animate(name);
      });
    });

    return (): void => {
      subscription.unsubscribe();
      Object.keys(animationFrameRef.current).forEach((name) => {
        cancelAnimationFrame(animationFrameRef.current[name]);
      });
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
