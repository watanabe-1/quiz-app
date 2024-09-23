"use client";

import { NonLinkableSegment } from "@/@types/quizType";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbProps {
  nonLinkableSegments?: NonLinkableSegment[]; // Optional prop to specify non-linkable segments
}

interface BreadcrumbItem {
  label: string;
  href: string;
}

const Breadcrumb = ({ nonLinkableSegments = [] }: BreadcrumbProps) => {
  const pathname = usePathname();
  const pathArray = pathname.split("/").filter((path) => path);

  const breadcrumbs: BreadcrumbItem[] = pathArray.map((path, index) => {
    const href = "/" + pathArray.slice(0, index + 1).join("/");
    const label = decodeURIComponent(path);
    return { label, href };
  });

  return (
    <nav aria-label="breadcrumb">
      <ol className="flex flex-wrap items-center space-x-1 sm:space-x-2 text-sm sm:text-base break-words">
        <li>
          <Link href="/" className="text-green-500 hover:underline">
            ホーム
          </Link>
        </li>
        {breadcrumbs.map(
          (breadcrumb, index) =>
            !nonLinkableSegments.some(
              (segment) =>
                segment.label === breadcrumb.label && segment.index === index
            ) && (
              <li key={index} className="flex items-center break-words">
                <span className="mx-1 sm:mx-2">»</span>
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-500">{breadcrumb.label}</span>
                ) : (
                  <Link
                    href={breadcrumb.href}
                    className="text-gray-700 hover:underline"
                  >
                    {breadcrumb.label}
                  </Link>
                )}
              </li>
            )
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
