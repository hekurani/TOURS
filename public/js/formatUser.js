import { showAlert } from './alert.js';
import {getCookie} from './getCookie.js'

export async function editUser(role,userId){
    try {
        const url =`http://127.0.0.1:3003/api/v1/user/`+userId ;
            const headers = {
              Authorization: 'Bearer ' + getCookie('jwtToken')
            };
            const updateObj={
                role:role
            }
        const res = await axios({
          method: 'PATCH',
          url,
          data:updateObj,
          headers
        });
        console.log(res);
        // if (res.data.status === 'success') {
        //   showAlert('success', `Tour edited successfully!`);
        //   setTimeout(()=>{
        //     window.location.reload();
        //   },3000)
        //}
      } catch (err) {
        showAlert('error', err.response.data.message);
      }
}
export async function deleteUser(userId){
    try {
        const url =`http://127.0.0.1:3003/api/v1/user/`+userId ;
            const headers = {
              Authorization: 'Bearer ' + getCookie('jwtToken')
            };
        const res = await axios({
          method: 'DELETE',
          url,
          headers
        });
        if (res.data.status === 'success') {
          showAlert('success', `User deleted successfully!`);
          setTimeout(()=>{
            window.location.reload();
          },3000)
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
      }
}
export async function deleteYourself(){
    try {
        const url =`http://127.0.0.1:3003/api/v1/user/deleteMe`;
            const headers = {
              Authorization: 'Bearer ' + getCookie('jwtToken')
            };
        const res = await axios({
          method: 'DELETE',
          url,
          headers
        });
        if (res.data.status === 'success') {
          showAlert('success', `User deActivated successfully!`);
          setTimeout(()=>{
            location.assign('/')
          },3000)
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
      }
}