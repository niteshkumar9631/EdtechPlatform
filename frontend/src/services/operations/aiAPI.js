// // frontend/src/services/operations/aiAPI.js
// import { apiConnector } from "../apiConnector";

// const BASE = import.meta.env.VITE_APP_BASE_URL;

// // ----------------------------
// // 📌 Generate AI Questions
// // ----------------------------
// export const generateAIQuestions = async (topics, numQuestions, type = "mixed") => {
//   const response = await apiConnector(
//     "POST",
//     `${BASE}/ai/generate`,
//     {
//       topics: [topics],     // backend needs array
//       numQuestions,
//       type
//     }
//   );

//   return response.data;
// };

// // ----------------------------
// // 📌 Export AI Questions as PDF (with optional email)
// // ----------------------------
// export const exportAIQuestionsPDF = async (questions, email = "") => {
//   const response = await apiConnector(
//     "POST",
//     `${BASE}/ai/export`,
//     {
//       questions,
//       email
//     }
//   );

//   return response.data;
// };
 


// src/services/operations/aiAPI.js
import { apiConnector } from "../apiConnector";

const BASE = import.meta.env.VITE_APP_BASE_URL;

// 🔹 Generate AI Questions
export const generateAIQuestions = async (topics, numQuestions = 5, type = "mixed") => {
  try {
    const response = await apiConnector(
      "POST",
      `${BASE}/ai/generate`,
      {
        topics: topics.split(",").map(t => t.trim()),
        numQuestions,
        type,
        save: false,
      },
      {
        Authorization: `Bearer ${localStorage.getItem("token")?.replace(/"/g, "")}`
      }
    );

    return response.data;
  } catch (err) {
    console.error("AI GENERATE ERROR:", err);
    return { success: false, message: err.message };
  }
};

// 🔹 Export AI Questions as PDF + email
export const exportAIQuestions = async (questions, email) => {
  try {
    const response = await apiConnector(
      "POST",
      `${BASE}/ai/export`,
      { questions, email },
      {
        Authorization: `Bearer ${localStorage.getItem("token")?.replace(/"/g, "")}`
      }
    );

    return response.data;
  } catch (err) {
    console.error("AI EXPORT ERROR:", err);
    return { success: false, message: err.message };
  }
};
