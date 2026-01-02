// src/services/authService.ts

import { apiClient } from "../lib/api/client";
import { LoginRequest, LoginResponse, User, UserRole } from "../types/api";

class AuthService {
    // Login qilish
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        // Backend GET request kutmoqda, query params bilan
        const response = await apiClient.post<LoginResponse>(
            `/auth/login?phone=${credentials.phone}&password=${credentials.password}`
        );

        console.log('Login response:', response);

        // Agar success bo'lsa - token va role'ni saqlash
        if (response.success && response.data) {
            this.saveAuthData(response.data, response.message as UserRole);
        }

        return response;
    }

    // Token va role'ni localStorage'ga saqlash
    private saveAuthData(token: string, role: UserRole): void {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_role', role);
        console.log('Auth data saved:', { role, tokenLength: token.length });
    }

    // JWT token'ni decode qilish
    decodeToken(token: string): User | null {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Token decode error:', error);
            return null;
        }
    }

    // Logout
    logout(): void {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        window.location.href = '/signin';
    }

    // Foydalanuvchi login qilganmi tekshirish
    isAuthenticated(): boolean {
        const token = localStorage.getItem('auth_token');
        return !!token;
    }

    // Token'ni olish
    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    // Role'ni olish
    getRole(): UserRole | null {
        return localStorage.getItem('user_role') as UserRole | null;
    }

    // Token'ni tekshirish va expire bo'lganmi ko'rish
    isTokenExpired(): boolean {
        const token = this.getToken();
        if (!token) return true;

        const decoded = this.decodeToken(token);
        if (!decoded || !decoded.exp) return true;

        // exp seconds'da, Date.now() milliseconds'da
        return decoded.exp * 1000 < Date.now();
    }
}

export const authService = new AuthService();