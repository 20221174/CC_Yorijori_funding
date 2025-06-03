// public/js/recipe/bookmark.js

const userId = document.getElementById('userId').value;

function saveBookmark(postId) {
    if (userId == 16) {
        alert('로그인이 필요합니다.');
        window.location.href = '/auth/login'; // 로그인 페이지 URL로 변경
        return;
    }

    const button = document.getElementById('btn-' + postId);
    const isSaved = button.classList.contains('bookmark-saved');
    const url = isSaved ? '/posts/unsave' : '/posts/save';
    const method = isSaved ? 'POST' : 'POST'; // 모두 POST 메서드 사용

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, postId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (isSaved) {
                button.classList.remove('bookmark-saved');
                button.classList.add('bookmark-not-saved');
            } else {
                button.classList.remove('bookmark-not-saved');
                button.classList.add('bookmark-saved');
            }
        } else {
            alert('Failed to save the recipe.');
        }
    })
    .catch((error) => {
        alert(error);
        console.error('Error:', error);
    });
}