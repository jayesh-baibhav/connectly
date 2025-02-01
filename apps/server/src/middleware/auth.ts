import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';


interface KindeUser extends JwtPayload {
    id: string;
    email: string;
    given_name: string;
    family_name: string;
    roles: string[];
    permissions: string[];
}

interface AuthenticatedRequest extends Request {
    user?: KindeUser;
}

const KINDE_DOMAIN = process.env.KINDE_DOMAIN
const client = jwksClient({
    jwksUri: `${KINDE_DOMAIN}/.well-known/jwks.json`,
});

const getKey = (header: jwt.JwtHeader, callback: (err: VerifyErrors | null, key?: string) => void): void => {
    client.getSigningKey(header.kid as string, (err, key) => {
        if (err) {
            console.error('Error fetching signing key:', err);
            callback(err as VerifyErrors);
            return;
        }
        const signingKey = key?.getPublicKey();
        callback(null, signingKey);
    });
};

const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err);
            res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
            return;
        }

        const kindeUser = decoded as KindeUser;
        console.log(kindeUser)

        if (!kindeUser.sub && !kindeUser.email) {
            res.status(400).json({ message: 'Invalid token payload' });
            return;
        }

        req.user = kindeUser;
        next();
    });
};

export default authenticateUser;
