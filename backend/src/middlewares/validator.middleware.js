import {validationResult} from 'express-validator';

import {ApiError} from "../utils/api-error.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map(err => ({
    [err.path]: err.msg,
  }));

  return res.status(422).json({
    success: false,
    message: "Validation Error",
    errors: extractedErrors,
  });
};
