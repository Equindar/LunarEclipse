import { Router } from "express";

export interface VersionStrategy {
    getRouter(): Router;
}