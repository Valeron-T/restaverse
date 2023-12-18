const BaseAPI_URL = import.meta.env.VITE_BASEAPI_URL

// Call API calls with this wrapper to check if auth token is present locally.
async function fetchWithAuth(relativePath, method = "GET", requestBody = null) {
  if (localStorage.getItem('JWT') != null) {
    const response = await fetch(`${BaseAPI_URL}${relativePath}`, {
      method: method,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('JWT')}`,
        'Content-Type': 'application/json'
      },
      body: (method === "POST" || method === "PUT" || method === "DELETE") ? JSON.stringify(requestBody) : null
    });
    const jsonDataa = await response.json();
    return jsonDataa
  } else {
    console.log("Missing JWT")
    const response = new Response(JSON.stringify({ message: "Bad Format" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
    return await response.json()
  }
}

// Handles OAuth flow
export const authenticate = async () => {
  // console.log("Begin Auth")
  const response = await fetch(`${BaseAPI_URL}/login`);
  const jsonData = await response.json();

  // Go to generated auth url to sign in with google
  window.location.replace(jsonData.auth_url);
  // console.log("Auth complete")
  return jsonData.auth_url;
}

export const logout = async () => {
  console.log("Logout initiated")
  const response = await fetchWithAuth(`/logout`);
  localStorage.removeItem('JWT');
  localStorage.removeItem('user');
  localStorage.removeItem('email');
  window.location.replace("/");
  // console.log(response)
  return 0;
}

export const getEvents = async () => {
  // var result = await fetchWithAuth("/test")
  return 0;
}

// Gets all available locations linked to user account
export const getLocations = async () => {
  var result = await fetchWithAuth("/locations")
  return result;
}

// Gets top 50 reviews across all locations linked to user account
export const getTopReviews = async () => {
  var result = await fetchWithAuth("/reviews/latest")
  // console.log(result)
  return result;
}

// Updates a particular review
export const replyToReview = async (reviewId, replyMessage) => {
  // reviewID is a full review identifier such as accounts/*/locations/*/reviews/*
  const reqbody = {
    "rid": reviewId,
    "reply": replyMessage
  }
  var result = await fetchWithAuth("/reviews/reply", "PUT", reqbody)
  window.location.reload()
  // console.log(result)
  return result;
}

// Deletes a particular review
export const deleteReview = async (reviewId) => {
  // reviewID is a full review identifier such as accounts/*/locations/*/reviews/*
  const reqbody = {
    "rid": reviewId
  }
  var result = await fetchWithAuth("/reviews/delete", "DELETE", reqbody)
  window.location.reload()
  // console.log(result)
  return result;
}