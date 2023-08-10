import { Router } from 'express';
import { NamespaceController } from '@/controllers/namespace.controller';
import { Routes } from '@/interfaces/routes.interface';

import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class NamespaceRoute implements Routes {
  public path = '/v1/namespace';
  public router = Router();
  public namespaceController = new NamespaceController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    // Create
    this.router.post(
      `${this.path}`,
      AuthMiddleware,
      this.namespaceController.createNamespace,
    );

    // Get by userId
    this.router.get(
      `${this.path}/:userId`,
      AuthMiddleware,
      this.namespaceController.findNamespacesByUserId,
    );

    // Delete by id
    this.router.delete(
      `${this.path}/:id`,
      AuthMiddleware,
      this.namespaceController.deleteNamespaceById,
    );

    // Get (GET) namespace by namespace ID

    // Get (PATCH) new ClientId
    // Get (PATCH) new Client Secret
    // Update (PATCH) single namespace
  }
}
