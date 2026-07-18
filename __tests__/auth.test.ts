import jwt from "jsonwebtoken";
import { generateToken, verifyToken, AuthPayload } from "@/lib/auth";

describe("Auth — JWT helpers", () => {
  it("should generate and verify a valid token", () => {
    const payload: AuthPayload = { userId: "abc123", role: "user" };
    const token = generateToken(payload);
    expect(typeof token).toBe("string");

    const decoded = verifyToken(token);
    expect(decoded.userId).toBe("abc123");
    expect(decoded.role).toBe("user");
  });

  it("should decode the correct role", () => {
    const payload: AuthPayload = { userId: "admin-1", role: "admin" };
    const token = generateToken(payload);
    const decoded = verifyToken(token);
    expect(decoded.role).toBe("admin");
  });

  it("should include expiration in token", () => {
    const payload: AuthPayload = { userId: "x", role: "user" };
    const token = generateToken(payload);
    const decoded = jwt.decode(token) as { exp: number };
    expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });
});
