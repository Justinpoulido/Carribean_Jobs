import { resolveJob } from "@/lib/load-public-jobs";
import { shareImage, shareSize } from "@/lib/share-image";

export const alt = "Caribbean Jobs vacancy";
export const size = shareSize;
export const contentType = "image/png";
export const revalidate = 3600;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { job } = await resolveJob(slug);
  if (!job) {
    return shareImage("Caribbean Jobs", "Job not listed", "carribeanjobs.online");
  }
  return shareImage(job.title, job.companyName, job.country);
}
