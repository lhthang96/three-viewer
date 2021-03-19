import { useEffect, useMemo, useState } from 'react';
import { Camera, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

interface ThreeJsComponents {
  scene?: Scene;
  camera?: Camera;
  renderer?: WebGLRenderer;
  render: () => void;
}

export const useInitThree = (
  canvas: HTMLCanvasElement | null
): ThreeJsComponents | null => {
  const [isCanvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    setCanvasReady(true);
  }, [canvas]);

  const threeComponents: ThreeJsComponents | null = useMemo(() => {
    if (!isCanvasReady || !canvas) return null;

    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    /**
     * create `scene`
     */
    const scene = new Scene();

    /**
     * create `camera`
     */
    const cameraPerspective = canvasWidth / canvasHeight;
    const camera = new PerspectiveCamera(45, cameraPerspective, 1, 100000);

    /**
     * create `renderer`
     */

    const renderer = new WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    renderer.setSize(canvasWidth, canvasHeight);

    /**
     * `render` function
     */
    const render = () => renderer.render(scene, camera);

    return { scene, camera, renderer, render };
  }, [isCanvasReady, canvas]);

  return threeComponents;
};
