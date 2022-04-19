import React, { useRef, useState } from "react";
import "./App.css";
// fix from: https://stackoverflow.com/questions/68929593/vue-2-export-default-imported-as-firebase-was-not-found-in-firebase-app
import firebase from "firebase/compat/app";
import "firebase/compat/firestore"; // database
import "firebase/compat/auth"; // authentication

/* hooks */
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

// initializing application from firebase
firebase.initializeApp({
    apiKey: "AIzaSyDuYg-g2tnVebWpvF2UCylmfyMLHQumRVc",
    authDomain: "superchat-f2333.firebaseapp.com",
    projectId: "superchat-f2333",
    storageBucket: "superchat-f2333.appspot.com",
    messagingSenderId: "936355109258",
    appId: "1:936355109258:web:97a1317d97c81c83f61073",
});

const auth = firebase.auth();
const db = firebase.firestore();

/**
 * Main
 * @returns main component
 */
function App() {
    const [user] = useAuthState(auth);

    // shows chatroom if user is signed-in (object) otherwise shows sign-in button (user === null)
    return (
        <div className="App">
            <header className="App-header">
                <SignOut />
            </header>
            <section>{user ? <ChatRoom /> : <SignIn />}</section>
        </div>
    );
}

/**
 * Sign-in page
 * @returns Sign-in page
 */
function SignIn() {
    const signInWithGoogle = () => {
        // auth property from firebase not the auth() function
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    };

    return (
        <button onClick={signInWithGoogle}>
            Sign in with Google
        </button>
    );
}

/**
 * Sign out function
 */
function SignOut() {
    return (
        auth.currentUser && (
            <button onClick={() => auth.signOut()}>Sign Out</button>
        )
    );
}

/**
 * ChatRoom
 */
function ChatRoom() {
    // reference below the message list
    const dummy = useRef();
    // reference to the firestore messages database
    const messagesRef = db.collection("messages");
    // query ordered by timestamp
    const query = messagesRef.orderBy("createdAt").limit(25);
    // list of messages from query of db
    const [messages] = useCollectionData(query, { idField: "id" });
    // a way to send message
    const [formValue, setFormValue] = useState("");

    /**
     * Sends the text message
     * @param {SyntheticBaseEvent} e submit form event from submitting text message
     */
    const sendMessage = async (e) => {
        // prevent submitting form from refreshing page and putting data on search bar
        e.preventDefault();
        // destructuring current user
        const { uid, photoURL } = auth.currentUser;

        await messagesRef.add({
            text: formValue,
            createdAt:
                firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL,
        });
        // reset input field
        setFormValue("");
        // scroll to the most recent message
        dummy.current.scrollIntoView({ behavior: "smooth" });
    };
    // message list, dummy reference below message list, input field + submit to send
    return (
        <>
            <main>
                {messages &&
                    messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}
                <div ref={dummy}></div>
            </main>
            <form onSubmit={sendMessage}>
                <input
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder="say something nice"
                />
                <button type="submit">🐦</button>
            </form>
        </>
    );
}

function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;

    const messageClass =
        uid === auth.currentUser.uid ? "sent" : "received";

    return (
        <div className={`message ${messageClass}`}>
            <img src={photoURL} alt="photo" />
            <p>{text}</p>
        </div>
    );
}

export default App;
