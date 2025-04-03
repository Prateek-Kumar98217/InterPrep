"use server";

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";

export async function signUp(params: SignUpParams) {
  const { uid, username, email } = params;

  try {
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in instead.",
      };
    }
    await db.collection("users").doc(uid).set({
      username,
      email,
    });
    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error) {
    console.error("Error signing up:", error);

    if (error === "auth/email-already-in-use") {
      return {
        success: false,
        message: "Email already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create an account",
    };
  }
}

export async function setSessionCookie(idtoken: string) {
  const COOKIE_LIFETIME = 60 * 60 * 24 * 7;
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idtoken, {
    expiresIn: COOKIE_LIFETIME * 1000,
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: COOKIE_LIFETIME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User not found. Please create a new account.",
      };
    }
    await setSessionCookie(idToken);
    return {
      success: true,
      message: "Signed in successfully",
    };
  } catch (error) {
    console.error("Error signing in:", error);
    return {
      success: false,
      message: "Failed to sign in",
    };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) {
      return null;
    }
    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
