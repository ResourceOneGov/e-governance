export interface Login {
    userId: string;
    password: string;
}

export interface ChangePassword {
    oldPassword: string;
    newPassword: string;
}