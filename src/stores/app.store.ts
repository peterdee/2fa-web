import { defineStore } from 'pinia';

interface AppState {
  showErrorModal: boolean;
  showMenu: boolean;
  showSuspendedModal: boolean;
}

const initialState: AppState = {
  showErrorModal: false,
  showMenu: false,
  showSuspendedModal: false,
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
      toggleSuspendedModal(isVisible: boolean): void {
        this.showSuspendedModal = isVisible;
      },
    },
    persist: false,
    state: (): AppState => ({ ...initialState }),
  },
);
