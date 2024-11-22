// src/application/dtos/CustomResponse.ts
export interface CustomResponse<T> {
    status: string;
    message: string;
    data: T;
    timestamp: string;
  }
  