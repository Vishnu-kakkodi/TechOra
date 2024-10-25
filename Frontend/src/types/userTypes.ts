export interface User{
    userName:string;
    email:string;
    password:string;
    confirmPassword:string;
    phoneNumber:string;
    
}

export interface UserLogin{
    email:string;
    password:string;
}