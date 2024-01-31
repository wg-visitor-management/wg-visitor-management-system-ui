export interface LoginResponse {
    status: string;
    data: {
        AccessToken: string;
        ExpiresIn: number;
        TokenType: string;
        RefreshToken: string;
        IdToken: string;
    };
}

