'use client';

import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';



interface AuthProviderProps {
    readonly children: ReactNode
}


interface AuthContextProps {
    isAuthenticated: boolean
    updateAuthenticated: (isAuth: boolean) => void

    userId: string | null
    updateUserId: (userId: string | null) => void
}

const AuthContext = createContext<AuthContextProps>(
    {} as AuthContextProps
)


export function AuthProvider({
    children
}: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | null>(null)

    const updateAuthenticated = (isAuth: boolean) => setIsAuthenticated(isAuth)

    const updateUserId = (userId: string | null) => setUserId(userId)

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        setIsAuthenticated(!!token);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, updateAuthenticated, userId, updateUserId }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    return context
}
