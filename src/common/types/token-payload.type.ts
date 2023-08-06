//Controls the data inside a token
export type TokenPayload = {
        payload: {
            sub: string,
            email: string
        }
        type: string,
};