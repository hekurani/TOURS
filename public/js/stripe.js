import { showAlert } from './alert.js';
import {getCookie} from './getCookie.js'
const stripe=Stripe('pk_test_51NvgCcDCm7auwY2EMw4bQV0zkYhY4yizY0JHyJiMoYBDWTjGKBRFiKuVzsP9OzCKJcY7RxEbew4HakRtU7G6OQxS00NswgbU4S')

export const bookTour= async tourId => {
    try{
        const headers = {
            authorization: 'Bearer ' + getCookie('jwtToken')
          };
//1) Get checkout session from API
const session = await axios({method:'GET',url:`http://127.0.0.1:3003/api/v1/booking/checkout-session/${tourId}`,headers
})
await stripe.redirectToCheckout({
    sessionId: session.data.session.id
  });
//2) Create checkout form + charge the card
    }
    catch(err){
showAlert('error',err.message)
    }

}