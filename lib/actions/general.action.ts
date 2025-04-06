"use server";

import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;
  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewById(
  interviewId: string
): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(interviewId).get();
  return interview.data() as Interview | null;
}

export async function createFeedback(prams: CreateFeedbackParams) {
  const { interviewId, userId, transcript } = prams;
  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `-${sentence.role}: ${sentence.content}\n`
      )
      .join("");
    console.log("Formatted Transcript:", formattedTranscript);
    const {
      object: {
        totalScore,
        categoryScores,
        strengths,
        areasForImprovement,
        finalAssessment,
      },
    } = await generateObject({
      model: google("gemini-2.0-flash-001", { structuredOutputs: false }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are an experienced interviewer, skilled in evaluating candidates against specific performance criteria. Your task is to assess the interviewee's performance in five categories: Communication Skills, Technical Knowledge, Problem Solving, Cultural Fit, and Confidence and Clarity. Provide a score for each category, along with a comment that includes specific examples from the transcript. Additionally, highlight the candidate’s strengths, areas for improvement, and provide a final overall assessment based on the interview. The total score should be out of 100, weighted as follows: Communication Skills (20%), Technical Knowledge (20%), Problem Solving (20%), Cultural Fit (20%), and Confidence and Clarity (20%).",
    });

    const feedback = await db.collection("feedback").add({
      interviewId,
      userId,
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      feedbackId: feedback.id,
    };
  } catch (error) {
    console.error("Error creating feedback:", error);
    return {
      success: false,
      message: "Failed to create feedback",
    };
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;
  const feedback = await db
    .collection("feedback")
    .orderBy("createdAt", "desc")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .get();
  if (feedback.empty) {
    return null;
  }
  const feedbackDoc = feedback.docs[0];
  return {
    id: feedbackDoc.id,
    ...feedbackDoc.data(),
  } as Feedback;
}
