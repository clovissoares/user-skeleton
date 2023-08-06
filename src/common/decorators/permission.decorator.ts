import {SetMetadata} from '@nestjs/common';
import  Permission  from '../types/premission.type';

export const SetPermission = (...permissions: Permission[]) => SetMetadata('permissions', permissions);