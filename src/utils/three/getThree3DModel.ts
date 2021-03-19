import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const gltfLoader = new GLTFLoader();

export const getThree3DModel = (url: string): Promise<GLTF> =>
  new Promise((resolve, reject) => {
    gltfLoader.load(
      url,
      (gltf) => {
        resolve(gltf);
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
