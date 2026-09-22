const COUNTRIES = ["nl", "de"];

export async function fetchAdzunaJobs() {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) throw new Error("Missing Adzuna credentials");

  const allJobs = [];

  for (const country of COUNTRIES) {
    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=50&what=devops%20OR%20software%20engineer%20OR%20full%20stack`;

    const res = await fetch(url);
    if (!res.ok) continue; // skip this country if it fails, don't kill the whole run

    const data = await res.json();

    const jobs = data.results.map((job: any) => ({
      source: "adzuna",
      externalId: String(job.id),
      title: job.title,
      company: job.company?.display_name || "Unknown",
      location: job.location?.display_name || null,
      country: country.toUpperCase(),
      url: job.redirect_url,
      description: job.description,
      remote: false, // Adzuna doesn't reliably flag remote; leave false, refine later
      visaSponsor: false, // Adzuna has no visa tag; Phase 3 will fill this in via company matching
      postedAt: job.created ? new Date(job.created) : null,
    }));

    allJobs.push(...jobs);
  }

  return allJobs;
}