export interface User{
    id:string;
    name:string;
    email:string;
    role:'user'|'tutor'|'admin';
}

export interface AuthState{
    user: User | null;
    isAuthenticated: boolean;
    loading:boolean;
    error:string|null;
}

export interface LoginCredentials{
    email:string;
    password:string;
}