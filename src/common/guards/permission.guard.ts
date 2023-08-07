import {Injectable, ExecutionContext, CanActivate, UnauthorizedException} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithAuthToken } from '../types/request-with-auth-token.type';

//This guard should be used in conjuction with AuthGuard
@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
        try{
            const permission = this.reflector.getAllAndOverride<string[]>('permissions', [context.getHandler(), context.getClass()]);
            const request: RequestWithAuthToken = context.switchToHttp().getRequest();
            
            if(!permission) {
                throw 'Route does not have a permission type setted';
            }

            if(!request.user){
                throw 'User must be authenticated';
            }

            if(!this.validatePermission(permission, request.user.permissions)){
                throw 'User does not have permission to access this route';
            }
            
            return true;
        } catch(err) {
            throw new UnauthorizedException(err);
        }
    }

    validatePermission(permissions: string[], userPermissions: string[]){
        return permissions.some(permission => userPermissions.includes(permission));
    }
}