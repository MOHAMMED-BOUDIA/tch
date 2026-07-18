import { generateToken, verifyToken, AuthPayload } from "@/lib/auth";

describe("Messages — token-based auth", () => {
  it("should generate a token that identifies the sender", () => {
    const senderId = "user-007";
    const token = generateToken({ userId: senderId, role: "user" });
    const decoded = verifyToken(token);
    expect(decoded.userId).toBe(senderId);
  });

  it("should allow admin role in token", () => {
    const payload: AuthPayload = { userId: "admin-1", role: "admin" };
    const token = generateToken(payload);
    const decoded = verifyToken(token);
    expect(decoded.role).toBe("admin");
  });
});
