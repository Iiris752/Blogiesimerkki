const apiUrl = 'http://localhost:3000/posts';

function fetchPosts() {
    fetch(apiUrl)
        .then(res => res.json())
        .then(posts => {
            const container = document.getElementById('posts');
            container.innerHTML = '';
            posts.forEach(post => {
                const div = document.createElement('div');
                div.className = 'post';
                div.innerHTML = `<h3>${post.title}</h3><p>${post.content}</p>`;
                container.appendChild(div);
            });
        })
        .catch(err => console.error('Fetch error:', err));
}

function addPost() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    if (!title || !content) return alert('Täytä molemmat kentät');

    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    })
    .then(() => {
        fetchPosts();
        document.getElementById('title').value = '';
        document.getElementById('content').value = '';
    });
}

// Lataa postaukset heti sivun avauksessa
fetchPosts();
