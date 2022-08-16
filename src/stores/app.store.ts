import { defineStore } from 'pinia';

interface AppState {
  showMenu: boolean;
}

const initialState: AppState = {
  showMenu: false,
};

export const useAppStore = defineStore(
  'app',
  {
    actions: {
      toggleMenu(isVisible: boolean): void {
        this.showMenu = isVisible;
      },
    },
    persist: false,
    state: (): AppState => ({ ...initialState }),
  },
);
