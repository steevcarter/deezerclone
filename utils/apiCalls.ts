const url = process.env.NEXT_PUBLIC_API_BASE_URL!;
const xRapidapiKey = process.env.NEXT_PUBLIC_API_KEY!;
const xRapidapiHost = process.env.NEXT_PUBLIC_API_HOST!;

const fetchSongs = async (query: string, index: number = 0) => {
  const endpoint = url + `/search?q=${query}&index=${index}`;
  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      "x-rapidapi-key": xRapidapiKey,
      "x-rapidapi-host": xRapidapiHost,
    },
  });
  if (!res.ok) {
    const errorObj = await res.json();
    throw new Error(errorObj.message);
  }
  const data = await res.json();
  const { data: songs, error, next } = data;

  //api response with 200 and Exception
  if (error) {
    throw new Error(error.message);
  }
  return { songs, next };
};

export { fetchSongs };
