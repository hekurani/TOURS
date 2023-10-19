import {getCookie} from './getCookie.js';
import {setCookie,deleteCookie} from './formatCookie.js'
export const sendRequestToken=async ()=>{
    try {
        // Use the 'headers' object in the request configuration
        const config = {
            headers: {
              // Set the 'refreshtoken' header using the value from the cookie
              refreshtoken: getCookie("refreshjwt")
            },
          };
        const res = await axios.post('http://127.0.0.1:3003/api/v1/user/refreshToken',null, config);
  
        if (res.data.status === 'success') {
            deleteCookie("jwt")
            setCookie("jwtToken",res.data.accessToken,10);
  setCookie('refreshjwt',res.data.refreshToken2);  
  window.location.reload();
        }
        else{
          deleteCookie("jwt");
          deleteCookie("refreshjwt")
        }
      } catch (err) {
        console.error("Error:", err);
      }
};