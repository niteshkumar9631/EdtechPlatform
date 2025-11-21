// import React, { useState } from "react";
// import { generateCertificate } from "../../services/certificateAPI";

// const CertificationPage = () => {
//   const [course, setCourse] = useState("");
//   const [certLink, setCertLink] = useState("");

//   const generate = async () => {
//     const res = await generateCertificate(course);
//     setCertLink(res.data.pdfURL);
//   };

//   return (
//     <div className="p-6 text-white">
//       <h1 className="text-3xl font-bold mb-6">Generate Certificate</h1>

//       <input
//         type="text"
//         className="p-3 text-black w-full"
//         placeholder="Enter Course ID"
//         value={course}
//         onChange={(e) => setCourse(e.target.value)}
//       />

//       <button
//         onClick={generate}
//         className="bg-yellow-300 text-black px-6 py-2 rounded-md mt-4"
//       >
//         Generate
//       </button>

//       {certLink && (
//         <a
//           href={certLink}
//           className="block text-yellow-300 underline mt-4"
//           target="_blank"
//         >
//           Download Certificate
//         </a>
//       )}
//     </div>
//   );
// };

// export default CertificationPage;





import React, { useState } from "react";
import { generateCertificate } from "../../services/certificateAPI";
import { useSelector } from "react-redux";

const CertificationPage = () => {
  const [courseId, setCourseId] = useState("");
  const [certURL, setCertURL] = useState("");

  const { token } = useSelector((state) => state.auth);

  const generate = async () => {
    try {
      const res = await generateCertificate(courseId, token);

      if (res?.data?.pdfURL) {
        setCertURL(res.data.pdfURL);
      } else {
        alert("Certificate generated but URL missing");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Generate Certificate</h1>

      <input
        type="text"
        className="p-3 text-black w-full"
        placeholder="Enter Course ID"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
      />

      <button
        onClick={generate}
        className="bg-yellow-300 text-black px-6 py-2 rounded-md mt-4"
      >
        Generate
      </button>

      {certURL && (
        <a
          href={certURL}
          target="_blank"
          className="block text-yellow-300 underline mt-4"
        >
          Download Certificate
        </a>
      )}
    </div>
  );
};

export default CertificationPage;
