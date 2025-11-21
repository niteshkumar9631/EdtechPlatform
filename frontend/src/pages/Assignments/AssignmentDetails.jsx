import React, { useEffect, useState } from "react";
import { getAssignmentById, submitAssignment } from "../../services/operations/assignmentAPI";
import { useParams } from "react-router-dom";

const AssignmentDetails = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    getAssignmentById(id)
      .then((res) => setAssignment(res.data.assignment))
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = async () => {
    await submitAssignment({ assignmentId: id, answer });
    alert("Assignment Submitted!");
  };

  if (!assignment) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-bold">{assignment.title}</h1>

      <p className="text-richblack-300 mt-2">{assignment.description}</p>

      <textarea
        className="w-full p-4 mt-4 text-black"
        rows="6"
        placeholder="Write your answer..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      ></textarea>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-yellow-300 px-6 py-2 rounded-md font-bold text-black"
      >
        Submit
      </button>
    </div>
  );
};

export default AssignmentDetails;
