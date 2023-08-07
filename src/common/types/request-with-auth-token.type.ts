import { Request } from  'express';
import { TokenPayload } from './token-payload.type';

//Used to type annotate Express Request with the user propreties
export type RequestWithAuthToken = Request & {
    user: TokenPayload
};