import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function getAuthSession() {
  console.log("MOCK_AUTH value:", process.env.MOCK_AUTH);
  if (process.env.MOCK_AUTH === "true") {
    return {
      user: {
        name: "Test User",
        email: "test@example.com",
        image: null,
      },
      expires: "2099-01-01T00:00:00.000Z",
    };
  }
  return getServerSession(authOptions);
}
