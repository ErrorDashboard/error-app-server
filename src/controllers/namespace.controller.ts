import { NextFunction, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { NamespaceService } from '@/services/namespace.service';

export class NamespaceController {
  public namespaceService = Container.get(NamespaceService);

  public createNamespace = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const namespace = req.body;
      await this.namespaceService.createNamespace(namespace);
      res.status(201).json({ data: 'Successfully Created' });
    } catch (error) {
      next(error);
    }
  };

  public findNamespacesByUserId = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user._id;
      const namespaces: any[] =
        await this.namespaceService.findNamespacesByUserId(userId);
      res.status(200).json({ namespaces });
    } catch (error) {
      next(error);
    }
  };

  public deleteNamespaceById = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id: string = req.params.namespaceId;
      await this.namespaceService.deleteNamespace(id);
      res.status(200).json({ data: 'Successfully Deleted' });
    } catch (error) {
      next(error);
    }
  };
}
