import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { db, storage} from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";


function ImageUpload({username}) {
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null);
    const [progress, setPregress] = useState(0);

    function handeChange(e) {
        if (e.target.files[0]){
            setImage(e.target.files[0])
        }
    }


    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image)

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function...
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) *100);
                setPregress(progress);
            },
            (error) => {
                // Error function...
                console.log(error);
                alert(error.message)
            },
            () => {
                //complete function...
                storage.ref('images').child(image.name).getDownloadURL()
                .then(url => {
                    //post image inside db...
                    db.collection('posts').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption : caption,
                        imageUrl: url,
                        username : username
                    });
                    setCaption('');
                    setImage(null);
                    setPregress(0);
                })
            }

        )
    }


    return (
        <div className="imageUpload">
            <progress className="imageUpload__progress" value={progress} max="100"/>
            <input type="text" placeholder="Enter Comment..." value={caption} onChange={e => setCaption(e.target.value)}/>
            <input type="file" onChange={handeChange}/>
            <Button disabled={!caption} onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
