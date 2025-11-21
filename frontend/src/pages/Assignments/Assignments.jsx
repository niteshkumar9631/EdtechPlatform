import React, { useEffect, useState } from "react";
import { getAssignments } from "../../services/operations/assignmentAPI";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    getAssignments()
      .then((res) => setAssignments(res.data.assignments))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Your Assignments</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.map((a) => (
          <div key={a._id}
            className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
            <h2 className="text-xl font-semibold">{a.title}</h2>
            <p className="text-richblack-300 mt-2">{a.description}</p>
            <a
              href={`/assignments/${a._id}`}
              className="text-yellow-300 underline mt-3 inline-block"
            >
              View Assignment →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignments;
