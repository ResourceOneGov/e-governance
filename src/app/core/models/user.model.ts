export interface User{
    userId: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    email?: string;
    _id: string;
}

export interface UserResp {
    count: number;
    users: User[];
}

export interface Roles {
    _id: string,
    roleName: string,
    roleLevel: number,
    assignedLocationLevels: number[]
}

export class LocationAccess {
    divisionType: string;
    divisionLevel: number;
    division: string;
}

export interface UserReports {
    totalPresentUsers: [{type: string, count: number}];
    totalUsersWithGoodAssessment: [{ type: string, count: number}];
}