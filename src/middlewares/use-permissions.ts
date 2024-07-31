import {
  Injectable,
  NestMiddleware,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common'; // Remover a importação de Use
import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

import { hasPermission, Permissions } from 'src/permissions';

interface RouteData {
  permissions: Permissions[];
}

@Injectable()
export class UsePermissionsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const routeDataOrFunc = Reflect.getMetadata(
      UsePermissionsMiddleware.name,
      req,
    );

    const user = req['user'] as User | null;
    if (!user) {
      throw new UnauthorizedException('Unauthorized (UsePermissions)');
    }

    const routeData =
      typeof routeDataOrFunc === 'function'
        ? routeDataOrFunc(req)
        : routeDataOrFunc;

    const hasPerm = hasPermission({
      userToCheck: user,
      permissionsToCheck: routeData.permissions,
    });

    if (!hasPerm) {
      throw new ForbiddenException('Invalid permissions (UsePermissions)');
    }

    next();
  }
}

type UsePermissionsFunc = (request: Request) => RouteData;
export function UsePermissions(data: UsePermissionsFunc | RouteData) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(
      UsePermissionsMiddleware.name,
      data,
      descriptor.value,
    );
    return descriptor.value; // Retornar o próprio descriptor.value sem aplicar Use
  };
}

export { Permissions };
