import { json } from "react-router-dom";

const BaseAPI_URL = "http://localhost:5000"

async function fetchWithAuth(relativePath) {
  if (localStorage.getItem('JWT') != null) {
    const response = await fetch(`${BaseAPI_URL}/${relativePath}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('JWT')}`
      }
    });
    const jsonDataa = await response.json();
    return jsonDataa
  } else {
    console.log("Missing JWT")
    const response = new Response(JSON.stringify({message:"Bad Format"}), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
    return await response.json()
  }
}

export const authenticate = async () => {
  console.log("Begin Auth")
  const response = await fetch(`${BaseAPI_URL}/login`);
  const jsonData = await response.json();

  // Go to generated auth url to sign in with google
  window.location.assign(jsonData.auth_url);
  console.log("Auth complete")
  return jsonData.auth_url;
}

export const getEvents = async () => {
  var result = await fetchWithAuth("/events")
  return result;
}

export const getLocations = async () => {
  var result = await fetchWithAuth("/locations")
  return result;
}

export const getTopReviews = async () => {
  var result = await fetchWithAuth("/reviews/latest")
  console.log(result)
  return result;
}