import 'dotenv/config'; // This line loads your .env file

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

const systemTemplate = "Translate the following from English into {language}";

const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["user", "{text}"],
]);

const promptValue = await promptTemplate.invoke({
  language: "spanish",
  text: "Hi, my name is Jason and I like pizza and spaghetti, but I like to make it myself!",
});

promptValue;  

promptValue.toChatMessages();

const response = await model.invoke(promptValue);
console.log(`${response.content}`);

