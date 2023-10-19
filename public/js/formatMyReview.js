import {showAlert} from './alert.js';
import {getCookie} from './getCookie.js';
export async function addReview(review,tour,user,rating){
try{
    const config = {
        headers: {
          Authorization: 'Bearer ' + getCookie('jwtToken')
        },
      };
    const res = await axios.post('http://127.0.0.1:3003/api/v1/reviews', {
        review,
        tour,
        user,
        rating
      },config);
      if(res.data.status=='Success'){
        showAlert("Success","You posted an review");
        window.location.reload();
      }
}
catch(err){
    showAlert("error",err.response.data.message);
}
}

export async function editReview(reviewId,review,rating){
    try{
        const config = {
            headers: {
              Authorization: 'Bearer ' + getCookie('jwtToken')
            },
          };
        const res = await axios.patch('http://127.0.0.1:3003/api/v1/reviews/'+reviewId , {
            review,
            rating
          },config);
          if(res.data.status=='success'){
            showAlert("Success","You edited your review");
            window.location.reload();
          }
    }
    catch(err){
        showAlert("error",err.response.data.message);
    }
}

export async function deleteReview(reviewId){
    try {
        const url =`http://127.0.0.1:3003/api/v1/reviews/`+reviewId ;
            const headers = {
              Authorization: 'Bearer ' + getCookie('jwtToken')
            };
        const res = await axios({
          method: 'DELETE',
          url,
          headers
        });
        if (res.data.status === 'success') {
          showAlert('success', `You deleted your review successfully!`);
          setTimeout(()=>{
            window.location.reload();
          },3000)
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
      }
}