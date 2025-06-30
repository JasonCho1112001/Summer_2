import 'dotenv/config';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const multiply = tool(
  ({ a, b }) => { 
    /**
     * Multiply two numbers.
     */
    return a * b;
  },
  {
    name: "multiply",
    description: "Multiply two numbers",
    schema: z.object({
      a: z.number().describe("The first number to multiply"), 
      b: z.number().describe("The second number to multiply"),
    }),
  }
);

const squareRoot = tool(
  ({a}) => {
    return Math.sqrt(a);
  },
  {
    name: "squareRoot",
    description: "Find the square root",
    schema: z.object({
      a: z.number(),
    }),

  }

);



const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

//Bind tools
const modelWithTools = model.bindTools([multiply, squareRoot]);

const systemMessage = "You are a helpful assistant capable of performing mathematical operations using provided tools.";

const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemMessage],
  ["human", "What is the square root of {a}, {b}, and {c}? What is {a} multiplied by {c}? What is the square root of {a} multiplied by {c}?"],
]);

// Invoke the prompt template with specific values
const promptValue = await promptTemplate.invoke({
  a: 16,
  b: 4,
  c: 100,
});

const chatMessages = promptValue.toChatMessages();

console.log("Invoking modelWithTools...");
const response = await modelWithTools.invoke(chatMessages); 

console.log(JSON.stringify(response, null, 2));

if (response.tool_calls && response.tool_calls.length > 0) {
    console.log("\nModel wants to call tools!");
    for (const toolCall of response.tool_calls) {
        if (toolCall.name === "multiply") {
            console.log(`Model requested to multiply: ${toolCall.args.a} * ${toolCall.args.b}`);
            try {
                const output = await multiply.invoke(toolCall.args);
                console.log(`Tool 'multiply' executed. Output: ${output}`);
            } catch (error) {
                console.error("Error executing tool:", error);
            }
        }
        else if (toolCall.name === "squareRoot") {
            console.log(`Model requested to squareRoot: ${toolCall.args.a}`);
            try {
                const output = await squareRoot.invoke(toolCall.args);
                console.log(`Tool 'squareRoot' executed. Output: ${output}`);
            } catch (error) {
                console.error("Error executing tool:", error);
            }
        }
    }
} else {
    console.log("\nModel responded directly (no tool call detected):", response.content);
}