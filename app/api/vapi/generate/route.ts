import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  const prompt = `Please generate a list of interview questions based on the following parameters:

    Job Role: ${role}
    Experience Level: ${level}
    Tech Stack: ${techstack}
    Focus: The questions should primarily focus on ${type} (either behavioural or technical).
    Number of Questions: ${amount}
    Instructions:
    Ensure the questions are clear, concise, and relevant to the role, experience level, and tech stack.
    The questions should be formatted in a way that can be read by a voice assistant. Do not use any special characters (like slashes or asterisks) that could interfere with the assistant.

    Return the questions in a simple array format as follows: ["Question 1", "Question 2", "Question 3", ...].

    Example of formatted output: ["What motivated you to apply for this position?", "Can you walk us through a challenging project you've worked on?", "How do you approach debugging in your preferred tech stack?", ...]

    The output should only include the array of questions, without any additional text or explanation.
    `;

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: prompt,
    });

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
