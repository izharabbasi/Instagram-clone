import React, { useEffect, useState } from "react";
import Post from "./Post";
import { db, auth, storage } from "./firebase";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from "@material-ui/core";
import "./App.css";
import ImageUpload from "./ImageUpload.js";



function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [isSignIn, setSignIn] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unscribed =  auth.onAuthStateChanged((authUser) => {
      if (authUser){
        // user has logged in
        console.log(authUser);
        setUser(authUser)

      } else {
        // user has logged out
        setUser(null)
      }
    })
    return () => {
      unscribed();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection("posts").orderBy('timestamp','desc' ).onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
      );
    });
  }, []);

  function signUp(e){
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName : username
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);
  }

  function signIp(e){
    e.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));

    setSignIn(false);
  }

  return (
    <div className="App">
   

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app_headerImage"
                alt="instalogo"
                src="https://icons-for-free.com/iconfiles/png/512/instagram+icon+instagram+logo+logo+icon-1320184050987950067.png"
                width="150px"
                height="100px"
              />
              <br/>
              <Input 
                type="text"
                placeholder="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <Input 
                type="email"
                placeholder="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Input 
                type="password"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <br/>
              <br/>
              <Button type="submit" onClick={signUp}>Sign Up</Button>
            </center>
          </form>
        </div>
      </Modal>

      <Modal
        open={isSignIn}
        onClose={() => isSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signin">
            <center>
              <img
                className="app_headerImage"
                alt="instalogo"
                src="https://icons-for-free.com/iconfiles/png/512/instagram+icon+instagram+logo+logo+icon-1320184050987950067.png"
                width="150px"
                height="100px"
              />
              <br/>
              <Input 
                type="email"
                placeholder="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Input 
                type="password"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <br/>
              <br/>
              <Button type="submit" onClick={signIp}>Sign In</Button>
            </center>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app_headerImage"
          alt="instalogo"
          src="https://logos-world.net/wp-content/uploads/2020/04/Instagram-Logo.png"
          width="150px"
          height="100px"
        />
        {user ? (<Button onClick={() => auth.signOut()}>Log Out</Button>)
          : (
        <div className="app__loginContainer">
          <Button onClick={() => setSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button>
        </div>
        )
      }
      </div>
      
      

      <div className="app__posts">
      {posts.map(({id, post}) => (
        <Post
          key={id}
          postId={id}
          user={user}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />
      ))}
      </div>
      
      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>):
        ( <h3>Sorry you need to login to upload</h3>
    )}
    

    </div>
  );
}

export default App;
