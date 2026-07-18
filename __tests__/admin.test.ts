import { generateToken, verifyToken, AuthPayload } from "@/lib/auth";

describe("Admin — role-based token claims", () => {
  it("should encode admin role in token", () => {
    const payload: AuthPayload = { userId: "admin-1", role: "admin" };
    const token = generateToken(payload);
    const decoded = verifyToken(token);
    expect(decoded.role).toBe("admin");
  });

  it("should encode user role in token", () => {
    const payload: AuthPayload = { userId: "user-1", role: "user" };
    const token = generateToken(payload);
    const decoded = verifyToken(token);
    expect(decoded.role).toBe("user");
    expect(decoded.role).not.toBe("admin");
  });
});
