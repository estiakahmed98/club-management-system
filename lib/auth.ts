import bcryptjs from "bcryptjs";

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

// Compare password with hash
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

// Get current user from session
export async function getCurrentUser(
  req: any
): Promise<{ id: string; email: string; role: string } | null> {
  try {
    const sessionCookie = req.cookies.get("session");
    if (!sessionCookie) return null;

    // In a real app, you'd validate the session token here
    // For now, we'll parse it as JSON (you should use proper JWT or session management)
    const session = JSON.parse(sessionCookie.value || "{}");
    return session.user || null;
  } catch (error) {
    return null;
  }
}

// Create session
export function createSession(userId: string, email: string, role: string) {
  return JSON.stringify({
    user: {
      id: userId,
      email,
      role,
    },
    timestamp: new Date().toISOString(),
  });
}
