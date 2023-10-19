import { showAlert } from './alert.js';
import {getCookie} from './getCookie.js'

export async function deleteAdminReview(tourId){
    try {
        const url =`http://127.0.0.1:3003/api/v1/reviews/`+tourId ;
            const headers = {
              Authorization: 'Bearer ' + getCookie('jwtToken')
            };
        const res = await axios({
          method: 'DELETE',
          url,
          headers
        });
        if (res.data.status === 'success') {
          showAlert('success', `Review deleted successfully!`);
          setTimeout(()=>{
            window.location.reload();
          },3000)
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
      }
}