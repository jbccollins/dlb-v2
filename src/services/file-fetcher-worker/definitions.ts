export enum EMessageType {
  Progress = 'Progress',
  Results = 'Results',
  Error = 'Error',
}

export interface WorkerOutput {
  type: EMessageType;
  number: number;
  error?: string;
}

export interface WorkerInput {
  number: number;
}