import { expect } from "@playwright/test";
import authRequests from "./authRequests.js";
import zodHelper from "../../helpers/data/zodHelper.js";
import z from "zod";

const authResponses = {
  login: {
    post: {
      async _200(username: string, password: string) {
        const response = await authRequests.login.post(username, password);
        expect(response.status()).toEqual(200);
        return zodHelper.prettyParse(
          z.strictObject({
            token: z.string().regex(/^[A-Za-z0-9]{16}$/),
          }),
          await response.json(),
        );
      },
      async _401(username: string, password: string) {
        const response = await authRequests.login.post(username, password);
        expect(response.status()).toEqual(401);
        zodHelper.prettyParse(
          z.strictObject({
            error: z.literal("Invalid credentials"),
          }),
          await response.json(),
        );
      },
    },
  },
  validate: {
    post: {
      async _200(token: string) {
        const response = await authRequests.validate.post(token);
        expect(response.status()).toEqual(200);
        zodHelper.prettyParse(
          z.strictObject({
            valid: z.literal(true),
          }),
          await response.json(),
        );
      },
      async _403(token: string) {
        const response = await authRequests.validate.post(token);
        expect(response.status()).toEqual(403);
        zodHelper.prettyParse(
          z.strictObject({
            error: z.literal("Invalid token"),
          }),
          await response.json(),
        );
      },
    },
  },
};

export default authResponses;
