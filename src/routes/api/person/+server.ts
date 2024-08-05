export const GET = async ({ url }) => {
    const query = url.searchParams.get("query")
    const request = await fetch(`https://api.apis.net.pe/v2/${query}`, {
        headers: {
            Authorization: `Bearer apis-token-5992.v6KOglT82pE2X-vsl5O4gKilMLGSOq6e`
        }
    })
    const person = await request.json()
    const response = new Response(JSON.stringify(person), {
        status: 200,
        headers: { 'Content-Type': "application/json" }
    })
    return response
}