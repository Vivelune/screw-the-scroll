export async function fetchArbeitnowJobs() {
    const res = await fetch("https://arbeitnow.com/api/job-board-api");
    if (!res.ok) throw new Error("Arbeitnow fetch failed");
    const data = await res.json();
  
    return data.data.map((job: any) => ({
      source: "arbeitnow",
      externalId: job.slug,
      title: job.title,
      company: job.company_name,
      location: job.location || null,
      country: null, // Arbeitnow doesn't give a clean country field; we infer later if needed
      url: job.url,
      description: job.description,
      remote: Boolean(job.remote),
      visaSponsor: Array.isArray(job.tags) && job.tags.some((t: string) =>
        t.toLowerCase().includes("visa")
      ),
      postedAt: job.created_at ? new Date(job.created_at * 1000) : null,
    }));
  }