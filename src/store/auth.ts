import { LoggedInUserDto } from "../models/loggedin-user.dto";
import { create } from 'zustand';
import { EncryptionService } from "../utils/encryption.service";
import { AppConfig } from "@/utils/app.config";

interface AuthState {
    user: LoggedInUserDto | null;
    token: string | null;
    login: (token: any) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    login: (token: any) => set({
        user: getUserFromToken(token),
        token
    }),
    logout: () => set({ user: null, token: null }),
}));

export const getUserFromToken = (token: string): LoggedInUserDto => {
    let profile = JSON.parse(atob(token.split('.')[1]));
    return JSON.parse(EncryptionService.decrypt(profile.account, AppConfig().CLIENT_ENCRYPTION_KEY).replace(/[\x00-\x1F\x7F]/g, ''));
};