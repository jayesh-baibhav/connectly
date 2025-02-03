import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import prismaClient from "../../services/prisma";

const KINDE_DOMAIN = process.env.KINDE_DOMAIN
const client = jwksClient({
    jwksUri: `${KINDE_DOMAIN}/.well-known/jwks.json`,
});

const verifyToken = async (token: string) => {
  if (!token) throw new Error("Token is missing");

  const decoded = jwt.decode(token, { complete: true });
  if (!decoded || !decoded.header) throw new Error("Invalid JWT token format");

  const { kid } = decoded.header;
  if (!kid) throw new Error("Missing kid in JWT header");

  const key = await client.getSigningKey(kid);
  const signingKey = key.getPublicKey();

  return jwt.verify(token, signingKey);
};

const handleUserCreation = async (event: any) => {
  if (!event || !event.data || !event.data.user) throw new Error("Invalid event structure");

  const {  id, email, first_name, last_name  } = event.data.user;
  
  if (!id || !email) throw new Error("User ID or email missing in event data");


  const createdUser = await prismaClient.user.create({
    data: { id, email,  first_name, last_name},
  });
  console.log("User Saved:", createdUser);

  return createdUser;
};

export const userCreated = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.body.toString();

    const event = await verifyToken(token);
    const userData = await handleUserCreation(event);

    return res.status(200).json({
      message: "User processed successfully",
      data: userData,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    return res.status(400).json({ error: error.message });
  }
};
