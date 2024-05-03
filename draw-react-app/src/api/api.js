import axios from "axios";

const baseUrl = window.config.baseUrl;
const username = window.config.username;

const headers = {
  "X-Username": username,
};

export const getMacbookWinners = async () => {
  try {
    const response = await axios.get(`${baseUrl}/macbook-winners`, { headers });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching macbook winners", error);
    if (error.response && error.response.status === 401) {
      //Received 401 Unauthorized response from API GW. The access token may have expired.

      // Try to refresh the token
      const refreshResponse = await fetch("/auth/refresh", {
        method: "POST",
      });

      const status = refreshResponse.status;
      if (status === 401) {
        // Session has expired (i.e., Refresh token has also expired).
        // Redirect to login page
        window.location.href = "/auth/login";
      }
      if (status !== 204) {
        // Tokens cannot be refreshed due to a server error.
        console.log("Failed to refresh token. Status: " + status);

        //  Throw the 401 error from API Gateway.
        throw error;
      }
      // Token refresh successful. Retry the API call.
      const response = await axios.get(`${baseUrl}/macbook-winners`);
      console.log(response);
      return response.data;
    } else {
      throw error;
    }
  }
};

export const getCyberTruckWinner = async (payload) => {
  try {
    const response = await axios.post(
      `${baseUrl}/cybertruck-winner`,
      payload,
      { headers }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching macbook winners", error);
    if (error.response && error.response.status === 401) {
      //Received 401 Unauthorized response from API GW. The access token may have expired.

      // Try to refresh the token
      const refreshResponse = await fetch("/auth/refresh", {
        method: "POST",
      });

      const status = refreshResponse.status;
      if (status === 401) {
        // Session has expired (i.e., Refresh token has also expired).
        // Redirect to login page
        window.location.href = "/auth/login";
      }
      if (status !== 204) {
        // Tokens cannot be refreshed due to a server error.
        console.log("Failed to refresh token. Status: " + status);

        //  Throw the 401 error from API Gateway.
        throw error;
      }
      // Token refresh successful. Retry the API call.
      const response = await axios.get(`${baseUrl}/cybertruck-winner`);
      console.log(response);
      return response.data;
    } else {
      throw error;
    }
  }
};
