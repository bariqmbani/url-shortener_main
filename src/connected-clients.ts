import { Response } from "express";

export type ClientData = {
  res: Response;
  url: string;
};

export const clients = new Map<string, ClientData>();
