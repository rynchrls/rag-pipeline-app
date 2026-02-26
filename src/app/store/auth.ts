import { create } from 'zustand'


interface AuthState {
    user: {
        id?: number | null;
        email?: string | null
    },
    saveUser: (params: { id: number; email: string }) => void
}

const useAuth = create<AuthState>((set) => ({
    user: {
        id: null,
        email: null
    },
    saveUser: (params: { id: number; email: string }) => set(() => ({ user: { ...params } }))
}))


export { useAuth }