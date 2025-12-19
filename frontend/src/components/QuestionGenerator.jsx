import React, { useState } from "react";
import axios from "axios";

const QuestionGenerator = () => {
  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [questionType, setQuestionType] = useState("Conceptual");
  const [answer, setAnswer] = useState("");
  const [accuracy, setAccuracy] = useState("");

  const difficulties = ["Easy", "Medium", "Hard"];
  const questionTypes = ["Conceptual", "Scenario-based", "Debugging"];

  const handleQuestion = async () => {
    if (!topic) {
      alert("Please write a topic!!!");
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/generateQuestion",
        {
          topic,
          difficulty: difficulty.toLowerCase(),
          questionType: questionType.toLowerCase(),
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

    setAccuracy(response.data.feedback);
    const followUpRes = await axios.post(
    "http://localhost:5000/api/followUpQuestion",
      {
        topic,
        previousQuestion: question,
        score: response.data.score
      }
    );

    setQuestion(followUpRes.data.followUpQuestion);
    setDifficulty(followUpRes.data.difficulty);
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
        <div className="w-full flex justify-center">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic to generate a question"
            className="w-[20%] max-w-sm m-4 block text-gray-700 text-sm font-medium border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
          />
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-[7%] max-w-sm m-4 block text-gray-700 text-sm font-medium border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
          >
            {difficulties.map((d, i) => (
              <option value={d} key={i}>
                {d}
              </option>
            ))}
          </select>
          <select
            id="questionType"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            className="w-[12%] max-w-sm m-4 block text-gray-700 text-sm font-medium border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
          >
            {questionTypes.map((q, i) => (
              <option value={q} key={i}>
                {q}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleQuestion}
          className="w-1/6 bg-red-600 py-2 px-4 rounded-lg text-white font-medium hover:bg-red-700 transition duration-150"
        >
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
          onClick={handleAnswer}
        >
          Submit Answer
        </button>
      </div>
    </>
  );
};

export default QuestionGenerator;
