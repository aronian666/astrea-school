export const GET = async ({ url }) => {
    const type = url.searchParams.get("type")
    const number = url.searchParams.get("number")
    const getRequest = `https://apis.aqpfact.pe/api/${type}/${number}`
    console.log(getRequest)
    const request = await fetch(getRequest, {
        headers: {
            Authorization: `Bearer 7204|ER1rW6iRWwmcD4thwAwHRsyKh9xljdFkYdf3j9H5`
        }
    })
    const person = await request.json()

    const response = new Response(JSON.stringify(person), {
        status: 200,
        headers: { 'Content-Type': "application/json" }
    })
    return response
}