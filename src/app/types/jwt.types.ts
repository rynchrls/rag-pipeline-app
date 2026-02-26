// Define the type for your JWT payload
export interface JwtPayload {
    sub: string;
    id: number;
    exp: number;
    [key: string]: unknown; // for additional fields
}