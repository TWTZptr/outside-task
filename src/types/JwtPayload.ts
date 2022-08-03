export type JwtPayload = {
  iat?: Date;
  exp?: Date;
  uid: string;
}