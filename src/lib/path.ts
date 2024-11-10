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
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({ query: { qualification, grade, year, id }, hash: url?.hash, path: `/admin/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}/${encodeURIComponent(year)}/edit/${encodeURIComponent(id)}${generateSuffix(url)}` }) };
      };

export const path_admin_qualification_grade_year = (qualification: string | number,grade: string | number,year: string | number) => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({ query: { qualification, grade, year }, hash: url?.hash, path: `/admin/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}/${encodeURIComponent(year)}${generateSuffix(url)}` }) };
      };

export const path_admin_qualification_grade = (qualification: string | number,grade: string | number) => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({ query: { qualification, grade }, hash: url?.hash, path: `/admin/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}${generateSuffix(url)}` }) };
      };

export const path_admin_qualification = (qualification: string | number) => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({ query: { qualification }, hash: url?.hash, path: `/admin/${encodeURIComponent(qualification)}${generateSuffix(url)}` }) };
      };

export const path_admin_export = () => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({  hash: url?.hash, path: `/admin/export${generateSuffix(url)}` }) };
      };

export const path_admin = () => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({  hash: url?.hash, path: `/admin${generateSuffix(url)}` }) };
      };

export const path_admin_upload_businessCareer = () => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({  hash: url?.hash, path: `/admin/upload/businessCareer${generateSuffix(url)}` }) };
      };

export const path_admin_upload = () => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({  hash: url?.hash, path: `/admin/upload${generateSuffix(url)}` }) };
      };

export const path_api_admin_exportQuestions = () => {
        return { $url: (url: { query: Query_0, hash?: string }) => ({  hash: url?.hash, path: `/api/admin/exportQuestions${generateSuffix(url)}` }) };
      };

export const path_api_admin_questions_qualification_grade_year_id = (qualification: string | number,grade: string | number,year: string | number,id: string | number) => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({ query: { qualification, grade, year, id }, hash: url?.hash, path: `/api/admin/questions/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}/${encodeURIComponent(year)}/${encodeURIComponent(id)}${generateSuffix(url)}` }) };
      };

export const path_api_admin_upload_businessCareer_ans = () => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({  hash: url?.hash, path: `/api/admin/upload/businessCareer/ans${generateSuffix(url)}` }) };
      };

export const path_api_admin_upload_businessCareer_exam = () => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({  hash: url?.hash, path: `/api/admin/upload/businessCareer/exam${generateSuffix(url)}` }) };
      };

export const path_api_admin_upload = () => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({  hash: url?.hash, path: `/api/admin/upload${generateSuffix(url)}` }) };
      };

export const path_api_admin_uploadImage = () => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({  hash: url?.hash, path: `/api/admin/uploadImage${generateSuffix(url)}` }) };
      };

export const path_api_auth____nextauth = (nextauth: string[]) => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({ query: { nextauth }, hash: url?.hash, path: `/api/auth/${nextauth?.map(encodeURIComponent).join('/') ?? ''}${generateSuffix(url)}` }) };
      };

export const path_api_menu = () => {
        return { $url: (url: { query: Query_1, hash?: string }) => ({  hash: url?.hash, path: `/api/menu${generateSuffix(url)}` }) };
      };

export const path_api_questions_qualification_grade_year_category_id = (qualification: string | number,grade: string | number,year: string | number,category: string | number,id: string | number) => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({ query: { qualification, grade, year, category, id }, hash: url?.hash, path: `/api/questions/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}/${encodeURIComponent(year)}/${encodeURIComponent(category)}/${encodeURIComponent(id)}${generateSuffix(url)}` }) };
      };

export const path_api_questions_qualification_grade_year_category = (qualification: string | number,grade: string | number,year: string | number,category: string | number) => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({ query: { qualification, grade, year, category }, hash: url?.hash, path: `/api/questions/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}/${encodeURIComponent(year)}/${encodeURIComponent(category)}${generateSuffix(url)}` }) };
      };

export const path_api_questions_qualification_grade_year = (qualification: string | number,grade: string | number,year: string | number) => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({ query: { qualification, grade, year }, hash: url?.hash, path: `/api/questions/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}/${encodeURIComponent(year)}${generateSuffix(url)}` }) };
      };

export const path_api_questions_qualification_grade = (qualification: string | number,grade: string | number) => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({ query: { qualification, grade }, hash: url?.hash, path: `/api/questions/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}${generateSuffix(url)}` }) };
      };

export const path_api_questions_qualification = (qualification: string | number) => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({ query: { qualification }, hash: url?.hash, path: `/api/questions/${encodeURIComponent(qualification)}${generateSuffix(url)}` }) };
      };

export const path_api_questions = () => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({  hash: url?.hash, path: `/api/questions${generateSuffix(url)}` }) };
      };

export const path_auth_login = () => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({  hash: url?.hash, path: `/auth/login${generateSuffix(url)}` }) };
      };

export const path = () => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({  hash: url?.hash, path: `/${generateSuffix(url)}` }) };
      };

export const path_quiz_qualification_grade_year_category_id = (qualification: string | number,grade: string | number,year: string | number,category: string | number,id: string | number) => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({ query: { qualification, grade, year, category, id }, hash: url?.hash, path: `/quiz/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}/${encodeURIComponent(year)}/${encodeURIComponent(category)}/${encodeURIComponent(id)}${generateSuffix(url)}` }) };
      };

export const path_quiz_qualification_grade_year_category = (qualification: string | number,grade: string | number,year: string | number,category: string | number) => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({ query: { qualification, grade, year, category }, hash: url?.hash, path: `/quiz/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}/${encodeURIComponent(year)}/${encodeURIComponent(category)}${generateSuffix(url)}` }) };
      };

export const path_quiz_qualification_grade_year = (qualification: string | number,grade: string | number,year: string | number) => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({ query: { qualification, grade, year }, hash: url?.hash, path: `/quiz/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}/${encodeURIComponent(year)}${generateSuffix(url)}` }) };
      };

export const path_quiz_qualification_grade = (qualification: string | number,grade: string | number) => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({ query: { qualification, grade }, hash: url?.hash, path: `/quiz/${encodeURIComponent(qualification)}/${encodeURIComponent(grade)}${generateSuffix(url)}` }) };
      };

export const path_quiz_qualification = (qualification: string | number) => {
        return { $url: (url?: { query?: Record<string, string | number>, hash?: string }) => ({ query: { qualification }, hash: url?.hash, path: `/quiz/${encodeURIComponent(qualification)}${generateSuffix(url)}` }) };
      };