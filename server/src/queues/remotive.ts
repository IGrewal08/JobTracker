import type { JobType } from '@prisma/client';

type RemotiveRawJob = {
  url: string;
  title: string;
  company_name: string;
  category?: string;
  job_type?: string;
  publication_date?: string;
  candidate_required_location?: string;
  salary?: string;
  description: string;
};

const JOB_TYPE_MAP: Record<string, JobType> = {
  full_time: 'FULL_TIME',
  part_time: 'PART_TIME',
  contract: 'CONTRACT',
  freelance: 'CONTRACT',
  internship: 'INTERNSHIP',
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseSalaryRange(salaryStr?: string): {
  salaryMin?: number;
  salaryMax?: number;
} {
  if (!salaryStr) return {};
  const matches = salaryStr.match(/[\d,.]+k?/gi);
  if (!matches?.length) return {};

  const toNumber = (s: string) => {
    const isK = /k$/i.test(s);
    const num = parseFloat(s.replace(/[k,]/gi, ''));
    return isK ? num * 100 : num;
  };

  const nums = matches.map(toNumber).filter((n) => !isNaN(n));
  if (nums.length === 0) return {};
  if (nums.length === 1) return { salaryMin: nums[0] };
  return {
    salaryMin: Math.min(nums[0] ?? 0, nums[1] ?? 0),
    salaryMax: Math.max(nums[0] ?? 0, nums[1] ?? 0),
  };
}

export function mapRemotiveJob(raw: RemotiveRawJob) {
  return {
    title: raw.title,
    company: raw.company_name,
    location: raw.candidate_required_location,
    remote: true,
    description: stripHtml(raw.description),
    url: raw.url,
    source: 'remotive',
    tags: raw.category ? [raw.category] : [],
    jobType: raw.job_type
      ? JOB_TYPE_MAP[raw.job_type.toLowerCase()]
      : undefined,
    postedAt: raw.publication_date ? new Date(raw.publication_date) : undefined,
    ...parseSalaryRange(raw.salary),
  };
}
