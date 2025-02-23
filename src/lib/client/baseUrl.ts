export function getBaseURL() {
  const url = process.env.NEXT_PUBLIC_BASE_URL;

  return url
    ? `https://${url}`
    : `http://localhost:${process.env.PORT || 3000}`;
}
