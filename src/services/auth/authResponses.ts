import { expect } from "@playwright/test";
import authRequests from "./authRequests.js";
import z from "zod";

const authResponses = {
  login: {
    post: {
      async _200(username: string, password: string) {
        const response = await authRequests.login.post(username, password);
        expect(response.status()).toEqual(200);
        return z
          .strictObject({
            token: z.string().regex(/^[A-Za-z0-9]{16}$/),
          })
          .parse(await response.json());
      },
      async _401(username: string, password: string) {
        const response = await authRequests.login.post(username, password);
        expect(response.status()).toEqual(401);
        z.strictObject({
          error: z.literal("Invalid credentials"),
        }).parse(await response.json());
      },
    },
  },
  validate: {
    post: {
      async _200(token: string) {
        const response = await authRequests.validate.post(token);
        expect(response.status()).toEqual(200);
        z.strictObject({
          valid: z.literal(true),
        }).parse(await response.json());
      },
      async _403(token: string) {
        const response = await authRequests.validate.post(token);
        expect(response.status()).toEqual(403);
        z.strictObject({
          error: z.literal("Invalid token"),
        }).parse(await response.json());
      },
    },
  },
};

export default authResponses;
