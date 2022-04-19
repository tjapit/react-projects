import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { data } from "./data";
import Split from "react-split";
import { nanoid } from "nanoid";
import "./styles.css";

function App() {
    // Lazy state initialization (so it doesn't reload notes from localStorage each time App() is re-rendered)
    const [notes, setNotes] = React.useState(
        () => JSON.parse(localStorage.getItem("notes")) || []
    );
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    );

    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here",
        };
        setNotes((prevNotes) => [newNote, ...prevNotes]);
        setCurrentNoteId(newNote.id);
    }

    /**
     * Challenge: complete and implement the deleteNote function
     *
     * Hints:
     * 1. What array method can be used to return a new
     *    array that has filtered out an item based
     *    on a condition?
     * 2. Notice the parameters being based to the function
     *    and think about how both of those parameters
     *    can be passed in during the onClick event handler
     */
    function deleteNote(event, noteId) {
        event.stopPropagation(); // stops the click from propagating to the parent-el (i.e. the selected note)
        setNotes((oldNotes) =>
            oldNotes.filter((oldNote) => oldNote.id !== noteId)
        );
    }

    /**
     * Challenge: When the user edits a note, reposition
     * it in the list of notes to the top of the list
     */
    function updateNote(text) {
        setNotes((oldNotes) =>
            oldNotes
                .map((oldNote) => {
                    return oldNote.id === currentNoteId
                        ? { ...oldNote, body: text }
                        : oldNote;
                })
                .sort((note1, note2) =>
                    note1.id === currentNoteId
                        ? -1
                        : note2.id === currentNoteId
                        ? 1
                        : 0
                )
        );
    }

    function findCurrentNote() {
        return (
            notes.find((note) => {
                return note.id === currentNoteId;
            }) || notes[0]
        );
    }

    /**
     * Challenge:
     * 1. Every time the `notes` array changes, save it
     *    in localStorage. You'll need to use JSON.stringify()
     *    to turn the array into a string to save in localStorage.
     * 2. When the app first loads, initialize the notes state
     *    with the notes saved in localStorage. You'll need to
     *    use JSON.parse() to turn the stringified array back
     *    into a real JS array.
     */
    React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));
    }, [notes]);

    return (
        <main>
            {notes.length > 0 ? (
                <Split sizes={[30, 70]} className="split">
                    <Sidebar
                        notes={notes}
                        currentNote={findCurrentNote()}
                        setCurrentNoteId={setCurrentNoteId}
                        newNote={createNewNote}
                        deleteNote={deleteNote}
                    />
                    {currentNoteId && notes.length > 0 && (
                        <Editor
                            currentNote={findCurrentNote()}
                            updateNote={updateNote}
                        />
                    )}
                </Split>
            ) : (
                <div className="no-notes">
                    <h1>You have no notes</h1>
                    <button
                        className="first-note"
                        onClick={createNewNote}
                    >
                        Create one now
                    </button>
                </div>
            )}
        </main>
    );
}

export default App;
