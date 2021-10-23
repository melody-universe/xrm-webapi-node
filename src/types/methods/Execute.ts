import { Response } from "node-fetch";

export type Execute = (request: ExecuteRequest) => Promise<Response>;

export interface ExecuteRequest {
  getMetadata: () => ExecuteMetadata;
  [key: string]: any;
}

export interface ExecuteMetadata {
  boundParameter?: "entity" | null | undefined;
  operationName?: string;
  operationType?: ExecuteOperationType;
  parameterTypes: ExecuteParameterTypes;
}

export enum ExecuteOperationType {
  Action = 0,
  Function = 1,
  CRUD = 2,
}

export interface ExecuteParameterTypes {
  [parameter: string]: {
    enumProperties?: ExecuteParameterTypeEnumProperty[];
    structuralProperty: ExecuteParameterTypeStructuralProperty;
    typeName: string;
  };
}

export interface ExecuteParameterTypeEnumProperty {
  name: string;
  value: number;
}

export enum ExecuteParameterTypeStructuralProperty {
  Unknown = 0,
  PrimitiveType = 1,
  ComplexType = 2,
  EnumerationType = 3,
  Collection = 4,
  EntityType = 5,
}
