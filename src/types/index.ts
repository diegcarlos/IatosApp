export type RootStackParamList = {
  Home: undefined;
  CapturePhoto: undefined;
  PhotoReview: { photo: string; maskPoints: string };
  Result: { beforeAfterImages: { before: string; after: string } };
  History: undefined;
  SendToClinic: { simulationResult: { before: string; after: string } };
  Success: undefined;
};

export type Photo = {
  uri: string;
  maskPoints: { x: number; y: number }[];
};

export type SimulationResult = {
  id: string;
  date: string;
  before: string;
  after: string;
};

export type SimulationHistory = SimulationResult[];

// Novos tipos para os campos de idade e volume
export type AgeType = "elderly" | "middle-aged" | "young";
export type VolumeType = "more volume" | "less volume" | "natural";

export interface GeneratedType {
  message: string;
  files: Files;
  face: Face;
  shape: Shape;
  color: Color;
  result: Result;
}

interface Files {
  face: string;
  shape: string;
  color: string;
}

interface Face {
  path: string;
  url: string;
  size: any;
  orig_name: string;
  mime_type: any;
  is_stream: boolean;
  meta: Meta;
}

interface Meta {
  _type: string;
}

interface Shape {
  path: string;
  url: string;
  size: any;
  orig_name: string;
  mime_type: any;
  is_stream: boolean;
  meta: Meta2;
}

interface Meta2 {
  _type: string;
}

interface Color {
  path: string;
  url: string;
  size: any;
  orig_name: string;
  mime_type: any;
  is_stream: boolean;
  meta: Meta3;
}

interface Meta3 {
  _type: string;
}

interface Result {
  path: string;
  url: string;
  size: any;
  orig_name: string;
  mime_type: any;
  is_stream: boolean;
  meta: Meta4;
}

interface Meta4 {
  _type: string;
}
