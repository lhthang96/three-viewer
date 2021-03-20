import CarModel from '../../common/sample/car.glb';

interface Model3D {
  url: string;
  name: string;
  velocity: number;
}

const SAMPLE_CAR_ID = 'SAMPLE_CAR_ID';
export const MOCK_MODELS: Model3D[] = [
  {
    url: CarModel,
    name: `${SAMPLE_CAR_ID}1`,
    velocity: Math.floor(Math.random() * 80 + 20),
  },
  {
    url: CarModel,
    name: `${SAMPLE_CAR_ID}2`,
    velocity: Math.floor(Math.random() * 80 + 20),
  },
  {
    url: CarModel,
    name: `${SAMPLE_CAR_ID}3`,
    velocity: Math.floor(Math.random() * 80 + 20),
  },
  {
    url: CarModel,
    name: `${SAMPLE_CAR_ID}4`,
    velocity: Math.floor(Math.random() * 80 + 20),
  },
  {
    url: CarModel,
    name: `${SAMPLE_CAR_ID}5`,
    velocity: Math.floor(Math.random() * 80 + 20),
  },
  {
    url: CarModel,
    name: `${SAMPLE_CAR_ID}6`,
    velocity: Math.floor(Math.random() * 80 + 20),
  },
  {
    url: CarModel,
    name: `${SAMPLE_CAR_ID}7`,
    velocity: Math.floor(Math.random() * 80 + 20),
  },
  {
    url: CarModel,
    name: `${SAMPLE_CAR_ID}8`,
    velocity: Math.floor(Math.random() * 80 + 20),
  },
  {
    url: CarModel,
    name: `${SAMPLE_CAR_ID}9`,
    velocity: Math.floor(Math.random() * 80 + 20),
  },
  {
    url: CarModel,
    name: `${SAMPLE_CAR_ID}10`,
    velocity: Math.floor(Math.random() * 80 + 20),
  },
];
