import React, { useEffect, useState } from "react";
import { startQuiz, submitQuiz } from "../../services/operations/quizAPI";
import { useParams } from "react-router-dom";

const QuizStart = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    startQuiz(id).then((res) => setQuiz(res.data.quiz));
  }, []);

  const submit = async () => {
    await submitQuiz(id, answers);
    alert("Quiz submitted!");
  };

  if (!quiz) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>

      {quiz.questions.map((q, i) => (
        <div key={q._id} className="mb-6">
          <p className="font-semibold">{i + 1}. {q.question}</p>

          <input
            className="w-full p-2 text-black"
            type="text"
            placeholder="Your answer..."
            onChange={(e) => setAnswers({ ...answers, [q._id]: e.target.value })}
          />
        </div>
      ))}

      <button
        onClick={submit}
        className="bg-yellow-300 text-black px-6 py-2 rounded-md"
      >
        Submit Quiz
      </button>
    </div>
  );
};

export default QuizStart;
