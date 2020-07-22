import React, {
  useState
} from "react";
import {
  Button
} from "@material-ui/core";
import {
  db,
  storage
} from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";
// import "./firebase";

function Imageupload({
  username
}) {
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState("");

  const handleChange = e => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      snapshot => {
        //progress bar functoning...
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progress);
      },
      error => {
        // Error function
        console.log(error);
        alert(error.message);
      },
      () => {
        //complete function....

        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            //post image inside the db
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username
            });
            setProgress(0);
            setCaption("");
            setImage();
          });
      }
    );
  };

  return (<div className="imageUpload" >
    <progress className="image__Upload" value={progress} max="100" />
    <input type="text"
      placeholder="Enter a cption...."
      onChange={
        e => setCaption(e.target.value)
      }
    />
    <input type="file"
      onChange={
        handleChange
      }
    /> <Button className=""
      onClick={
        handleUpload
      } >
      Upload </Button>
  </div>
  );
}

export default Imageupload;