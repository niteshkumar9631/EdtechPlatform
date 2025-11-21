import React, { useEffect, useState } from "react";
import { getQuizzes } from "../../services/operations/quizAPI";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    getQuizzes().then((res) => setQuizzes(res.data.quizzes));
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Available Quizzes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map((q) => (
          <div
            key={q._id}
            className="bg-richblack-800 p-6 rounded-lg border border-richblack-700"
          >
            <h2 className="text-xl font-semibold">{q.title}</h2>
            <p className="text-richblack-300 mt-2">{q.description}</p>
            <a
              href={`/quiz/${q._id}`}
              className="text-yellow-300 underline mt-3 inline-block"
            >
              Start Quiz →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
