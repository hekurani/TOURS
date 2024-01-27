import { showAlert } from './alert.js';
import {getCookie} from './getCookie.js'

export async function addTour(data){
    try {
        const url ='http://127.0.0.1:3003/api/v1/tour';
           console.log("HYTI",data)
            const headers = {
              Authorization: 'Bearer ' + getCookie('jwtToken')
            };
        const res = await axios({
          method: 'POST',
          url,
          data,
          headers
        });
        if (res.data.status === 'success') {
          showAlert('success', `Tour added successfully!`);
          setTimeout(()=>{
            window.location.reload();
          },3000)
        }
      } catch (err) {
        console.log(err);
        showAlert('error', err.response.data.message.message);
      }
}
export async function editTour(data,tourId){
    try {
        const url =`http://127.0.0.1:3003/api/v1/tour/`+tourId ;
           console.log("HYTI",data)
            const headers = {
              Authorization: 'Bearer ' + getCookie('jwtToken')
            };
        const res = await axios({
          method: 'PATCH',
          url,
          data,
          headers
        });
        if (res.data.status === 'success') {
          showAlert('success', `Tour edited successfully!`);
          setTimeout(()=>{
            window.location.reload();
          },3000)
        }
      } catch (err) {
        console.log(err);
        showAlert('error', err.response.data.message.message);
      }
}
export async function deleteTour(tourId){
    try {
        const url =`http://127.0.0.1:3003/api/v1/tour/`+tourId ;
            const headers = {
              Authorization: 'Bearer ' + getCookie('jwtToken')
            };
        const res = await axios({
          method: 'DELETE',
          url,
          headers
        });
        if (res.data.status === 'success') {
          showAlert('success', `Tour deleted successfully!`);
          setTimeout(()=>{
            window.location.reload();
          },3000)
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
      }
}