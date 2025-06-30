import 'dotenv/config'; 
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { tool } from "@langchain/core/tools";
import { z } from "zod";


const multiply = tool(
  ({ a, b }: { a: number, b: number }): number => {
    /**
     * Multiply two numbers.
     */
    return a * b;
  },
  {
    name: "multiply",
    description: "Multiply two numbers",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

//Bind tools
const modelWithTools = model.bindTools([multiply]);

await multiply.invoke({ a: 2, b: 3 });

console.log(multiply.name); // multiply
console.log(multiply.description); // Multiply two numbers.

await multiply.invoke({ a: 2, b: 3 });

const systemTemplate = "Use the multiply tool to multiply these two numbers together";


