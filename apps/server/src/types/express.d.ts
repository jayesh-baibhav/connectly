declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                given_name: string;
                family_name: string;
                roles: string[];
                permissions: string[];
            };
            session?: {
                access_token?: string;
            };
        }
    }
}

export {};
