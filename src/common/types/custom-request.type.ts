import { Request } from  'express';

//Used to type annotate Express Request with the user propreties
export type RequestWithAuthToken = Request & {
    user: {
        payload: {
            sub: string,
            email: string
        }
        type: string
    }
};