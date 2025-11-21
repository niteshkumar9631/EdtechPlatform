// frontend\src\pages\AI\AIGenerator.jsx
// import React, { useState } from "react";
// import { generateAIQuestions } from "../../services/operations/aiAPI";

// const AIGenerator = () => {
//   const [topic, setTopic] = useState("");
//   const [count, setCount] = useState(5);
//   const [output, setOutput] = useState([]);

//   const generate = async () => {
//     const res = await generateAIQuestions(topic, count);
//     setOutput(res.data.questions);
//   };

//   return (
//     <div className="p-6 text-white">
//       <h1 className="text-3xl font-bold mb-6">AI Question Generator</h1>

//       <input
//         type="text"
//         className="p-3 w-full text-black"
//         placeholder="Enter topic..."
//         value={topic}
//         onChange={(e) => setTopic(e.target.value)}
//       />

//       <input
//         type="number"
//         className="p-3 w-full text-black mt-4"
//         value={count}
//         onChange={(e) => setCount(e.target.value)}
//       />

//       <button
//         onClick={generate}
//         className="bg-yellow-300 text-black px-6 py-2 rounded-md mt-4"
//       >
//         Generate
//       </button>

//       <div className="mt-6 space-y-4">
//         {output.map((q, i) => (
//           <p key={i} className="bg-richblack-800 p-4 rounded-lg">
//             {i + 1}. {q}
//           </p>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AIGenerator;








// // frontend/src/pages/AI/AIGenerator.jsx
// import React, { useState } from "react";
// import { generateAIQuestions, exportAIQuestionsPDF } from "../../services/operations/aiAPI";

// const AIGenerator = () => {
//   const [topic, setTopic] = useState("");
//   const [count, setCount] = useState(5);
//   const [questions, setQuestions] = useState([]);
//   const [email, setEmail] = useState("");

//   // =======================
//   // 📌 Generate AI Questions
//   // =======================
//   const handleGenerate = async () => {
//     if (!topic.trim()) {
//       alert("Enter a topic first");
//       return;
//     }

//     const res = await generateAIQuestions(topic, count);
    
//     if (res.success) {
//       setQuestions(res.data);
//     } else {
//       alert("Generation failed");
//     }
//   };

//   // =======================
//   // 📌 Export to PDF + Email
//   // =======================
//   const handleExportPDF = async () => {
//     if (questions.length === 0) {
//       alert("Generate questions first");
//       return;
//     }

//     const res = await exportAIQuestionsPDF(questions, email);
//     alert(res.message);
//   };

//   return (
//     <div className="p-8 text-white max-w-3xl mx-auto">
//       <h1 className="text-4xl font-bold mb-6">AI Question Paper Generator</h1>

//       {/* Topic Input */}
//       <input
//         type="text"
//         className="w-full p-3 text-black rounded-md"
//         placeholder="Enter topic..."
//         value={topic}
//         onChange={(e) => setTopic(e.target.value)}
//       />

//       {/* Number of Questions */}
//       <input
//         type="number"
//         className="w-full p-3 text-black rounded-md mt-3"
//         value={count}
//         onChange={(e) => setCount(e.target.value)}
//       />

//       {/* Generate button */}
//       <button
//         onClick={handleGenerate}
//         className="bg-yellow-300 text-black px-6 py-2 rounded-md mt-4"
//       >
//         Generate Questions
//       </button>

//       {/* Results */}
//       <div className="mt-6 space-y-4">
//         {questions.map((q, i) => (
//           <div key={i} className="bg-richblack-800 p-4 rounded-lg">
//             <p className="font-semibold text-yellow-300">Q{i + 1}. {q.question}</p>
            
//             {q.type === "MCQ" && q.options?.length > 0 && (
//               <ul className="mt-2 ml-4 list-disc">
//                 {q.options.map((opt, index) => (
//                   <li key={index}>{opt}</li>
//                 ))}
//               </ul>
//             )}

//             {q.answer && <p className="mt-2 text-green-300">Answer: {q.answer}</p>}
//           </div>
//         ))}
//       </div>

//       {/* Email input */}
//       <input
//         type="email"
//         className="w-full p-3 text-black rounded-md mt-6"
//         placeholder="Enter email to receive PDF (optional)"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       {/* Export PDF button */}
//       <button
//         onClick={handleExportPDF}
//         className="bg-blue-400 text-black px-6 py-2 rounded-md mt-4"
//       >
//         Export as PDF
//       </button>

//     </div>
//   );
// };

// export default AIGenerator;











// src/pages/AI/AIGenerator.jsx
import React, { useState } from "react";
import { generateAIQuestions, exportAIQuestions } from "../../services/operations/aiAPI";

const AIGenerator = () => {
  const [topics, setTopics] = useState("");
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [email, setEmail] = useState("");

  const generate = async () => {
    const res = await generateAIQuestions(topics, count);

    if (res.success) {
      setQuestions(res.data);
    } else {
      alert(res.message);
    }
  };

  const exportPDF = async () => {
    const res = await exportAIQuestions(questions, email);
    alert(res.message);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">AI Question Generator</h1>

      <input
        type="text"
        className="p-3 w-full text-black"
        placeholder="Enter topics separated by comma (e.g. Physics, Motion)"
        value={topics}
        onChange={(e) => setTopics(e.target.value)}
      />

      <input
        type="number"
        className="p-3 w-full text-black mt-4"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      />

      <button
        onClick={generate}
        className="bg-yellow-300 text-black px-6 py-2 rounded-md mt-4"
      >
        Generate Questions
      </button>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Generated Questions</h2>

        {questions.map((q, i) => (
          <div key={i} className="bg-richblack-800 p-4 rounded-lg mb-3">
            <p className="font-semibold">{i + 1}. {q.question}</p>

            {q.type === "MCQ" && q.options?.length > 0 && (
              <ul className="mt-2 pl-6 list-disc">
                {q.options.map((opt, idx) => (
                  <li key={idx}>{opt}</li>
                ))}
              </ul>
            )}

            {q.answer && <p className="text-yellow-300 mt-2">Answer: {q.answer}</p>}
            {q.explanation && <p className="text-sm mt-2">{q.explanation}</p>}
          </div>
        ))}
      </div>

      {questions.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg mb-3">Email PDF</h3>

          <input
            type="email"
            className="p-3 w-full text-black"
            placeholder="Enter email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={exportPDF}
            className="bg-blue-400 text-black px-6 py-2 rounded-md mt-3"
          >
            Export + Email PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default AIGenerator;
