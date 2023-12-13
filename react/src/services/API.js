import { json } from "react-router-dom";

const BaseAPI_URL = "http://localhost:5000"

export const authenticate = async () => {
  console.log("Begin Auth")
  const response = await fetch(`${BaseAPI_URL}/login`);
  const jsonData = await response.json();

  // Go to generated auth url to sign in with google
  window.location.assign(jsonData.auth_url);
  console.log("Auth complete")
  return 0;
}

export const getEvents = async () => {
  if (localStorage.getItem('JWT') != null) {
    const response = await fetch(`${BaseAPI_URL}/events`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('JWT')}`
      }
    });
    const jsonDataa = await response.json();
    console.log(jsonDataa)
  } else {
    console.log("Missing JWT")
    return new Response(JSON.stringify({"message":"Bad Format"}), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  
  return 0;
}