import { WebGLRenderer } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper';

const gltfLoader = new GLTFLoader();

interface GLTFComponents {
  gltf?: GLTF;
}

export const onLoadModel = (
  url: string,
  renderer: WebGLRenderer
): Promise<GLTFComponents> => {
  const roughnessMipmapper = new RoughnessMipmapper(renderer);

  return new Promise((resolve, reject) => {
    gltfLoader.load(
      url,
      (gltf) => {
        roughnessMipmapper.dispose();

        resolve({ gltf });
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
};
