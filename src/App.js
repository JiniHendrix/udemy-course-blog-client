import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState([])
  const [comments, setComments] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:3001/posts')
        const posts = await res.json()
        setPosts(posts)
        
        const comments = await Promise.all(Object.values(posts).map(post => fetch(`http://localhost:3002/posts/${post.id}/comments`)))
        setComments(comments)
      } catch (e) {
        console.log(e)
      }
    })()
  }, [])

  const onSubmitPost = (e) => {
    e.preventDefault()

    fetch('http://localhost:3001/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title
      })
    })
  }

  return (
    <div className="App">
      <div className="create-post">
        <h1 className="create-post__header">Create Post</h1>
        <form onSubmit={onSubmitPost}>
          <label className="create-post__label" htmlFor="title">title
            <input onChange={(e) => {setTitle(e.currentTarget.value)}} className="create-post__input" type="text"></input>
            <button className="create-post__submit" type="submit">Submit</button>
          </label>
        </form>
      </div>
      {Object.values(posts).map(post => <div>{post.title}</div>)}
      {comments.map(comment => <div>{comment.content}</div>)}
    </div>
  );
}

export default App;
