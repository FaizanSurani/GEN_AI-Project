const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = require("express").Router();
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

router.post("/generateQuestion", async (req, res) => {
  const { topic, difficulty, questionType } = req.body;

  if (!topic) {
    return res.status(400).json("Please select a option");
  }

  try {
    const prompt = `
      You are an AI interviewer.

      Generate ONE ${difficulty}-level ${questionType} interview question.

      Topic: ${topic}

      Rules:
      - Do not include the answer
      - Keep it concise
      - Test real understanding, not definitions

      Return only the question text.
      `;

    const result = await model.generateContent(prompt);
    const question = result.response.text().trim();

    return res.status(200).json({ question });
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate question!!" });
  }
});
router.post("/evaluate", async (req, res) => {
  const { question, answer } = req.body;

  if (!answer) {
    return res.status(400).json("Please provide a answer!!!");
  }

  try {
    const prompt = `
      You are an AI evaluator.

      Question:
      ${question}

      User Answer:
      ${answer}

      Evaluate based on:
      - Conceptual correctness
      - Completeness
      - Clarity

      Respond in this format ONLY:
      Score: <number between 0 and 100>
      Feedback: <2-3 lines of improvement>
      `;


    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const scoreMatch = text.match(/Score:\s*(\d+)/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    return res.status(200).json({
      score,
      feedback: text
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to evaluate the given answer!!" });
  }
});

router.post("/followUpQuestion", async (req, res) => {
  const { topic, previousQuestion, score } = req.body;

  try {
    const difficulty =
      score >= 70 ? "hard" : "easy";

    const intent =
      score >= 70
        ? "ask a deeper follow-up question"
        : "ask a simpler clarification question";

    const prompt = `
    You are an AI interviewer.

    Previous Question:
    ${previousQuestion}

    Task:
    ${intent}

    Topic: ${topic}
    Difficulty: ${difficulty}

    Rules:
    - Do not repeat the previous question
    - Do not include answers
    - Ask only ONE question
    `;

    const result = await model.generateContent(prompt);
    const followUpQuestion = result.response.text().trim();

    return res.status(200).json({
      followUpQuestion,
      difficulty
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate follow-up" });
  }
});

module.exports = router;
