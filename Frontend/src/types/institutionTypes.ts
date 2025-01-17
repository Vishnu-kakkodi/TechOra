export interface Institute{
    collegeName: string;
    instituteEmail: string;
    collegeCode: string;
    country:string;
    state: string;
    department: string;
    district: string;   
}

export interface InstituteType{
    instituteEmail:string;
    collegeCode:string;
}

export interface TutorFormData {
    department: string;
    tutorname: string;
    education: string;
    experiance: string;
    gender: string;
  }