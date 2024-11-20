import { path, path_auth_login } from "@/lib/path";

/**
 * The default redirect path after logging in
 */
const DEFAULT_LOGIN_REDIRECT = path().$url().path;

/**
 * The redirect path after logging in
 */
export const LOGIN_REDIRECT = DEFAULT_LOGIN_REDIRECT;

/**
 * The default login path
 */
const DEFAULT_LOGIN_ROUTE = path_auth_login().$url().path;

/**
 * The login path
 */
export const LOGIN_ROUTE = process.env.LOG_IN_PAGE ?? DEFAULT_LOGIN_ROUTE;

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 */
export const API_AUTH_PREFIX = "/api/auth";

/**
 * A comma-separated string containing paths that are protected and accessible only by admin users.
 *
 * Each path in the string represents a route that requires administrative privileges to access.
 * The paths are separated by commas, allowing easy splitting into an array for further processing.
 *
 * @example
 * // Usage
 * const paths = ADMIN_PROTECTED_PATHS.split(',');
 * console.log(paths); // ["/admin", "/api/admin"]
 */
export const ADMIN_PROTECTED_PATHS = "/admin,/api/admin";
