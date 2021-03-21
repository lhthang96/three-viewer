import CarModel from '../../common/sample/car.glb';

interface Model3D {
  url: string;
  name: string;
  velocity: number;
}

const SAMPLE_CAR_ID = 'SAMPLE_CAR_ID';

export const getNumberOfMockModels = (number: number): Model3D[] =>
  Array.from(Array(number).keys()).map((_, index) => ({
    url: CarModel,
    name: `${SAMPLE_CAR_ID}${index}`,
    velocity: Math.floor(Math.random() * 80 + 20),
  }));
