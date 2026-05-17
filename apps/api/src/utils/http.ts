import { Response } from "express";

export function sendError(res: Response, status: number, message: string): Response {
  return res.status(status).json({ error: message });
}
