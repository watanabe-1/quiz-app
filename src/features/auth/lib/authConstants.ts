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
