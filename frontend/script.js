//määritetään URL, josta blogipostaukset löytyy:
const postsURL = 'http://localhost:4000/posts';

//haetaan postaukset fetchillä, käydään läpi ja lisätään DOMiin
function fetchPosts() {
    fetch(postsURL)
        .then(res => res.json())
        .then(posts => {
            const postList = document.getElementById('posts');
            postList.innerHTML = '';
            posts.forEach(post => {
                const div = document.createElement('div');
                div.className = 'post';
                div.innerHTML = `<h3>${post.title}</h3><p>${post.text}</p>`;
                postList.appendChild(div);
            });
        })
        .catch(err => console.error('Fetch error!', err));
}

//päivitetään uusi postaus serverille
function addPost() {
    const title = document.getElementById('title').value;
    const text = document.getElementById('text').value;
    if(!title || !text) return alert('täytä oikein molemmat kentät');

    fetch(postsURL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title,text})
    })
    .then(()=>{
        fetchPosts();
        document.getElementById('title').value = '';
        document.getElementById('text').value = '';
    })
}
// Näytetään postaukset heti, ilman että sivua täytyy päivittää
fetchPosts();