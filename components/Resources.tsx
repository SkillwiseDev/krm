import Image from "next/image";
import Link from "next/link";
import resourceImage from "@/public/resource.png";
import type { SiteResources } from "@/lib/site-resources-store";

type ResourcesProps = {
  data: SiteResources;
};

export default function Resources({ data }: ResourcesProps) {
  return (
    <section className="resources" aria-labelledby="resources-title">
      <h2 id="resources-title">{data.title}</h2>

      <div className="resources__content">
        <ul className="resources__links">
          {data.links.map((resource) => (
            <li key={resource.id}>
              {resource.fileUrl ? (
                <a href={resource.fileUrl} download>
                  {resource.title}
                </a>
              ) : (
                <Link href={resource.href || "#"}>{resource.title}</Link>
              )}
            </li>
          ))}
        </ul>

        <div className="resources__visual">
          <div className="resources__shape" aria-hidden="true" />
          {data.imageUrl ? (
            <Image
              src={data.imageUrl}
              alt=""
              width={520}
              height={420}
              sizes="(max-width: 600px) 48vw, 520px"
            />
          ) : (
            <Image
              src={resourceImage}
              alt="KRM BioScan laboratory analyzer and reagent products"
              sizes="(max-width: 600px) 48vw, 520px"
            />
          )}
        </div>
      </div>
    </section>
  );
}
