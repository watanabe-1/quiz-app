import { Query as Query_0 } from '../app/api/admin/exportQuestions/route';
import { Query as Query_1 } from '../app/api/menu/route';


const generateSuffix = (url?: { query?: Record<string, string | number>, hash?: string }) => {
  if (!url) return "";
  const query = url.query;
  const hash = url?.hash;
  if (!query && !hash) return '';
  const stringQuery: Record<string, string> = query
    ? Object.keys(query).reduce((acc, key) => {
        const value = query[key];
        acc[key] = typeof value === "number" ? String(value) : value;
        return acc;
      }, {} as Record<string, string>)
    : {};
  const search = query ? `?${new URLSearchParams(stringQuery)}` : '';
  return `${search}${hash ? `#${hash}` : ''}`;
};

export const path_admin_qualification_grade_year_edit_id = (qualification: string | number,grade: string | number,year: string | number,id: string | number) => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
            query: { qualification, grade, year, id }, hash: url?.hash, 
            path: `/admin/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}/${encodeURIComponent(year)}/edit/${encodeURIComponent(id)}${generateSuffix(url)}`
          }),
        };
      };
path_admin_qualification_grade_year_edit_id.match = (path: string) => new RegExp("^/admin/([^/]+)/([^/]+)/([^/]+)/edit/([^/]+)$").exec(path);

export const path_admin_qualification_grade_year = (qualification: string | number,grade: string | number,year: string | number) => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
            query: { qualification, grade, year }, hash: url?.hash, 
            path: `/admin/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}/${encodeURIComponent(year)}${generateSuffix(url)}`
          }),
        };
      };
path_admin_qualification_grade_year.match = (path: string) => new RegExp("^/admin/([^/]+)/([^/]+)/([^/]+)$").exec(path);

export const path_admin_qualification_grade = (qualification: string | number,grade: string | number) => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
            query: { qualification, grade }, hash: url?.hash, 
            path: `/admin/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}${generateSuffix(url)}`
          }),
        };
      };
path_admin_qualification_grade.match = (path: string) => new RegExp("^/admin/([^/]+)/([^/]+)$").exec(path);

export const path_admin_qualification = (qualification: string | number) => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
            query: { qualification }, hash: url?.hash, 
            path: `/admin/${encodeURIComponent(qualification)}${generateSuffix(url)}`
          }),
        };
      };
path_admin_qualification.match = (path: string) => new RegExp("^/admin/([^/]+)$").exec(path);

export const path_admin_export = () => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
             hash: url?.hash, 
            path: `/admin/export${generateSuffix(url)}`
          }),
        };
      };
path_admin_export.match = (path: string) => new RegExp("^/admin/export$").exec(path);

export const path_admin = () => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
             hash: url?.hash, 
            path: `/admin${generateSuffix(url)}`
          }),
        };
      };
path_admin.match = (path: string) => new RegExp("^/admin$").exec(path);

export const path_admin_upload_businessCareer = () => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
             hash: url?.hash, 
            path: `/admin/upload/businessCareer${generateSuffix(url)}`
          }),
        };
      };
path_admin_upload_businessCareer.match = (path: string) => new RegExp("^/admin/upload/businessCareer$").exec(path);

export const path_admin_upload = () => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
             hash: url?.hash, 
            path: `/admin/upload${generateSuffix(url)}`
          }),
        };
      };
path_admin_upload.match = (path: string) => new RegExp("^/admin/upload$").exec(path);

export const path_api_admin_exportQuestions = () => {
        return { 
          $url: (url: { query: Query_0, hash?: string }) => ({
             hash: url?.hash, 
            path: `/api/admin/exportQuestions${generateSuffix(url)}`
          }),
        };
      };
path_api_admin_exportQuestions.match = (path: string) => new RegExp("^/api/admin/exportQuestions$").exec(path);

export const path_api_admin_upload_businessCareer_ans = () => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
             hash: url?.hash, 
            path: `/api/admin/upload/businessCareer/ans${generateSuffix(url)}`
          }),
        };
      };
path_api_admin_upload_businessCareer_ans.match = (path: string) => new RegExp("^/api/admin/upload/businessCareer/ans$").exec(path);

export const path_api_admin_upload_businessCareer_exam = () => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
             hash: url?.hash, 
            path: `/api/admin/upload/businessCareer/exam${generateSuffix(url)}`
          }),
        };
      };
path_api_admin_upload_businessCareer_exam.match = (path: string) => new RegExp("^/api/admin/upload/businessCareer/exam$").exec(path);

export const path_api_admin_upload = () => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
             hash: url?.hash, 
            path: `/api/admin/upload${generateSuffix(url)}`
          }),
        };
      };
path_api_admin_upload.match = (path: string) => new RegExp("^/api/admin/upload$").exec(path);

export const path_api_admin_uploadImage = () => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
             hash: url?.hash, 
            path: `/api/admin/uploadImage${generateSuffix(url)}`
          }),
        };
      };
path_api_admin_uploadImage.match = (path: string) => new RegExp("^/api/admin/uploadImage$").exec(path);

export const path_api_auth____nextauth = (nextauth: string[]) => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
            query: { nextauth }, hash: url?.hash, 
            path: `/api/auth/${nextauth?.map(encodeURIComponent).join('/') ?? ''}${generateSuffix(url)}`
          }),
        };
      };
path_api_auth____nextauth.match = (path: string) => new RegExp("^/api/auth/(.+)$").exec(path);

export const path_api_menu = () => {
        return { 
          $url: (url: { query: Query_1, hash?: string }) => ({
             hash: url?.hash, 
            path: `/api/menu${generateSuffix(url)}`
          }),
        };
      };
path_api_menu.match = (path: string) => new RegExp("^/api/menu$").exec(path);

export const path_api_questions_qualification_grade_year_category_id = (qualification: string | number,grade: string | number,year: string | number,category: string | number,id: string | number) => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
            query: { qualification, grade, year, category, id }, hash: url?.hash, 
            path: `/api/questions/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}/${encodeURIComponent(year)}/${encodeURIComponent(category)}/${encodeURIComponent(id)}${generateSuffix(url)}`
          }),
        };
      };
path_api_questions_qualification_grade_year_category_id.match = (path: string) => new RegExp("^/api/questions/([^/]+)/([^/]+)/([^/]+)/([^/]+)/([^/]+)$").exec(path);

export const path_api_questions_qualification_grade_year_category = (qualification: string | number,grade: string | number,year: string | number,category: string | number) => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
            query: { qualification, grade, year, category }, hash: url?.hash, 
            path: `/api/questions/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}/${encodeURIComponent(year)}/${encodeURIComponent(category)}${generateSuffix(url)}`
          }),
        };
      };
path_api_questions_qualification_grade_year_category.match = (path: string) => new RegExp("^/api/questions/([^/]+)/([^/]+)/([^/]+)/([^/]+)$").exec(path);

export const path_api_questions_qualification_grade_year = (qualification: string | number,grade: string | number,year: string | number) => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
            query: { qualification, grade, year }, hash: url?.hash, 
            path: `/api/questions/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}/${encodeURIComponent(year)}${generateSuffix(url)}`
          }),
        };
      };
path_api_questions_qualification_grade_year.match = (path: string) => new RegExp("^/api/questions/([^/]+)/([^/]+)/([^/]+)$").exec(path);

export const path_api_questions_qualification_grade = (qualification: string | number,grade: string | number) => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
            query: { qualification, grade }, hash: url?.hash, 
            path: `/api/questions/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}${generateSuffix(url)}`
          }),
        };
      };
path_api_questions_qualification_grade.match = (path: string) => new RegExp("^/api/questions/([^/]+)/([^/]+)$").exec(path);

export const path_api_questions_qualification = (qualification: string | number) => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
            query: { qualification }, hash: url?.hash, 
            path: `/api/questions/${encodeURIComponent(qualification)}${generateSuffix(url)}`
          }),
        };
      };
path_api_questions_qualification.match = (path: string) => new RegExp("^/api/questions/([^/]+)$").exec(path);

export const path_api_questions = () => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
             hash: url?.hash, 
            path: `/api/questions${generateSuffix(url)}`
          }),
        };
      };
path_api_questions.match = (path: string) => new RegExp("^/api/questions$").exec(path);

export const path_auth_login = () => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
             hash: url?.hash, 
            path: `/auth/login${generateSuffix(url)}`
          }),
        };
      };
path_auth_login.match = (path: string) => new RegExp("^/auth/login$").exec(path);

export const path = () => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
             hash: url?.hash, 
            path: `/${generateSuffix(url)}`
          }),
        };
      };
path.match = (path: string) => new RegExp("^/$").exec(path);

export const path_quiz_qualification_grade_year_category_id = (qualification: string | number,grade: string | number,year: string | number,category: string | number,id: string | number) => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
            query: { qualification, grade, year, category, id }, hash: url?.hash, 
            path: `/quiz/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}/${encodeURIComponent(year)}/${encodeURIComponent(category)}/${encodeURIComponent(id)}${generateSuffix(url)}`
          }),
        };
      };
path_quiz_qualification_grade_year_category_id.match = (path: string) => new RegExp("^/quiz/([^/]+)/([^/]+)/([^/]+)/([^/]+)/([^/]+)$").exec(path);

export const path_quiz_qualification_grade_year_category = (qualification: string | number,grade: string | number,year: string | number,category: string | number) => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
            query: { qualification, grade, year, category }, hash: url?.hash, 
            path: `/quiz/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}/${encodeURIComponent(year)}/${encodeURIComponent(category)}${generateSuffix(url)}`
          }),
        };
      };
path_quiz_qualification_grade_year_category.match = (path: string) => new RegExp("^/quiz/([^/]+)/([^/]+)/([^/]+)/([^/]+)$").exec(path);

export const path_quiz_qualification_grade_year = (qualification: string | number,grade: string | number,year: string | number) => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
            query: { qualification, grade, year }, hash: url?.hash, 
            path: `/quiz/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}/${encodeURIComponent(year)}${generateSuffix(url)}`
          }),
        };
      };
path_quiz_qualification_grade_year.match = (path: string) => new RegExp("^/quiz/([^/]+)/([^/]+)/([^/]+)$").exec(path);

export const path_quiz_qualification_grade = (qualification: string | number,grade: string | number) => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
            query: { qualification, grade }, hash: url?.hash, 
            path: `/quiz/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}${generateSuffix(url)}`
          }),
        };
      };
path_quiz_qualification_grade.match = (path: string) => new RegExp("^/quiz/([^/]+)/([^/]+)$").exec(path);

export const path_quiz_qualification = (qualification: string | number) => {
        return { 
          $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({
            query: { qualification }, hash: url?.hash, 
            path: `/quiz/${encodeURIComponent(qualification)}${generateSuffix(url)}`
          }),
        };
      };
path_quiz_qualification.match = (path: string) => new RegExp("^/quiz/([^/]+)$").exec(path);