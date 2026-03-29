import { NextRequest, NextResponse } from "next/server";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "";
const RAPIDAPI_HOST = "jsearch.p.rapidapi.com";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const location = searchParams.get("location") || "";
    const page = searchParams.get("page") || "1";

    if (!query) {
      return NextResponse.json(
        { error: "Missing search query" },
        { status: 400 }
      );
    }

    if (!RAPIDAPI_KEY) {
      return NextResponse.json(
        { error: "Job search not configured" },
        { status: 503 }
      );
    }

    const searchQuery = location ? `${query} in ${location}` : query;
    const url = `https://${RAPIDAPI_HOST}/search?query=${encodeURIComponent(searchQuery)}&page=${page}&num_pages=1`;

    const res = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`JSearch API error: ${res.status} - ${text}`);
    }

    const data = await res.json();

    // Format the results
    const jobs = (data.data || []).map(
      (job: {
        job_id: string;
        job_title: string;
        employer_name: string;
        job_description: string;
        job_city: string;
        job_state: string;
        job_country: string;
        job_apply_link: string;
        job_posted_at_datetime_utc: string;
        job_min_salary: number;
        job_max_salary: number;
        job_salary_currency: string;
        employer_logo: string;
      }) => ({
        id: job.job_id,
        title: job.job_title,
        company: job.employer_name,
        description: job.job_description?.substring(0, 500) + "...",
        location: [job.job_city, job.job_state, job.job_country]
          .filter(Boolean)
          .join(", "),
        applyUrl: job.job_apply_link,
        postedAt: job.job_posted_at_datetime_utc,
        salary: job.job_min_salary
          ? `${job.job_salary_currency || "$"}${job.job_min_salary.toLocaleString()} - ${job.job_max_salary?.toLocaleString()}`
          : null,
        logo: job.employer_logo,
      })
    );

    return NextResponse.json({ jobs, total: data.total || jobs.length });
  } catch (error: unknown) {
    console.error("Job search error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Search failed" },
      { status: 500 }
    );
  }
}
