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
};

export type Columns = Record<
  string,
  {
    id: string;
    title: string;
    applications: Application[];
  }
>;

export type DraggedObject = {
  id: string;
  columnId: string;
};

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
  jobType: JobType | undefined;
  timeAgo: string | undefined;
};

export type User = {
  name: string;
};

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';

export type ScrapeFilter = {
  id: string;
  createdAt: string;
  updatedAt: string;
  keywords: string[];
  location: string | undefined;
  remoteOnly: boolean;
  jobTypes: JobType[];
  salaryMin: number | undefined;
  lastScrapedAt: string | undefined;
  userId: string;
};

export type ScrapeFilterInput = {
  keywords: string[];
  location?: string;
  remoteOnly: boolean;
  jobTypes: JobType[];
  salaryMin?: number;
};

export type ApplicationStatus =
  | 'SAVED'
  | 'APPLIED'
  | 'INTERVIEWING'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN';
