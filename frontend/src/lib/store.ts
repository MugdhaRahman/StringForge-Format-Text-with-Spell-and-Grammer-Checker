import { fetchHistory, clearHistory, deleteHistory, login, signup, transformText, type Endpoint, type HistoryItem } from "@/lib/api";
import { create } from "zustand";

const actionPaths: Record<Endpoint, string> = {
  clean: "/api/clean",
  slug: "/api/slug",
  camel: "/api/case/camel",
  snake: "/api/case/snake",
  title: "/api/case/title",
  spell: "/api/spell",
};

type State = {
  token: string | null;
  result: string | null;
  error: string | null;
  loading: Endpoint | null;
  history: HistoryItem[];
  historyLoading: boolean;
  runAction: (action: Endpoint, text: string) => Promise<void>;
  authSignup: (username: string, password: string) => Promise<void>;
  authLogin: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loadHistory: () => Promise<void>;
  removeHistory: (id: number) => Promise<void>;
  clearAllHistory: () => Promise<void>;
};

export const useAppStore = create<State>((set, get) => ({
  token: null,
  result: null,
  error: null,
  loading: null,
  history: [],
  historyLoading: false,

  async runAction(action, text) {
    set({ error: null, result: null, loading: action });
    try {
      if (!text.trim()) {
        throw new Error("Please enter some text first.");
      }
      const path = actionPaths[action];
      const res = await transformText(path, text, get().token || undefined);
      set({ result: res.result });
      if (get().token) await get().loadHistory();
    } catch (err: any) {
      set({ error: err.message || "Request failed" });
    } finally {
      set({ loading: null });
    }
  },

  async authSignup(username, password) {
    set({ error: null });
    if (!username || !password) throw new Error("Username and password required");
    await signup(username, password);
    await get().authLogin(username, password);
  },

  async authLogin(username, password) {
    set({ error: null });
    if (!username || !password) throw new Error("Username and password required");
    const data = await login(username, password);
    set({ token: data.access_token });
    if (typeof window !== "undefined") {
      localStorage.setItem("jwt", data.access_token);
    }
    await get().loadHistory();
  },

  logout() {
    set({ token: null, history: [] });
    if (typeof window !== "undefined") {
      localStorage.removeItem("jwt");
    }
  },

  async loadHistory() {
    const token = get().token;
    if (!token) return;
    set({ historyLoading: true, error: null });
    try {
      const data = await fetchHistory(token);
      set({ history: data });
    } catch (err: any) {
      set({ error: err.message || "Could not load history" });
    } finally {
      set({ historyLoading: false });
    }
  },

  async removeHistory(id: number) {
    const token = get().token;
    if (!token) return;
    await deleteHistory(token, id);
    await get().loadHistory();
  },

  async clearAllHistory() {
    const token = get().token;
    if (!token) return;
    await clearHistory(token);
    await get().loadHistory();
  },
}));
