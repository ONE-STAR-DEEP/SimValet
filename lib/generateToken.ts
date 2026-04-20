"use server";

import jwt from "jsonwebtoken";

type Payload = {
  vehicle: string;
  token: string;
};

export async function generateToken({ vehicle, token }: Payload) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const signedToken = jwt.sign(
    { vehicle, token },
    process.env.JWT_SECRET
    // no expiresIn → token never expires
  );

  return signedToken;
}