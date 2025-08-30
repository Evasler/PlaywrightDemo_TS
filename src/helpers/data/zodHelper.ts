/**
 * @description This module provides utilities for data validation using Zod schemas.
 * It enhances Zod's error reporting with prettier formatting and simplified validation.
 */

import z from "zod";

/**
 * Helper module for validating data against Zod schemas.
 *
 * This module provides functionality to validate data against Zod schemas and
 * return prettified error messages when validation fails.
 */
const zodHelper = {
  /**
   * Parses data against a Zod schema and provides a prettified error message if validation fails.
   *
   * @template T The type of Zod schema
   * @param schema The Zod schema to validate against
   * @param data The data to validate
   * @returns The parsed and validated data
   * @throws Throws an error with prettified validation details if validation fails
   */
  prettyParse<T extends z.ZodType>(schema: T, data: unknown) {
    const result = schema.safeParse(data);
    if (!result.success)
      throw new Error(
        `\n\n${JSON.stringify(data)}\n\n${z.prettifyError(result.error)}`,
      );
    return result.data;
  },
};

export default zodHelper;
