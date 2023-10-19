const modal = document.querySelector(".modal-overlay");
// const editbtnModal=document.querySelector('#edit-tour');
const editModal=document.querySelector('.modal-overlay-edit');
const deleteModal=document.querySelector('.modal-overlay-delete');
export function openModal() {
    modal.classList.remove("hide");
}
export function closeModal(e, clickedOutside) {
    if (clickedOutside) {
        if (e.target.classList.contains("modal-overlay"))
            modal.classList.add("hide");
    } else modal.classList.add("hide");
}
 

export function openEditModal(){
  console.log("TEST");
  editModal.classList.remove('hide');
}
 export function closeEditModal(e, clickedOutside){
  if (clickedOutside) {
    if (e.target.classList.contains("modal-overlay-edit"))
        editModal.classList.add("hide");
} else editModal.classList.add("hide");
 }
 export function openDeleteModal(){
    console.log("TEST");
    deleteModal.classList.remove('hide');
  }
   export function closeDeleteModal(e, clickedOutside){
    if (clickedOutside) {
      if (e.target.classList.contains("modal-overlay-delete"))
          deleteModal.classList.add("hide");
  } else deleteModal.classList.add("hide");
   }
  