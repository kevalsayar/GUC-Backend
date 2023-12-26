class ApiResponse {
  constructor(code, message, data) {
    this.code = code; // HTTP status code (e.g., 200 for success)
    this.status = true; // A status flag indicating success (true)
    this.message = message; // A message describing the response
    this.data = data; // Data associated with the response (e.g., the actual response data)
  }
}

module.exports = { ApiResponse };
