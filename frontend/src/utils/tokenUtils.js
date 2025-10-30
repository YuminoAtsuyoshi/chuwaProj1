// Utility function to decode registration tokens
// In a real application, this would properly decode JWT tokens
export const decodeRegistrationToken = (token) => {
  try {
    // For testing purposes, we'll simulate token decoding
    // In production, you would use a JWT library like jsonwebtoken
    const decodedToken = atob(token);

    // Check if the decoded token contains an email
    if (decodedToken.includes("@")) {
      return { email: decodedToken };
    }

    // If no email found, return a default email for testing
    return { email: "employee@company.com" };
  } catch (error) {
    throw new Error("Invalid token format");
  }
};

// Helper function to create a test token (for development purposes)
export const createTestToken = (email) => {
  // This is just for testing - in production, tokens would be created by the backend
  return btoa(email);
};
