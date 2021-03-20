export interface Task {
    name: string;
    description: string;
    priority: number;
    files: string[];
    category: string;
    assignedTo: {
        userIds: string[];
        location: {
            divisionLevel: number;
            divisionId: string
        }
    }
}

export interface Priority {
    value: number,
    viewValue: string;
}

export interface Secretariat {
    value: string;
    viewValue: string;
}

export interface GvType {
    value: string;
    viewValue: string;
}

export interface ReportType {
    value: string;
    viewValue: string;
}

export interface TaskResponse {
    _id: string;
    name: string;
    description: string;
    priority: number;
    files:string[];
    createdOn: string;
    status: string;
    category: {
        _id: string;
        name: string;
    }
}


export interface TaskRes {
    count: number;
    tasks: TaskResponse[];
}

export interface Status {
    code: string;
    name: string;
}

export interface StatusUpdatedBy {
    value: string;
    viewValue: string;
}

export interface TaskList {
    count: 0,
    tasks: TaskInTaskList[]
}

export interface TaskInTaskList {
    _id: string;
    name: string,
    description: string,
    priority: 0,
    files: [
        string
    ],
    createdOn: string,
    status: string,
    category: {
        _id: string,
        name: string
    }
}
