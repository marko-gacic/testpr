const BASE_URL = "https://localhost:8081";

export async function loginUser(credentials) {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed. Please check your credentials.");
    }

    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
}
