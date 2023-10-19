import {showAlert} from './alert.js';
export async function resetPassword(password,passwordConfirm,token){
    try{
       
        const res = await axios.patch(`http://127.0.0.1:3003/api/v1/user/resetPassword/${token}`, {
            password,
            passwordConfirm
          });
          console.log(res);
          if(res.data.status=='success'){
            showAlert("Success","An link to reset your password has been sent in your inbox!");
            window.location.reload();
          }
    }
    catch(err){
        console.log(err);
        showAlert("error",err.response.data.message);
    }
}