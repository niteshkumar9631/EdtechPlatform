import { apiConnector } from "../apiConnector";
const BASE = import.meta.env.VITE_APP_BASE_URL;

export const getQuizzes = () =>
  apiConnector("GET", `${BASE}/quiz/all`);

export const startQuiz = (quizId) =>
  apiConnector("GET", `${BASE}/quiz/start/${quizId}`);

export const submitQuiz = (quizId, answers) =>
  apiConnector("POST", `${BASE}/quiz/submit/${quizId}`, { answers });
