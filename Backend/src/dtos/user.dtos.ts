export class CreateUserDto{
    userName!: string;
    email!: string;
    password!: string;
    phoneNumber!: string;
}

export class UpdateUserDto{
    userName?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
}