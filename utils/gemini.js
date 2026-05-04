import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const MODEL = "llama-3.3-70b-versatile";

export const chatSession = {
  sendMessage: async (prompt) => {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 1,
      max_tokens: 10000,
    });

    const text = response.choices[0]?.message?.content || "";
    return {
      response: {
        text: () => text,
      },
    };
  },
};