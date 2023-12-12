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
  const response = await fetch(`${BaseAPI_URL}/events`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('JWT')}`
    }
  });
  const jsonDataa = await response.json();
  console.log(jsonDataa)
  return 0;
}