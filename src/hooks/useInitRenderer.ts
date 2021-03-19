import { useCallback, useEffect, useMemo, useState } from 'react';
import { Camera, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

export interface ThreeJsComponents {
  scene?: Scene;
  camera?: Camera;
  renderer?: WebGLRenderer;
  render: () => void;
}

export const useInitRenderer = (
  canvas: HTMLCanvasElement | null
): ThreeJsComponents => {
  const [isCanvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    setCanvasReady(true);
  }, [canvas]);

  const scene = useMemo(() => {
    if (!isCanvasReady) return undefined;

    return new Scene();
  }, [isCanvasReady]);

  const camera = useMemo(() => {
    if (!isCanvasReady || !canvas || !scene) return undefined;

    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;
    const cameraPerspective = canvasWidth / canvasHeight;

    const threeCamera = new PerspectiveCamera(45, cameraPerspective, 1, 100000);
    // threeCamera.position.set(0, 0, 1000);
    // threeCamera.lookAt(0, 0, 0);

    return threeCamera;
  }, [isCanvasReady, !canvas, scene]);

  const renderer = useMemo(() => {
    if (!isCanvasReady || !canvas || !scene || !camera) return undefined;

    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    const threeRenderer = new WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    threeRenderer.setSize(canvasWidth, canvasHeight);

    return threeRenderer;
  }, [isCanvasReady, canvas, scene, camera]);

  const render = useCallback((): void => {
    if (!scene || !camera || !renderer) return;

    renderer.render(scene, camera);
  }, [scene, camera, renderer]);

  return { scene, camera, renderer, render };
};
