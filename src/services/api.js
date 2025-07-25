// src/services/api.js
const backendBaseUrl = process.env.REACT_APP_API_BASE_URL;

export const solveWithBackend = async (scrambleString) => {
    // IMPORTANT: Make sure your C# server is running and this URL is correct.
    // The port number (e.g., 7251) might be different on your machine.
    // Check the output in your C# terminal to find the correct "https" URL.
    const apiUrl = `${backendBaseUrl}/api/solve`;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scramble: scrambleString }),
    });

    const data = await response.json();

    if (!response.ok) {
        // If the server returned an error, use its message
        throw new Error(data.error || `Server error: ${response.status}`);
    }

    return data.solution;
};