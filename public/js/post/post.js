$(document).ready(function() {
    $('.post-link').click(function(event) {
        event.preventDefault(); // 기본 이벤트 실행 방지

        var postId = $(this).attr('href').split('postId=')[1]; 
        console.log('게시물 ID:', postId);
        
        // AJAX 요청
        $.ajax({
            type: 'POST', // 또는 'GET' 등 요청 방식 설정
            url: '/write/increaseViews', // 조회수 증가 처리를 하는 서버의 URL
            data: { postId: postId }, // 게시글 ID를 서버에 전달
            success: function(response) {
                // 성공적으로 서버로부터 응답을 받은 경우에 실행되는 코드
                console.log('조회수가 증가되었습니다.');
                // 여기서 필요한 UI 업데이트 로직을 추가합니다.
            },
            error: function(xhr, status, error) {
                // AJAX 요청이 실패한 경우에 실행되는 코드
                console.error('조회수 증가 요청에 실패했습니다:', error);
            }
        });
    });
});
