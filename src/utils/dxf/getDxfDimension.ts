import {
  Coordinates3D,
  DxfDimension,
  DxfEntity,
} from '../../common/interfaces';

const getLowerLeft = (
  lowerLeft: Coordinates3D,
  vertices: Coordinates3D[]
): Coordinates3D => {
  const {
    x: currentMinX = 0,
    y: currentMinY = 0,
    z: currentMinZ = 0,
  } = lowerLeft;
  const entityXValues = vertices.map((vertex) => vertex.x || 0);
  const entityYValues = vertices.map((vertex) => vertex.y || 0);
  const entityZValues = vertices.map((vertex) => vertex.z || 0);

  return {
    x: Math.min.apply(Math, [currentMinX, ...entityXValues]),
    y: Math.min.apply(Math, [currentMinY, ...entityYValues]),
    z: Math.min.apply(Math, [currentMinZ, ...entityZValues]),
  };
};

const getUpperRight = (
  upperRight: Coordinates3D,
  vertices: Coordinates3D[]
): Coordinates3D => {
  const {
    x: currentMaxX = 0,
    y: currentMaxY = 0,
    z: currentMaxZ = 0,
  } = upperRight;
  const entityXValues = vertices.map((vertex) => vertex.x || 0);
  const entityYValues = vertices.map((vertex) => vertex.y || 0);
  const entityZValues = vertices.map((vertex) => vertex.z || 0);

  return {
    x: Math.max.apply(Math, [currentMaxX, ...entityXValues]),
    y: Math.max.apply(Math, [currentMaxY, ...entityYValues]),
    z: Math.max.apply(Math, [currentMaxZ, ...entityZValues]),
  };
};

export const getDxfDimension = (entities: DxfEntity[]): DxfDimension => {
  const defaultCoordinates: Coordinates3D = { x: 0, y: 0, z: 0 };
  let lowerLeft: Coordinates3D = defaultCoordinates;
  let upperRight: Coordinates3D = defaultCoordinates;

  entities.forEach((entity) => {
    if (entity.type === 'LINE') {
      const { vertices } = entity;
      lowerLeft = getLowerLeft(lowerLeft, vertices);
      upperRight = getUpperRight(upperRight, vertices);
    }

    if (entity.type === 'LWPOLYLINE') {
      const { vertices } = entity;
      lowerLeft = getLowerLeft(lowerLeft, vertices);
      upperRight = getUpperRight(upperRight, vertices);
    }
  });

  return { lowerLeft, upperRight };
};
