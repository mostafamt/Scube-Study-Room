import { useState, useEffect } from "react"
import jwt_decode from "jwt-decode"
import config from "../config"
import axios from "axios"

const useAuth = () => {
  //let conf = config

  const [userInfo, setUserInfo] = useState(null)

  const check = () => {
    const location = window.location.href

    const url = new URL(location.replace("#", "?"))

    const tenantIdFromUrl = url.searchParams.get("tenant_id")
    const tenantIdFromStorage = localStorage.getItem("tenant_id")
    if (tenantIdFromUrl) localStorage.setItem("tenant_id", tenantIdFromUrl)

    const requestparam = tenantIdFromUrl
      ? `tenant_id/${tenantIdFromUrl}`
      : tenantIdFromStorage
      ? `tenant_id/${tenantIdFromStorage}`
      : "domain_name/smart-study-room.eduedges.com"
    axios
      .get(`https://apis.eduedges.com/api/tm/tenants/${requestparam}`)
      .then((res) => {
        if (res.data.tenant) {
          const data = res.data.tenant
          // let loginRedirectUrl = `${data.domain_name}/login?client_id=${
          //   data.app_client_id
          // }&response_type=${data.type}&scope=${data.scopes.join(
          //   "+"
          // )}&redirect_uri=${data.ssr_redirect_uri}`

          let loginRedirectUrl = `${data.domain_name}/login?client_id=${
            data.app_client_id
          }&response_type=${data.type}&scope=${data.scopes.join(
            "+"
          )}&redirect_uri=${config.REDIRECT_URI}`

          // let loginRedirectUrl = config.REDIRECT_URI

          const idTokenFromUrl = url.searchParams.get("id_token")
          const accessTokenFromUrl = url.searchParams.get("access_token")

          if (idTokenFromUrl) {
            try {
              const decoded = jwt_decode(idTokenFromUrl)

              localStorage.setItem("id_token", idTokenFromUrl)
              localStorage.setItem("access_token", accessTokenFromUrl)

              localStorage.setItem("tenant_id", tenantIdFromUrl)
              setUserInfo(decoded)
            } catch (error) {
              window.location = loginRedirectUrl
            }
          } else {
            const token = localStorage.getItem("id_token")

            if (token) {
              try {
                const decoded = jwt_decode(token)

                setUserInfo(decoded)
              } catch (error) {
                console.log(error)
                window.location = loginRedirectUrl
              }
            } else {
              window.location = loginRedirectUrl
            }
          }
        } else {
          // return error page
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  useEffect(() => {
    if (!userInfo) {
      check()
    }
  })

  return userInfo
}
export default useAuth

// import { useState, useEffect } from "react"
// import jwt_decode from "jwt-decode"
// import config from "../config"

// const useAuth = () => {
//   let conf = config

//   const [userInfo, setUserInfo] = useState(null)

//   const check = () => {
//     const location = window.location.href

//     let loginRedirectUrl = `${conf.DOMAIN}/login?client_id=${
//       conf.APP_CLIENT_ID
//     }&response_type=${conf.TYPE}&scope=${conf.SCOPES.join("+")}&redirect_uri=${
//       conf.REDIRECT_URI
//     }`

//     const url = new URL(location.replace("#", "?"))
//     const idTokenFromUrl = url.searchParams.get("id_token")
//     const accessTokenFromUrl = url.searchParams.get("access_token")
//     const tenantIdFromUrl = url.searchParams.get("tenant_id")

//     if (idTokenFromUrl) {
//       try {
//         const decoded = jwt_decode(idTokenFromUrl)
//         console.log(decoded)

//         // const idToken = {
//         //   value: idTokenFromUrl,
//         //   expiry: decoded.exp,
//         // }
//         // const accessToken = {
//         //   value: accessTokenFromUrl,
//         //   expiry: decoded.exp,
//         // }
//         //console.log(idToken)
//         localStorage.setItem("id_token", idTokenFromUrl)
//         localStorage.setItem("access_token", accessTokenFromUrl)
//         // localStorage.setItem("id_token", JSON.stringify(idToken))
//         // localStorage.setItem("access_token", JSON.stringify(accessToken))
//         localStorage.setItem("tenant_id", tenantIdFromUrl)
//         setUserInfo(decoded)
//       } catch (error) {
//         window.location = loginRedirectUrl
//       }
//     } else {
//       const token = localStorage.getItem("id_token")

//       if (token) {
//         // token = JSON.parse(token)
//         try {
//           //  const decoded = jwt_decode(token.value)

//           const decoded = jwt_decode(token)

//           setUserInfo(decoded)
//         } catch (error) {
//           console.log(error)
//           window.location = loginRedirectUrl
//         }
//       } else {
//         window.location = loginRedirectUrl
//       }
//     }
//   }

//   useEffect(() => {
//     if (!userInfo) {
//       check()
//     }
//   })

//   return userInfo
// }

// export default useAuth
