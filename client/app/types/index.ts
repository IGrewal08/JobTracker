export type Application = {
    id: string;
    createdAt: string;
    updatedAt: string;
    status: string;
    interviewAt: string | undefined;
    appliedAt: string | undefined;
    offerAmount: number | undefined;
    notes: string | undefined;
    coverLetter: string | undefined;
    job: Job;
}

export type Columns = {
    [key: string]: {
        id: string;
        title: string;
        applications: Application[];
    };
}

export type DraggedObject = {
    id: string;
    columnId: string;
}

export type Job = {
    id: string;
    title: string;
    createdAt: string;
    company: string;
    location: string;
    remote: boolean;
    salaryMin: number | undefined;
    salaryMax: number | undefined;
    description: string;
    url: string;
    postedAt: string | undefined;
    expiresAt: string | undefined;
    tags: string[];
}

export type User = {
    name: string | null;
}