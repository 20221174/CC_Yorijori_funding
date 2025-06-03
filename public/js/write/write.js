let clickbtNum = 0; 
//재료검색 get 요청 client
$(document).ready(function() {  //브라우저 파싱, dom트리 생성전 시작방지 function({})로 축약가능
    $('.search-button').on('click', function(event) { //검색버튼 클릭시 이벤트 헨들러 작동
        let searchIngredient = $('#search-input').val();
            $.ajax({ //ajax 통한 서버통신
                url: '/write/getIngredients',
                type: 'GET',
                data: {searchIngredient: searchIngredient },
                success: function(data) { //success 시 데이터 받아옴
                    var resultsDiv = $('#results');
                    var resultIngredi =$('.resultIngredi');
                    if (data.ingredients && data.ingredients.length > 0) {
                            var ingredientElement = $('<div class="result-item" name="resultIngredien"></div>')
                                .text(data.ingredients[0].ingredientName)
                            resultsDiv.append(ingredientElement);
                            let hiddenIngredient = $('<input type="hidden" name="ingredi">')
                                .val(data.ingredients[0].ingredientName)
                                resultIngredi.append(hiddenIngredient);

                    } else {
                        alert('No ingredients found for "' + searchIngredient + '".');
                    }
                },
                error: function(error) {
                    console.error('Error:', error);
                }
            });
        }
    );
//메뉴검색 get 요청 client
 $('.search-Menu-button').on('click',function(event) {
        if(clickbtNum==0){
            clickbtNum++;
        let searchMenu = $('#search-menu').val();
        $.ajax({
            url:'../write/getMenu',
            type:'GET',
            data:{searchMenu : searchMenu},
            success:function(data){
               console.log(data);
              $('.result-menu').empty();
                if(data.selectMenu[0].menuName == searchMenu){
                    $('#search-menu').css("display","none");
                   let resultMenu = $('.result-menu');
                   resultMenu.css({"display": "block",
                        "width": "650px"});
                   resultMenu.append(data.selectMenu[0].menuName);
                }
                else{
                   alert("해당 메뉴가 없습니다.")
                }
            },
            error: function(error){
                console.log('error:',error);
            }
         });
        }
        else {
            clickbtNum--;
            $('#search-menu').css("display","block");
            $('.result-menu').css("display","none");
        }
      }
    )
    //썸머노트 설정
    $('#summernote').summernote({ 
      placeholder: '내용',
      tabsize: 2,
      focus: true,
      height: 400,
      width: 850,
      callbacks:
        {
            onImageUpload: function(files){
                for (let i = 0; i < files.length; i++) {
                    sendFile(files[i], this);
                }
            }   
        }
    }); 
});


  function sendFile(file, editor){
    data = new FormData()
    data.append("img", file)
    // id 'img'로 file form 데이터 추가
    $.ajax({
      data: data,
      type: "POST",
      // 이미지 처리를 할 url
      url: "write/postImage",
      cache: false,
      contentType: false,
      enctype: "multipart/form-data",
      processData: false,
      success: function (response) {
        console.log(response.url);
        var imgurl = $('<img>').attr({
          'src': response.url,
          'name': 'img',
          // json형태로 반환되는 주소.
          'crossorigin': 'anonymous',
          // crossorigin attr을 삽입하지 않으면 CORS에러가 난다!
      });
        $("#summernote").summernote("insertNode", imgurl[0]);
        // insertNode는 html tag <img>를 summernote 내부에 삽입해주는 기능.
      },
    })
  }
 
