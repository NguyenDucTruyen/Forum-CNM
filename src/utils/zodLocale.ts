// src/utils/zodLocale.ts
import type { ZodErrorMap } from 'zod';
import { z, ZodIssueCode } from 'zod';

export const errorMap: ZodErrorMap = (issue, _ctx) => {
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === 'undefined') {
        return { message: 'This field is required' };
      }
      return { message: `Invalid data type. Expected ${issue.expected}, received ${issue.received}` };
    case ZodIssueCode.invalid_string:
      if (issue.validation === 'email') {
        return { message: 'Invalid email address' };
      }
      if (issue.validation === 'url') {
        return { message: 'Invalid URL' };
      }
      return { message: 'Invalid string' };
    case ZodIssueCode.too_small:
      return { message: `Value must be greater than or equal to ${issue.minimum}` };
    case ZodIssueCode.too_big:
      return { message: `Value must be less than or equal to ${issue.maximum}` };
    default:
      return { message: 'Invalid value' };
  }
};

z.setErrorMap(errorMap);
