import { Router } from "express";

export interface IRouter {
  create(): Router;
}