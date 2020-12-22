import React, { useState, useEffect } from 'react'
import "./Post.css";
import {Avatar, Button, Input} from '@material-ui/core';
import {db} from "./firebase"
import firebase from "firebase";

function Post({user, postId ,username , caption, imageUrl}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if(postId) {
            unsubscribe = db.collection('posts')
            .doc(postId).collection("comments")
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()))
            })
        }
        return () => {
            unsubscribe();
        };
    }, [postId]);

    const postComment = (e) => {
        e.preventDefault();

        db.collection('posts').doc(postId).collection('comments').add({
            text : comment,
            username: user.displayName,
            timestamp : firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('')
    }



    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" alt="username" src="/static/images/avatar/1.png" />
                <h3>{username}</h3>
            </div>

            {/* image */}
            <img className="post__image" src={imageUrl} alt='react'/>

            {/* {username : caption} */}
            <h4 className="post__text"><strong>{username} </strong>{caption}</h4>



            <div className="post__comments">
                {comments.map(comment => (
                <p>
                    <strong>{comment.username}</strong> : {comment.text}
                </p>
                ))
                }
            </div>
            
            {user && (
                <form className="post__commentBox">
                <Input 
                    className="post__input"
                    type="text"
                    placeholder="Enter comment here..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />
                <Button 
                    className="post__button"
                    disabled={!comment}
                    type="submit"
                    onClick={postComment}
                    >
                    Post
                </Button>
            </form>
            )}    
            
        </div>
    )
}

export default Post