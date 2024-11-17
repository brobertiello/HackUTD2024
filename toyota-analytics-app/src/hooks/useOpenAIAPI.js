require("dotenv").config();
const readline = require("readline");
const axios = require("axios");

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// API base configuration
const client = {
  baseUrl: "https://api.sambanova.ai/v1",
  apiKey: process.env.SAMBANOVA_API_KEY,
};

// Function to get the response from the API
async function getChatCompletion(prompt) {
  try {
    const response = await axios.post(
      `${client.baseUrl}/chat/completions`,
      {
        model: "Meta-Llama-3.1-8B-Instruct",
        messages: [
          { role: "system", content: "You are a helpful assistant" },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
        top_p: 0.1,
      },
      {
        headers: {
          Authorization: `Bearer ${client.apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      console.log(response.data.choices[0].message.content);
    } else {
      console.log("No response received from API.");
    }
  } catch (error) {
    console.error("Error fetching chat completion:", error);
  }
}

// Function to handle user input
function getUserPrompt() {
  rl.question("Type your response or type 'q' to quit: ", async (prompt) => {
    if (prompt.toLowerCase() === "q") {
      rl.close();
      return;
    }

    await getChatCompletion(prompt);
    getUserPrompt(); // Continue prompting the user
  });
}

// Start the interaction
getUserPrompt();
