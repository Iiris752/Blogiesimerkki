
//määritetään URL, josta blogipostaukset löytyy:
const postsURL = 'http://localhost:4000/posts';

//haetaan postaukset fetchillä, käydään läpi ja lisätään DOMiin
//haetaan myös kommentit
function fetchPosts() {
    fetch(postsURL)
        .then(res => res.json())
        .then(posts => {
            const postList = document.getElementById('posts');
            postList.innerHTML = '';
            posts.forEach(post => {
                const div = document.createElement('div');
                div.className = 'post';
                div.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.text}</p>
                    <button class="deletePBtn" onclick="deletePost(${post.postID})">Poista postaus</button>
                    
                    <h4>Kommentit:</h4>
                    <ul>
                        ${(post.comments || [])
                            .map(comment => `
                                <li>
                                    <small>${comment.timestamp}</small> - ${comment.text}
                                    <button class="deleteCBtn" onclick="deleteComment(${post.postID}, ${comment.commentID})">Poista kommentti</button>
                                </li>`)
                            .join('')}
                    </ul>
                    <input type="text" id="comment-${post.postID}" placeholder="Lisää kommentti">
                    <button class="commentBtn" onclick="addComment(${post.postID})">Kommentoi</button>
                `;
                postList.appendChild(div);
            });
        })
        .catch(err => console.error('Fetch error!', err));
}

//uuden kommentin lisääminen:
function addComment(postID){
    const input = document.getElementById(`comment-${postID}`);
    const text = input.value;
    if(!text) return alert('Kirjoita kommentti');
    fetch(`${postsURL}/${postID}/comments`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({text})
    })
    .then(() =>{
        fetchPosts();
        input.value='';
    });
}

//Kommentin poisto:
function deleteComment(postID, commentID) {
    fetch(`${postsURL}/${postID}/comments/${commentID}`, {
        method: 'DELETE'
    })
    .then(() => fetchPosts());
}

//postauksen poisto:
function deletePost(postID) {
    fetch(`${postsURL}/${postID}`,{
        method: 'DELETE'
    })
    .then(() => fetchPosts());
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
    .then(() =>{
        fetchPosts();
        document.getElementById('title').value = '';
        document.getElementById('text').value = '';
    })
}
// Näytetään postaukset heti, ilman että sivua täytyy päivittää
fetchPosts();
