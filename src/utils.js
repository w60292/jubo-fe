/**
 * Fetch API Encapsulation
 */
const fetchAPI = async (method = "POST", endpoint, bodyObj) => {
  const headers = new Headers();
  const raw = JSON.stringify(bodyObj);
  const requestOptions = {
    method,
    headers: headers,
    body: raw,
  };

  headers.append("Content-Type", "application/json");

  return await fetch(endpoint, requestOptions)
    .then((resp) => resp.json())
    .catch((err) => console.error(err));
};

export { fetchAPI };
