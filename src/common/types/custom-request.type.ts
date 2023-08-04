import { Request } from  'express';

//Used to type annotate Express Request with the user propreties
export type CustomRequest = Request & {
    user: {
        payload: {
            sub: string,
            email: string
        }
        type: string,
        iat: number,
        exp: number
    }
};