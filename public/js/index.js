import { getCookie } from './getCookie.js';
import {login,logOut,signUp} from './login.js'
import {updateSettings} from'./updateSettings.js'
import { sendRequestToken } from './retakeToken.js';
import { bookTour} from './stripe.js';
import{editUser,deleteUser,deleteYourself} from './formatUser.js'
import{closeModal,closeEditModal,openEditModal,openModal,openDeleteModal,closeDeleteModal} from './formatModals.js'
import{addTour,editTour,deleteTour} from './formatTour.js';
import{addReview,editReview,deleteReview} from './formatMyReview.js'
import{forgotPassword} from './forgotPassword.js';
import{resetPassword} from './resetPassword.js'
import{deleteAdminReview} from './formatReview.js'
const deleteReviewForm=document.querySelector('#deleteReviewForm');
const deleteUserForm=document.querySelector('#deleteUser')
const deleteTourForm=document.getElementById('deleteTour');
const userForm=document.querySelector('.form--EditUser');
const myEditReview=document.getElementById('editYouReview');
const myDeleteReview=document.getElementById('deleteYourReview');
const loginForm = document.querySelector('.form--login');
const signUpForm = document.querySelector('.form--SignUp');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const addModal = document.getElementById("addTour");
const modal = document.querySelector(".modal-overlay");
const closeBtn = document.querySelector(".close-modal-btn");
const closeEditBtn = document.querySelector(".close-modal-btn-edit");
const editbtnModal = document.querySelectorAll('.settings');
const editModal=document.querySelector('.modal-overlay-edit');
const closeDeleteBtn = document.querySelector(".close-modal-btn-delete");
const deletebtnModal = document.querySelectorAll('.delete');
const deleteModal=document.querySelector('.modal-overlay-delete');
const deleteMe=document.querySelector('#deleteMe');
const createTourForm=document.querySelector('#form-create-Tour');
const forgotPasswordForm=document.getElementById('forgot-password');
const resetPasswordForm=document.querySelector('.form--ResetPassword');
if(signUpForm){
  signUpForm.addEventListener('submit', e=>{
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('nameS').value)
    form.append('email',document.getElementById('emailS').value)
    form.append('password',document.getElementById('passwordS').value)
    form.append('passwordConfirm',document.getElementById('passwordSC').value)
    form.append('photo',document.getElementById('photoS').files[0])
    signUp(form);
  })
}
if (loginForm){
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
if (logOutBtn) logOutBtn.addEventListener('click', logOut);
if(userDataForm){
  userDataForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value)
    form.append('email',document.getElementById('email').value)
    form.append('photo',document.getElementById('photo').files[0])
    updateSettings(form, 'data');
  })
}
if(userPasswordForm){
  userPasswordForm.addEventListener('submit',async  (event)=>{
    event.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  }
)}
window.addEventListener('mouseover',()=>{
  const JWTValue=getCookie("jwtToken")
  const refreshJWTValue=getCookie("refreshjwt");
  if(!JWTValue && refreshJWTValue){
 sendRequestToken();
  }
})
if(bookBtn) {
  bookBtn.addEventListener('click',e=>{
    bookBtn.textContent='Processing...';
    const {tourId}=e.target.dataset;
bookTour(tourId);
  })
}
if(addModal){
addModal.addEventListener("click", openModal);
}
if(modal){
modal.addEventListener("click", (e) => closeModal(e, true));
}
if(closeBtn){
closeBtn.addEventListener("click", closeModal);
}
var id=null;
if(editbtnModal){
editbtnModal.forEach(el=>{
  el.addEventListener('click', (e) => {
    id=(el.getAttribute('data-editTour-id'));
    console.log(id);
    openEditModal();
  });
})
}
if(editModal){
editModal.addEventListener("click", (e) => closeEditModal(e, true));
}
if(closeEditBtn){
closeEditBtn.addEventListener("click", closeEditModal);
}

if(deletebtnModal){
  deletebtnModal.forEach(el=>{
    el.addEventListener('click', (e) => {
      id=el.getAttribute('data-deleteTour-id')
      openDeleteModal();
    });
  })
  }
 
 
   if(deleteModal){
  deleteModal.addEventListener("click", (e) => closeDeleteModal(e, true));
  }
  if(closeDeleteBtn){
  closeDeleteBtn.addEventListener("click", closeDeleteModal);
  }
  
  if(deleteMe){
    deleteMe.addEventListener('click',e=>{
      id=document.getElementById('deleteMe').getAttribute('data-me');
      console.log(id);
      openDeleteModal();
    })
  }
  if(createTourForm){
    createTourForm.addEventListener('submit',e=>{
      e.preventDefault();
      const selectedGuides = Array.from(document.getElementById('guidesT').selectedOptions).map(option => option.value);
      const name=document.getElementById('nameT').value;
      const slug=document.getElementById('slugT').value;
      const price=document.getElementById('priceT').value;
      const duration=document.getElementById('durationT').value;
      const maxGroupSize=document.getElementById('maxGroupSizeT').value;
      const difficulty=document.getElementById('difficultyT').value;
      const summary=document.getElementById('summaryT').value;
      const startDatesPrev=document.getElementById('startDatesT').value;
      const startLocatDesc=document.getElementById('startLocationDescT').value;
      const startLocCoord=document.getElementById('startLocCoordT').value;
      const imageCover=document.getElementById('photoS').files[0];
      const [image1,image2,image3]=document.getElementById('image').files;
      const secretTour=document.querySelector('input[name="tourOption"]:checked').value==="Yes";
     const startDates=new Array();
      startDatesPrev.split(',').forEach(el=>{
        startDates.push(el)
      })
      startDates.forEach((el,i)=>{
        const [year,month,day]=el.split('-');
        startDates[i]=new Date(year,month-1,day);
      })
     var startLocCoordTemp=startLocCoord.split(',');
      startLocCoordTemp.map((el,i)=>{
        startLocCoordTemp[i]=startLocCoordTemp[i]*1;
      })
      
      const form = new FormData();
      form.append('name', name);
      form.append('slug', slug);
      form.append('price', price);
      form.append('duration', duration);
      form.append('maxGroupSize', maxGroupSize);
      form.append('difficulty', difficulty);
      form.append('summary', summary);
      for(let i=0;i<startDates.length;i++){
        form.append('startDates['+i+']', startDates[i]);
      }
      for(var i=0;i<selectedGuides.length;i++){
        form.append('guides['+i+']', selectedGuides[i]);
      }
      form.append('startLocation[description]', startLocatDesc);
      form.append('startLocation[coordinates][0]', startLocCoordTemp[0]);
      form.append('startLocation[coordinates][1]', startLocCoordTemp[1]);
      form.append('imageCover', imageCover);
      if(image1){
        form.append('images', image1);
      }
      if(image2){
        form.append('images', image2);
      }
      if(image3){
        form.append('images', image3);
      }
      
      form.append('secretTour', secretTour);
      form.append('description', document.getElementById('descriptionT').value);
      addTour(form);
   
    })
  }

  const radioButtons = document.querySelectorAll('input[name="rate"]');
const postReviewForm=document.getElementById('POST-REVIEW');
var rate=0;
radioButtons.forEach((radio) => {
    radio.addEventListener('click', function() {
         rate = this.getAttribute('data-rate');
// This will log the value of data-rate attribute when the radio button is clicked
        // You can perform further operations using the 'rate' value here
    });
});
if(postReviewForm){
postReviewForm.addEventListener('submit',(event)=>{
  event.preventDefault();
  const button = document.querySelector('button[type="submit"]');
  const review=document.getElementById('review').value;
  const id=button.getAttribute('data-tour');
  const userId=button.getAttribute('data-user');
  addReview(review,id,userId,rate);
})
}
if(forgotPasswordForm){
  forgotPasswordForm.addEventListener('submit',event=>{
    event.preventDefault();
const email=document.getElementById('emailF').value;
forgotPassword(email);
  })
}
if(resetPasswordForm){
  resetPasswordForm.addEventListener('submit',event=>{
    event.preventDefault();
    const password=document.getElementById('passwordR').value;
    const passwordConfirm=document.getElementById('passwordNR').value;
   const token=document.getElementById('forgotPassword').getAttribute('data-token');
resetPassword(password,passwordConfirm,token);
  })
}

if(document.getElementById('editTour')){
  document.getElementById('editTour').addEventListener('click',e=>{
   
    e.preventDefault();
    var selectedGuides=[]
    if(document.getElementById('guidesTE').selectedOptions){ 
    selectedGuides = Array.from(document.getElementById('guidesTE').selectedOptions).map(option => option.value);
    }
    const name = document.getElementById('nameTE').value || null;
    const slug = document.getElementById('slugTE').value || null;
    const price = document.getElementById('priceTE').value || null;
    const duration = document.getElementById('durationTE').value || null;
    const maxGroupSize = document.getElementById('maxGroupSizeTE').value || null;
    const difficulty = document.getElementById('difficultyTE').value || null;
    const summary = document.getElementById('summaryTE').value || null;
    const startDatesPrev = document.getElementById('startDatesTE').value || null;
    const startLocatDesc = document.getElementById('startLocationDescTE').value || null;
    const startLocCoord = document.getElementById('startLocCoordTE').value || null;
    const imageCover = document.getElementById('photoSE').files[0] || null;
    const [image1, image2, image3] = document.getElementById('imageE').files;
    const secretTour=document.querySelector('input[name="tourOptionE"]:checked').value==="Yes";
  
   const startDates=new Array();
   if(startDatesPrev){
    startDatesPrev.split(',').forEach(el=>{
      startDates.push(el)
    })
  }
    startDates.forEach((el,i)=>{
      const [year,month,day]=el.split('-');
      startDates[i]=new Date(year,month-1,day);
    })
    if(startLocCoord){
   var startLocCoordTemp=startLocCoord.split(',');

    startLocCoordTemp.map((el,i)=>{
      startLocCoordTemp[i]=startLocCoordTemp[i]*1;
    })
  }
  else{
    var startLocCoordTemp=[]
  }
    const form = new FormData();
    if(name){
       form.append('name', name);
    }
    if(slug){
      form.append('slug', slug);
   }
   if(price){
    form.append('price', price);
   }
    if(duration){
form.append('duration', duration);
    }
    if(maxGroupSize){
      form.append('maxGroupSize', maxGroupSize);
    }
    if(difficulty){
      form.append('difficulty', difficulty);
    }
    if(summary){
      form.append('summary', summary);
    }
    
    for(let i=0;i<startDates.length;i++){
      form.append('startDates['+i+']', startDates[i]);
    }
    if(startLocatDesc){
      form.append('startLocation[description]', startLocatDesc);
    }
    if(startLocCoordTemp[0]){
      form.append('startLocation[coordinates][0]', startLocCoordTemp[0]);
    }
    if(startLocCoordTemp[1]){
    form.append('startLocation[coordinates][1]', startLocCoordTemp[1]);
    }
    if(imageCover){
    form.append('imageCover', imageCover);
    }
    if(image1){
      form.append('images', image1);
    }
    if(image2){
      form.append('images', image2);
    }
    if(image3){
      form.append('images', image3);
    }
    if(secretTour){
    form.append('secretTour', secretTour);
    }
    if(document.getElementById('descriptionT').value){
    form.append('description', document.getElementById('descriptionT').value);
    }
    for(var i=0;i<selectedGuides.length;i++){
      form.append('guides['+i+']', selectedGuides[i]);
    }
    editTour(form,id);
    id=null;
  })
}
if(deleteTourForm){
  deleteTourForm.addEventListener('submit',event=>{
    event.preventDefault();
    deleteTour(id);
  })
}
if(userForm){
  userForm.addEventListener('submit',event=>{
    event.preventDefault();
    const selectElement = document.getElementById('roleUE');
const selectedRole = selectElement.options[selectElement.selectedIndex].value;
console.log(selectedRole)
    editUser(selectedRole,id);
    id=null;
  })
}
if(deleteUserForm){
  deleteUserForm.addEventListener('submit',event=>{
    event.preventDefault();
deleteUser(id);
id=null;
  })
}
if(deleteReviewForm){
deleteReviewForm.addEventListener('submit',event=>{
  event.preventDefault();
  console.log(id);
  deleteAdminReview(id);
})
}
if(document.getElementById('deleteAcc')){
document.getElementById('deleteAcc').addEventListener('click',event=>{
  event.preventDefault();
deleteYourself()
})
}
if(myEditReview){
  myEditReview.addEventListener('click',event=>{
    event.preventDefault();
    const placeholderValue = document.getElementById("myInput").value;

    // Get the value of the selected radio button
    let ratingValue;
    const radios = document.getElementsByName('rate');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            ratingValue = radios[i].value;
            break;
        }
    }
     editReview(id,placeholderValue,ratingValue);
  })
}
if(myDeleteReview){
  myDeleteReview.addEventListener('click',event=>{
    event.preventDefault();
    deleteReview(id);
  })
}

const btn = document.querySelector("button");
const post = document.querySelector(".post");
const widget = document.querySelector(".star-widget");
const editBtn = document.querySelector(".edit");
if(btn){
btn.onclick = ()=>{
  widget.style.display = "none";
  post.style.display = "block";
  editBtn.onclick = ()=>{
    widget.style.display = "block";
    post.style.display = "none";
  }
  return false;
}
}