import { NamespaceModel } from '@/models/namespace.model';
import mongoose from 'mongoose';
import { Service } from 'typedi';

@Service()
export class NamespaceService {
  public async createNamespace(data: any): Promise<any> {
    const createNamespaceObject = await NamespaceModel.create(data);
    const namespaceInstance = createNamespaceObject.toObject();
    return namespaceInstance;
  }

  public async findNamespacesByUserId(
    userId: mongoose.Schema.Types.ObjectId,
  ): Promise<any[]> {
    const namespaces = await NamespaceModel.find({ users: userId });
    return namespaces.map((namespace) => namespace.toObject());
  }

  public async deleteNamespace(id: string): Promise<boolean> {
    const result = await NamespaceModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new Error('Not Found');
    }
    return result.deletedCount === 1;
  }
}
