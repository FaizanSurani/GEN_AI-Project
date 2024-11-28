import React, { useState } from "react";
import axios from "axios";

const QuestionGenerator = () => {
  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState("");
  const [answer, setAnswer] = useState("");
  const [accuracy, setAccuracy] = useState("");

  const topics = ["Geography", "Health", "Sports"];

  const handleQuestion = async () => {
    if (!topic) {
      alert("Please select a topic!!!");
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/generateQuestion",
        {
          topic,
        }
      );
      console.log(response);

      setQuestion(response.data.question);
      setAnswer("");
    } catch (error) {
      alert("Error while generating question");
      console.log("Error while generating question", error);
    }
  };

  const handleAnswer = async () => {
    if (!answer) {
      alert("Answer is Required!!");
    }

    const response = await axios.post("http://localhost:5000/api/evaluate", {
      question,
      answer,
    });

    setAccuracy(response.data.evaluate);
    setAnswer("");
  };
  return (
    <>
      <div className="min-h-screen bg-gray-700 flex flex-col items-center justify-center border-gray-50 px-4 py-10">
        <div className="p-4 w-full bg-white rounded-lg max-w-md shadow-md">
          <h1 className="text-3xl mb-4 font-bold text-center text-gray-800">
            Gen AI App
          </h1>
        </div>
        <select
          id="topic"
          value={topic}
          className="w-full max-w-sm m-4 block text-gray-700 text-sm font-medium border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
          onChange={(e) => setTopic(e.target.value)}>
          <option value="">Select a topic</option>
          {topics.map((t) => (
            <option value={t} key={t}>
              {t}
            </option>
          ))}
        </select>
        <button
          onClick={handleQuestion}
          className="w-1/6 bg-red-600 py-2 px-4 rounded-lg text-white font-medium hover:bg-red-700 transition duration-150">
          Generate Question
        </button>
        <div className="mt-4">
          <textarea
            readOnly
            value={question}
            rows={2}
            placeholder="Your generated question will appear here!"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
          />
          <textarea
            value={answer}
            rows={5}
            cols={50}
            placeholder="Write your answer here"
            onChange={(e) => {
              setAnswer(e.target.value);
            }}
            className="w-full px-3 py-2 mt-4 border border-black rounded-lg focus:outline-none"
          />
        </div>
        {accuracy.length > 0 && (
          <p className="bg-green-500 w-full max-w-md border border-black text-sm font-medium p-3 rounded-lg">
            {accuracy}
          </p>
        )}
        <button
          className="w-1/6 bg-blue-600 py-2 px-4 mt-4 rounded-lg text-white font-medium hover:bg-blue-700 transition duration-150"
          onClick={handleAnswer}>
          Submit Answer
        </button>
      </div>
    </>
  );
};

export default QuestionGenerator;
