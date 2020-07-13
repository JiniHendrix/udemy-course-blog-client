import React, { useEffect, useState } from 'react';
import './App.css';

const Post = ({ post }) => {
  const [comment, setComment] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    fetch(`http://localhost:4001/posts/${post.id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: comment
      })
    })
  }

  return (
    <div className="post">
      <h2 className="post__header">{post.title}</h2>
      <div className="post__comment-count">{post.comments.length} comments</div>
      <ul className="post__comments-list">
        {post.comments.map(comment => <div className="post__comment">{comment.content}</div>)}
      </ul>
      <div className="post__comment-form">
        <form onSubmit={onSubmit}>
          <label htmlFor="comment-input">
            <input onChange={e => setComment(e.currentTarget.value)} type="text"></input>
          </label>
          <input type="submit" value='Submit'></input>
        </form>
      </div>
    </div>
  )
}

function App() {
  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:4000/posts')
        const posts = await res.json()
        
        await Promise.all(Object.values(posts).map(post => fetch(`http://localhost:4001/posts/${post.id}/comments`)
          .then(res => res.json())
          .then(comments => {
            console.log(comments)
            posts[post.id].comments = comments || []
          })
          .catch(e => console.error(e))
        ))
        setPosts(posts)
      } catch (e) {
        console.log(e)
      }
    })()
  }, [])

  const onSubmitPost = (e) => {
    e.preventDefault()

    fetch('http://localhost:4000/posts', {
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
      {Object.values(posts).map(post => <Post post={post} />)}
    </div>
  );
}

export default App;
