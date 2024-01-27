import {showAlert} from './alert.js';
export async function forgotPassword(email){
    try{
       
        const res = await axios.post('http://127.0.0.1:3003/api/v1/user/forgotPassword', {
            email
          });
         
          if(res.data.status=='success'){
            showAlert("Success","An link to reset your password has been sent in your inbox!");
            window.location.reload();
          }
    }
    catch(err){
        showAlert("error",err.response.data.message);
    }
}