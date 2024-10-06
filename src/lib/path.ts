export const createPath = (
  basePath: string,
  ...segments: (string | number)[]
): string => {
  const encodedSegments = segments.map((segment) =>
    encodeURIComponent(segment.toString())
  );
  return `/${basePath}/${encodedSegments.join("/")}`;
};
