import { BadRequest } from '@tsed/exceptions';
import { ExtendedBadRequest } from 'src/exceptions/extended-bad-request';
import { z, ZodError } from 'zod';

// eslint-disable-next-line prettier/prettier
export function validateSchema<Schema extends z.ZodTypeAny>(
  schema: Schema,
  values: unknown,
): z.infer<Schema> {
  try {
    return schema.parse(values);
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string> = {};

      error.errors.forEach((fieldError) => {
        const [errorMessage] = fieldError.message.split(':');
        if (errorMessage) {
          errors[fieldError.path.join('.')] = errorMessage.trim();
        }
      });

      if (Object.values(errors).length > 0) {
        throw new ExtendedBadRequest(errors);
      }
    }

    throw new BadRequest(JSON.stringify(error.message));
  }
}
