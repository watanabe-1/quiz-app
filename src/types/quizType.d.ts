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
 * Extends `RequestHeaders` with additional custom headers for specific use cases.
 */
export interface CustomizableRequestHeaders extends RequestHeaders {
  /** Custom header representing the full URL of the request. */
  "x-url"?: string;
  /** Custom header representing the pathname portion of the URL. */
  "x-pathname"?: string;
}

export interface CustomizableLocalStorage {
  answerHistory: string | undefined;
}
