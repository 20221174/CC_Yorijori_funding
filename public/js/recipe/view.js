document.querySelectorAll('.recipe-card').forEach(card => {
    card.addEventListener('click', function(event) {
        const postId = this.getAttribute('data-post-id');
        
        fetch('/posts/view', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, postId })

        }).then(response => response.json())
          .then(data => {
              if (data.success) {
                  console.log('View count incremented');
              } else {
                console.log('Error incrementing view count');
              }
          }).catch(error => {
              console.error('Error:', error);
          });
    });
});