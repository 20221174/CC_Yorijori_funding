const btnOk=document.querySelector('.btn-ok');
const btnNo=document.querySelector('.btn-no');
const erase = document.querySelector('.erase');
const er = document.querySelector('.er');
const inputElement = document.querySelector('.comment-place');
const commentBt = document.querySelector('.comment-bt');
const dok = document.querySelector('.dok');
const co = document.querySelector('.co');
const modal_body2 = document.querySelector('.modal_body2')
let i = 0; 
document.addEventListener("DOMContentLoaded", () => {
    // Bookmark 기능
    const bookmarkDiv = document.getElementById("bookmark");
    bookmarkDiv.addEventListener("click", () => {
        const icon = bookmarkDiv.querySelector("i");
        if (icon.classList.contains("fa-regular")) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
        } else if (icon.classList.contains("fa-solid")) {
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");
        }
    });

    // Ellipsis 기능
    const ellipsisIcon = document.getElementById("ellipsis");
    const buttons = document.getElementById("buttons");

    ellipsisIcon.addEventListener("click", () => {
        if (buttons.style.display === "none" || buttons.style.display === "") {
            buttons.style.display = "block"; // 버튼 보이기
        } else {
            buttons.style.display = "none"; // 버튼 숨기기
        }
    });


});
btnOk.addEventListener("click" , ()=>{window.location.href = "../html/communitypage.html";});
erase.addEventListener("click", ()=>{modal.style.display = 'flex';  });

// 모달 표시 함수
function eraseModal(commentId) {
    // 모달 요소 가져오기
    var modal = document.querySelector(`#modal-${commentId}`);
    // 모달 표시
    modal.style.display = 'flex';
}

//모달표시2 

function eraseModal2() {
    var modal2 = document.querySelector('.modal2');
    modal2.style.display ='flex';
}

function cancellation(commentId) {
    var modal = document.querySelector(`#modal-${commentId}`);
    delete modal.dataset.commentId;
    modal.style.display = 'none';
}


//post삭제취소
function cancellation2() {
    var modal = document.querySelector(`.modal2`);
    modal.style.display = 'none';
}



function checkInput() {
    if (inputElement.value == '') {
        alert('입력란이 비어있습니다!');
    }
};

function checkInput2(commentId){
    const comSu = document.querySelector(`#comm-${commentId}`);
    if(comSu.value ==''){
        alert('입력란이 비어있습니다!');
        return 1; 
    }
    else 
    return 0; 
};

commentBt.addEventListener("click", checkInput);

function openEditForm(commentId) {
    // commentId를 사용하여 해당 댓글의 수정 창을 표시
    const editForm = document.querySelector(`#editForm-${commentId}`);
    const alt = document.querySelector(`#alt-${commentId}`);
    const h = document.querySelector(`#h-${commentId}`);
    const correction = document.querySelector(`#correction-${commentId}`);
    correction.style.display ="none";
    editForm.style.display = 'flex';
    h.style.display="none";
    alt.style.display="none";
  
}

document.querySelector(".hak").addEventListener("click", function() {
    const commentId = '<%= commentId %>';
    checkHak(commentId);
  });

//확인시 값 들어가있는지 체크 
function checkHak(commentId){
    const editForm = document.querySelector(`#editForm-${commentId}`);
    const alt = document.querySelector(`#alt-${commentId}`);
    const h = document.querySelector(`#h-${commentId}`);
    let result = checkInput2(commentId);
    if(result == 1){
        editForm.style.display ="flex";
       
    }
    else{
        editForm.style.display = "none";
        h.style.display = "none";
        alt.style.display = "flex";

    }
};

dok.addEventListener("click",()=>{
    if(i==0){
    co.style.display="block";
    i ++; 
    }
    else{
    co.style.display="none";
    i=0; 
    }
});

function checkLogin(LoginuserId) {
    // 로그인 여부 확인
    if (LoginuserId == -1) {
      // 로그인되지 않은 경우
      alert('로그인이 필요합니다!');
      return false; // 폼 제출 중지
    } else {
      // 로그인된 경우 폼 제출
      document.getElementById('commentForm').submit();
    }
  }
  
