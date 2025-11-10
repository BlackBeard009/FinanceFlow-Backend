import { ValidationError } from 'class-validator';

export function generateValidationErrorMessage(errors: ValidationError[]) {
  let message = `Validation Failed:
  `;

  errors.forEach((error, idx) => {
    message += `Issue ${idx}:
    Field: ${error.property}`;
  });

  return message;
}
