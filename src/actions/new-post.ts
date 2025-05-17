"use server";

import { auth } from "@clerk/nextjs/server";

export async function createPostAction(name: string) {
  const user = await auth();
  
  if (!user.userId) {
    throw new Error("Unauthorized");
  }

  return { name, ownerId: user.userId };
}
