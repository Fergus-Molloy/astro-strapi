interface Props {
    query?: Record<string, string>;
    wrappedByKey?: string;
    wrappedByList?: boolean;
}

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 * @param wrappedByKey - The key to unwrap the response from
 * @param wrappedByList - If the response is a list, unwrap it
 * @returns
 */
export default async function fetchApi<T>(endpoint: string,
    {
        query,
        wrappedByKey,
        wrappedByList,
    }: Props = {}): Promise<T> {

    if (endpoint.startsWith("/")) {
        endpoint = endpoint.slice(1);
    }

    const url = new URL(`${import.meta.env.STRAPI_URL}/api/${endpoint}`);

    if (query) {
        Object.entries(query).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }
    const token = import.meta.env.STRAPI_TOKEN;
    const res = !token
        ? await fetch(url.toString())
        : await fetch(url.toString(), { headers: { Authorization: "Bearer " + token } });

    let data = await res.json();
    console.log("Response data: " + JSON.stringify(data));

    if (wrappedByKey) {
        data = data[wrappedByKey];
        console.log("Unwrapped by key `" + wrappedByKey + "`: " + JSON.stringify(data));
    }

    if (wrappedByList) {
        data = data[0];
        console.log("Unwrapped by list: " + JSON.stringify(data));
    }

    return data as T;
}
