// CLERK_WEBHOOK_SIGNING_SECRET
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, updateUser } from "@/libs/userService";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    )
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400
    })
  }

  // Do something with the webhook payload
  const { id } = evt.data;
  const eventType = evt.type;

  // console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  // console.log("Webhook body:", body);
  // save data into database
  if (eventType === "user.created") {
    try {
      const { id, username, image_url } = evt.data;
      const res = await createUser(
        id, 
        username as string, 
        image_url || "/images/default.jpg",
        "/images/default.jpg",
        "none",
        "author is secret",
        "unknown",
        "unknown",
        "unknown",
        "register or login with github",
        "https://github.com",
        "register or login with juejin",
        "https://juejin.cn"
      );
      console.log("User created:", res);
      return new Response("User created successfully", {
        status: 201
      })
    } catch (error) {
      console.error("Error saving user to database:", error);
    }
  }
  
  if (eventType === "user.updated") {
    try {
      const { id, username, image_url } = evt.data;
      const res = await updateUser(
        id,
        {
          username: username as string,
          avatar: image_url as string,
        }
      );
      console.log("User updated:", res);
      return new Response("User updated successfully", {
        status: 200
      })
    } catch (error) {
      console.error("Error saving user to database:", error);
      return new Response("Filed to create the user", {
        status: 500
      })
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  return new Response("webhooks sucessful", {
    status: 200
  })
}