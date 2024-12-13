declare module "jwt-decode" {
    interface JwtPayload {
        userId: number;
        email: string;
        iat: number;
        exp: number;
    }
}
