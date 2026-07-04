import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { authFetch } from "../services/api";
import { JobList } from "../components/Board/JobList";
import type { Job } from "../types";
import { JobFilters, type FilterValues } from "../components/Board/JobFilters";
import { useState } from "react";
import { requireToken } from "../services/session";
import { useSocket } from "../hooks/useSocket";

export async function loader({ request }: LoaderFunctionArgs) {
    const token = await requireToken(request);

    const jobs: Job[] = await authFetch<Job[]>("/api/jobs", token);

    const companies = [...new Set(jobs.map(j => j.company))];
    const locations = [...new Set(jobs.map(j => j.location).filter(Boolean))];
    const tags = [...new Set(jobs.flatMap(j => j.tags))];

    return { jobs, companies, locations, tags, token };
}

export default function JobsPage() {
    const { jobs: initial, companies, locations, tags, token } = useLoaderData<typeof loader>();
    const [jobs, setJobs] = useState<Job[]>(initial);

    useSocket({
        token,
        onNewJob: (job) => setJobs(prev => [job, ...prev]),
    });

    const handleFilterSubmit = async (filters: FilterValues) => {
        try {
            const params = new URLSearchParams();
            if (filters.search) params.set("search", filters.search);
            if (filters.remote) params.set("remote", filters.remote);
            if (filters.postedWithin) params.set("postedWithin", filters.postedWithin);
            if (filters.salaryMin) params.set("salaryMin", filters.salaryMin);
            if (filters.salaryMax) params.set("salaryMax", filters.salaryMax);
            if (filters.sort) params.set("sort", filters.sort);
            filters.jobTypes.forEach(v => params.append("jobType", v));
            filters.companies.forEach(v => params.append("company", v));
            filters.locations.forEach(v => params.append("location", v));
            filters.tags.forEach(v => params.append("tag", v));

            const filtered = await authFetch(`/api/jobs?${params.toString()}`, token);
            setJobs(filtered as Job[]);
        } catch (err: any) {
            console.error("Failed to fetch filtered jobs:", err.message);
        }
    };

    const handleSave = async (formData: FormData, jobId: string) => {
        try {
        await authFetch("/api/applications", token, {
            method: "POST",
            body: JSON.stringify({
            jobId,
            status:      formData.get("status")      || "SAVED",
            appliedAt:   formData.get("appliedAt")   || undefined,
            interviewAt: formData.get("interviewAt") || undefined,
            offerAmount: formData.get("offerAmount") || undefined,
            notes:       formData.get("notes")       || undefined,
            coverLetter: formData.get("coverLetter") || undefined,
            }),
        });
        } catch (err: any) {
        console.error("Save failed:", err.message);
        }
    };

    const handleDelete = (jobId: string) => {
        setJobs(prev => prev.filter(j => j.id !== jobId));
    };


    return (
        <div>
            <JobFilters 
                companies={companies} 
                locations={locations} 
                tags={tags} 
                onSubmit={handleFilterSubmit} 
            />
            <JobList 
                jobs={jobs} 
                onSave={handleSave}
                onDelete={handleDelete}
            />
        </div>
    );
}