const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = require("express").Router();
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMIN_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post("/generateQuestion", async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json("Please select a option");
  }

  try {
    const prompt = `Generate a question about ${topic}`;

    const result = await model.generateContent(prompt);
    const question = result.response.text();

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
    const prompt = `Evalute the following answer : ${answer} for the question : ${question}, provide an accuracy on a scale of 0 to 100%, and only 3 lines text on improvement`;

    const result = await model.generateContent(prompt);
    const evaluate = result.response.text();

    return res.status(200).json({ evaluate });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to evaluate the given answer!!" });
  }
});

module.exports = router;
