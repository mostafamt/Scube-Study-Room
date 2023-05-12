const axios = require("axios")

const instance = axios.create({
  baseURL: "https://apis.eduedges.com/api",
})

instance.interceptors.request.use(
  (request) => {
    const authHeader = {
      Authorization: localStorage.getItem("access_token"),
      IdToken: localStorage.getItem("id_token"),
      TENANT_ID: localStorage.getItem("tenant_id"),
    }

    request.headers.Authorization = JSON.stringify(authHeader)

    // request.headers.Authorization = localStorage.getItem("access_token")
    // request.headers.IdToken = localStorage.getItem("id_token")
    // request.headers.TENANT_ID = localStorage.getItem("tenant_id")
    // request.headers.contentType = "application/json"

    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)
// instance.interceptors.request.use((request) => {
//   console.log("Starting Request", JSON.stringify(request, null, 2))
//   return request
// })

// instance.interceptors.response.use((response) => {
//   console.log("Response:", JSON.stringify(response, null, 2))
//   return response
// })
export default instance
