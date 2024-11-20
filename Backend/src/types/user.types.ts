interface User {
    userName: string;
    email: string;
    password: string;
    phoneNumber:string;
}

export interface UserCookieData extends User {
    user: User,
    otp: string;
    timestamp: number;
}
