/**
 * Represents media content, which can include text and/or an image.
 */
export interface MediaContent {
  /** Optional unique identifier for the media content. */
  id?: number;
  /** Optional text content for the media. */
  text?: string;
  /** Optional URL or path to an image for the media content. */
  image?: string;
}

/**
 * Represents an option in a question, which may include text, an image, and an optional explanation.
 */
export interface QuestionOption {
  /** Optional unique identifier for the question option. */
  id?: number;
  /** Text content for the option, required. */
  text: string;
  /** Optional URL or path to an image representing the option. */
  image?: string;
  /** Optional explanation related to the option. */
  explanation?: MediaContent;
}

/**
 * Represents a category for questions or options.
 */
export interface Category {
  /** Optional unique identifier for the category. */
  id?: number;
  /** Name of the category, required. */
  name: string;
}

/**
 * Represents a grade level or difficulty associated with a question.
 */
export interface Grade {
  /** Optional unique identifier for the grade. */
  id?: number;
  /** Name of the grade, required. */
  name: string;
}

/**
 * Represents a single question, including its content, options, answer, and explanation.
 */
export interface QuestionData {
  /** Optional unique identifier for the question data. */
  id?: number;
  /** Unique identifier for the question. */
  questionId: number;
  /** The qualification or qualification of the question. */
  qualification: string;
  /** The grade or difficulty level of the question. */
  grade: string;
  /** The year or year of the question. */
  year: string;
  /** The category name for the question, treated as a string. */
  category: string;
  /** The content of the question, which may include text or an image. */
  question: MediaContent;
  /** List of possible options for answering the question. */
  options: QuestionOption[];
  /** The index of the correct answer within the options array. */
  answer: number;
  /** Optional explanation for the question, which may include text or an image. */
  explanation?: MediaContent;
}

/**
 * Represents a pairing of a question identifier with a selected answer.
 */
export interface QuestionAnswerPair {
  /** Unique identifier for the question. */
  questionId: number;
  /** The index of the chosen answer within the options array. */
  answer: number;
}

/**
 * Represents a record of answers, where the key is a string identifier and the value is the answer index or undefined.
 */
export interface AnswerHistory {
  [key: string]: number | undefined;
}

/**
 * Represents a menu item, which may include a name, an optional link, and nested child menu items.
 */
export interface MenuItem {
  /** Name displayed for the menu item. */
  name: string;
  /** Optional link reference for the menu item. */
  href?: string;
  /** Optional list of child menu items under this menu item. */
  children?: MenuItem[];
}

/**
 * Represents a non-clickable segment within a navigation or display component.
 */
export interface NonLinkableSegment {
  /** The label for the segment. */
  label: string;
  /** The index position of the segment. */
  index: number;
}

/**
 * Represents standard HTTP request headers that can optionally be included in requests.
 */
interface RequestHeaders {
  /** The User-Agent string of the client making the request. */
  "user-agent"?: string;
  /** The Authorization header, used to pass authentication credentials. */
  authorization?: string;
  /** The Cookie header, containing cookies associated with the domain. */
  cookie?: string;
  /** The Accept header, indicating the media types that the client is able to understand. */
  accept?: string;
  /** The Content-Type header, indicating the media type of the request body. */
  "content-type"?: string;
  /** The Referer header, indicating the address of the previous web page from which a link to the currently requested page was followed. */
  referer?: string;
  /** The Origin header, indicating the origin of the request. */
  origin?: string;
  /** The Accept-Language header, specifying the preferred languages for the response. */
  "accept-language"?: string;
  /** The Host header, specifying the domain name of the server and optionally the port number. */
  host?: string;
  /** The X-Forwarded-For header, used for identifying the originating IP address of a client connecting to a web server through an HTTP proxy or load balancer. */
  "x-forwarded-for"?: string;
}

/**
 * Represents the headers specific to Vercel's edge network.
 */
interface VercelRequestHeaders {
  /**
   * The deployment URL for the current request.
   * Example: "my-app.vercel.app"
   */
  "x-vercel-deployment-url"?: string;

  /**
   * The region where the deployment is running.
   * Example: "iad1" (for Washington D.C.)
   */
  "x-vercel-deployment-region"?: string;

  /**
   * The estimated city of the client based on IP geolocation.
   * Example: "New York"
   */
  "x-vercel-ip-city"?: string;

  /**
   * The estimated country code of the client based on IP geolocation.
   * Uses ISO 3166-1 alpha-2 format.
   * Example: "US" for the United States
   */
  "x-vercel-ip-country"?: string;

  /**
   * The estimated region code of the client based on IP geolocation.
   * Uses ISO 3166-2 format.
   * Example: "NY" for New York
   */
  "x-vercel-ip-country-region"?: string;

  /**
   * The estimated latitude of the client based on IP geolocation.
   * Example: "40.7128"
   */
  "x-vercel-ip-latitude"?: string;

  /**
   * The estimated longitude of the client based on IP geolocation.
   * Example: "-74.0060"
   */
  "x-vercel-ip-longitude"?: string;

  /**
   * The estimated timezone of the client based on IP geolocation.
   * Example: "America/New_York"
   */
  "x-vercel-ip-timezone"?: string;

  /**
   * The IP address of the client if proxied through another server.
   * Example: "192.0.2.1"
   */
  "x-vercel-proxied-for"?: string;

  /**
   * The forwarded IP address of the client. If multiple proxies are involved,
   * the value will be a comma-separated list of IPs.
   * Example: "192.0.2.1,203.0.113.5"
   */
  "x-vercel-forwarded-for"?: string;

  /**
   * A unique identifier for the request.
   * Example: "iad1:xyz123"
   */
  "x-vercel-id"?: string;

  /**
   * The cache status for the request.
   * Possible values:
   * - "MISS": The request was not found in the cache.
   * - "HIT": The request was served from the cache.
   * - "STALE": The cache entry was stale and refreshed.
   * - "REVALIDATED": The cache entry was revalidated with the origin.
   */
  "x-vercel-cache"?: "MISS" | "HIT" | "STALE" | "REVALIDATED";

  /**
   * Information about the edge node that processed the request.
   * Example: "iad1/12345"
   */
  "x-vercel-edge"?: string;
}

/**
 * Extends `RequestHeaders` with additional custom headers for specific use cases.
 */
export interface CustomizableRequestHeaders
  extends VercelRequestHeaders,
    RequestHeaders {
  /** Custom header representing the full URL of the request. */
  "x-url"?: string;
  /** Custom header representing the pathname portion of the URL. */
  "x-pathname"?: string;
}

export interface CustomizableLocalStorage {
  answerHistory: string | undefined;
}
