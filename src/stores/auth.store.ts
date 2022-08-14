import { defineStore } from 'pinia';

interface AuthState {
  login: string;
  token: string;
  userId: number | null;
}

const initialState: AuthState = {
  login: '',
  token: '',
  userId: null,
};

export const useStore = defineStore(
  'auth',
  {
    actions: {
      clearAuth(): void {
        this.login = initialState.login;
        this.token = initialState.token;
        this.userId = initialState.userId;
      },
      setAuth(payload: AuthState): void {
        this.login = payload.login;
        this.token = payload.token;
        this.userId = payload.userId;
      },
      setToken(payload: string): void {
        this.token = payload;
      },
    },
    persist: true,
    state: (): AuthState => ({ ...initialState }),
  },
);
