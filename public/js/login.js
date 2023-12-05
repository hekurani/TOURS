// import setCookie from './setCookie';
import {showAlert} from './alert.js';
import {setCookie,deleteCookie} from './formatCookie.js';
export const login=async (email,password)=>{
  try{
const res = await axios.post('http://127.0.0.1:3003/api/v1/user/login', {
    email,
    password,
  }, {
    withCredentials: true
     // Make sure you set this for cookie handling
  });
if(res.data.status=='success'){
  setCookie("jwtToken",res.data.token,10);
  setCookie('refreshjwt',res.data.resetToken);  
  showAlert("Success","Loged In Successfully!");
window.setTimeout(()=>{
  location.assign('/')
},1500)
  }
    }
    catch(err){
      console.log(err);
        showAlert("error",err.response.data.message);
    }
}

export  const logOut =async()=>{
  try {
    const headers={
      Authorization:'Bearer '+null,
      refreshtoken:null
    }
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3003/api/v1/user/logout',
      headers
    });
    if ((res.data.status = 'success')){
      deleteCookie("jwtToken");
      deleteCookie('refreshjwt');
      location.assign('/')
      
      }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }

}
export const signUp=async (data)=>{
  try{
const res = await axios.post('http://127.0.0.1:3003/api/v1/user/signUp', data, {
    withCredentials: true
     // Make sure you set this for cookie handling
  });
if(res.data.status=='success'){
  setCookie("jwtToken",res.data.token,10);
  setCookie('refreshjwt',res.data.resetToken);  
  showAlert("Success","Signed Ups Successfully!");
window.setTimeout(()=>{
  location.assign('/')
},1500)
  }
    }
    catch(err){
        showAlert("error",err.response.data.message.message);
    }
}