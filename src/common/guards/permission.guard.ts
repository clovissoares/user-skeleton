import {Injectable, ExecutionContext, CanActivate} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithAuthToken } from '../types/custom-request.type';

//This guard should be used in conjuction with AuthGuard
@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
        const permission = this.reflector.getAllAndOverride<string[]>('permissions', [context.getHandler(), context.getClass()]);
        const request: RequestWithAuthToken = context.switchToHttp().getRequest();
        
        return true;
    }
}