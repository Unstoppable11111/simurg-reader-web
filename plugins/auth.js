import { useAuthStore } from "@/stores/auth";

export default defineNuxtPlugin(() => {
  if (process.client) {
    const authStore = useAuthStore();
    authStore.initFromLocalStorage();
  }
});