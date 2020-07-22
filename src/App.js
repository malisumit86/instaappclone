import React, { useState, useEffect } from "react";
// import logo from './logo.svg';
import "./App.css";
import Post from "./Post";
import { db } from "./firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Input } from "@material-ui/core";
import { auth } from "./firebase";
import Imageupload from "./ImageUpload";
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: 250,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalStyle] = React.useState(getModalStyle);
  const [user, setUser] = useState(null);

  useEffect(
    () => {
      const unsubscribe = auth.onAuthStateChanged(authUser => {
        if (authUser) {
          //user logged in..
          console.log(authUser);
          setUser(authUser);
        } else {
          //user logged out..
          setUser(null);
        }
      });
      return () => {
        //performs the some clean up action
        unsubscribe();
      };
    },
    [user, username]
  );

  //useEffect -> Runs a piece of code based on specific condition

  useEffect(() => {
    //this is wwhere the code runs
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        //every time where new post added, add this code to firebase ...
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, post: doc.data() })));
      });
  }, []);

  const signUp = e => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        return authUser.user.updateProfile({
          displayName: username
        });
      })
      .catch(error => alert(error.message));
    setOpen(false);
  };

  const signIn = e => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch(error => alert(error.message));
    setOpenSignIn(false);
  };

  return (
    <>
      <div className="App">
        <Modal open={open} onClose={() => setOpen(false)}>
          <div style={modalStyle} className={classes.paper}>
            {/* body design modal */}
            <form className="app__signup">
              <center>
                <img
                  className="app__headerImage"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
                  alt="inta__logo"
                />
              </center>
              <Input placeholder="username" type="text" value={username} onChange={e => setUsername(e.target.value)} />
              <Input placeholder="Email" type="text" value={email} onChange={e => setEmail(e.target.value)} />
              <Input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

              <Button type="submit" onClick={signUp}>
                Sign Up
            </Button>
            </form>
          </div>
        </Modal>

        <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
          <div style={modalStyle} className={classes.paper}>
            {/* body design modal */}
            <form className="app__signup">
              <center>
                <img
                  className="app__headerImage"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
                  alt="inta__logo"
                />
              </center>

              <Input placeholder="Email" type="text" value={email} onChange={e => setEmail(e.target.value)} />
              <Input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

              <Button type="submit" onClick={signIn}>
                Sign In
            </Button>
            </form>
          </div>
        </Modal>

        <div className="app__header">
          <img
            className="app__headerImage"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
            alt="inta__logo"
          />
          {user ? (
            <Button onClick={() => auth.signOut()}> log out</Button>
          ) : (
              <div className="app__loginContainer">
                <Button onClick={() => setOpenSignIn(true)}> Sign In</Button>
                <Button onClick={() => setOpen(true)}> Sign Up</Button>
              </div>
            )}
        </div>




        <div className="app__posts">
          <div className="app__postsLeft">
            {posts.map(({ id, post }) => (
              <Post key={id} postId={id} user={user} username={post.username} imageUrl={post.imageUrl} caption={post.caption} />
            ))}

            {user?.displayName ? <Imageupload username={user.displayName} /> : <h3>sorry you have to log in first </h3>}

          </div>
          <div className="app_postsRight">
            <InstagramEmbed
              url='https://www.instagram.com/p/B_uf9dmAGPw/'
              // url='https://www.instagram.com/p/Bv8jKzpFJc3cHgYYweTsuhsmybCGdWrUTQ6KkE0/'
              maxWidth={320}
              hideCaption={false}
              containerTagName='div'
              protocol=''
              injectScript
              onLoading={() => { }}
              onSuccess={() => { }}
              onAfterRender={() => { }}
              onFailure={() => { }}
            />
          </div>
        </div>
      </div>





    </>
  );
}

export default App;
