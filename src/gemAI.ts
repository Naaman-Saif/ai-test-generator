import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = process.env.GEMINI_API_KEY || "";

async function run() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.7,
    topK: 50,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const parts = [
    {
      text: "Your task is to generate unit test for the provided code. Output only the code nothing else also don't add the name of language on the top:",
    },
    {
      text: "input: function toCelsius(fahrenheit) {\n return (5/9) * (fahrenheit-32);\n}",
    },
    {
      text: "Code: ```test('toCelsius converts Fahrenheit to Celsius', () => {\n  // Test case 1: Freezing point of water\n  expect(toCelsius(32)).toBeCloseTo(0, 2); // Allow for minor rounding errors\n\n  // Test case 2: Boiling point of water\n  expect(toCelsius(212)).toBeCloseTo(100, 2);\n\n  // Test case 3: Room temperature\n  expect(toCelsius(72)).toBeCloseTo(22.22, 2);\n});```",
    },
    {
      text: "input: function multiplyTwoNumbers(p1, p2) {\n  return p1 * p2;\n}",
    },
  ];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });

  const response = result.response;
  const responseText = response.text().split("");
  responseText.pop();
  responseText.pop();
  responseText.pop();
  responseText.shift();
  responseText.shift();
  responseText.shift();

  return responseText.join("");
//   console.log(responseText.join(""));
}

// run();
export default run;
