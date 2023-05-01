export async function updateFetch(
  url: string,
  body: {} = {},
  method: string = "PUT"
) {
  return fetch(`${process.env.NEXT_PUBLIC_API_HOSTNAME}${url}`, {
    method,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .catch();
}
