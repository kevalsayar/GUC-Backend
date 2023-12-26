class ApiError extends Error {
  constructor(
    code = 500, // Default HTTP status code is 500 (Internal Server Error)
    message = "Server encountered an unexpected condition that prevented it from fulfilling the request!", // Default error message
    data = null // Default data (additional information, if needed)
  ) {
    super(message)
    this.code = code; // Set the HTTP status code property
    this.status = false; // Set a custom status property (this can be used to indicate failure)
    this.data = data; // Set the data property (optional)
    this.message = message; // Set the error message property
  }
}

module.exports = { ApiError };
