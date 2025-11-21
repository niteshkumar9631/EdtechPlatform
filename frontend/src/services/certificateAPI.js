// import { apiConnector } from "./apiConnector";
// const BASE = import.meta.env.VITE_APP_BASE_URL;

// export const generateCertificate = (courseId) =>
//   apiConnector("POST", `${BASE}/certification/generate`, { courseId });

// export const getCertificateURL = (certId) =>
//   `${BASE.replace("/api/v1", "")}/certificates/${certId}.pdf`;





import { apiConnector } from "./apiConnector";
const BASE = import.meta.env.VITE_APP_BASE_URL;

export const generateCertificate = async (courseId, token) => {
  return apiConnector(
    "POST",
    `${BASE}/certification/issue`,
    { courseId },
    {
      Authorization: `Bearer ${token}`
    }
  );
};

export const getCertificateDownloadURL = (filePath) => {
  return `${import.meta.env.VITE_APP_BASE_ORIGIN}${filePath}`;
};
