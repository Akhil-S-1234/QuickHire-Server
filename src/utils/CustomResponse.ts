// src/utils/createResponse.ts
import { CustomResponse } from "../application/dtos/CustomResponse";

export function createResponse<T>(status: string, message: string, data: T): CustomResponse<T> {
  return {
    status,
    message,
    data,
    timestamp: new Date().toISOString()
  };
}
