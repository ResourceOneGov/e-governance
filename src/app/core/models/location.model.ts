export interface Location  {
    divisionType: string;
    divisionLevel: number;
    divisions: Division[];
}

export interface Division {
    _id: string;
    locationName: string;
    subDivisionTo: string[];
}