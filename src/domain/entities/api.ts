export interface ApiError {
    message: string;
    statusCode?: number;
}

export interface AxiosErrorResponse {
    request: XMLHttpRequest | null;
    message(arg0: string, message: unknown): unknown;
    response?: {
        data?: {
            message?: string;
            error?: string;
        };
        status?: number;
    };
}