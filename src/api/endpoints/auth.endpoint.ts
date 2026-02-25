export interface AuthEndpoints {
    register: () => string;
    login: () => string;
}


export const AuthEndpoints: AuthEndpoints = {
    register: () => '/api/v1/users',
    login: () => '/api/v1/users/login',
}