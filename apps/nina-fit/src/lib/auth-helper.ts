import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function getAuthSession() {
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
