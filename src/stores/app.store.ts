import { defineStore } from 'pinia';

interface AppState {
  showErrorModal: boolean;
  showMenu: boolean;
}

const initialState: AppState = {
  showErrorModal: false,
  showMenu: false,
};

export const useAppStore = defineStore(
  'app',
  {
    actions: {
      toggleErrorModal(isVisible: boolean): void {
        this.showErrorModal = isVisible;
      },
      toggleMenu(isVisible: boolean): void {
        this.showMenu = isVisible;
      },
    },
    persist: false,
    state: (): AppState => ({ ...initialState }),
  },
);
