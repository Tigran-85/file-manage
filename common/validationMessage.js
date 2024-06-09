

const RESPONSE_MESSAGES = {
  SIGN_OUT: 'Signed out',
  DELETED: 'Deleted successfully',
  UPDATED: 'Updated successfully',
  UPLOADED: 'Uploaded successfully'
};

const ERROR_MESSAGES = {
  USER_EXIST: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  FILE_NOT_FOUND: 'File not found',
  USER_DOES_NOT_EXIST: "User doesn't exist",
  NO_FILE_UPLOADED: 'No file uploaded',
  DOWLOAD_FAIL: 'Failed to download file',
  INVALID_FILE_FORMAT: 'Invalid File format',
  SOMETHING_WENT_WRONG: 'Something went wrong',
  INVALID_CREDENTIALS: 'Incorrect email and/or password',
  UNAUTHORIZED: 'Unauthorized',
  INVALID_TOKEN: 'Invalid token',
  NOT_ALLOWED: 'Not allowed',
  SERVER_ERROR: 'Server Error'
};

const VALIDATION_ERROR_MESSAGES = {
  REQUIRED: "Field is required",
  EMAIL: "Please enter a valid email address.",
  DATE: "Please enter a valid date.",
  NUMBER: "Please enter a valid number.",
  DIGITS: "Please enter only digits.",
  VALIDATION_ERROR: "Validation error",
  maxlength: (length) => `Please enter no more than ${length} characters.`,
  minlength: (length) => `Please enter at least ${length} characters.`,
  max: (max) => `Please enter a value less than or equal to ${max}.`,
  min: (min) => `Please enter a value greater than or equal to ${min}.`,
};

module.exports = {
  RESPONSE_MESSAGES,
  ERROR_MESSAGES,
  VALIDATION_ERROR_MESSAGES
}