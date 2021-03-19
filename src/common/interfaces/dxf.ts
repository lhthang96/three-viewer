import { Coordinates3D } from './common';

export type DxfText = {
  type: 'TEXT';
  text: string;
  layer: string;
  startPoint: Coordinates3D;
  endPoint: Coordinates3D;
  ownerHandle?: string;
  textHeight?: number;
  halign?: number;
  handle?: string;
  valign?: number;
  xScale?: number;
};

export type DxfPolyLine = {
  type: 'LWPOLYLINE';
  layer: string;
  vertices: Coordinates3D[];
  handle?: string;
  ownerHandle?: string;
  hasContinuousLinetypePattern?: boolean;
  lineType?: 'HIDDEN' | string;
  shape?: boolean;
};

export type DxfLine = {
  type: 'LINE';
  layer: string;
  vertices: Coordinates3D[];
  handle?: string;
  ownerHandle?: string;
};

export type DxfEntity = DxfLine | DxfPolyLine | DxfText;
export type DxfDimension = {
  lowerLeft: Coordinates3D;
  upperRight: Coordinates3D;
};
