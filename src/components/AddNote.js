import React, { useContext, useState } from "react";
import NoteContext from "../context/note/NoteContext";

export default function AddNote(props) {
    const context = useContext(NoteContext);
    const { addNote } = context;

    const [note, setNote] = useState({
        title: "",
        description: "",
        tag: "General",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({
            title: "",
            description: "",
            tag: "General",
        });
        props.adjustAlert("Note added successfully", "success");
    };
    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };
    return (
        <>
            <h3>Add Note</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        Title
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        aria-describedby="emailHelp"
                        value={note.title}
                        onChange={onChange}
                        minLength={3}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        Description
                    </label>
                    <textarea
                        type="text"
                        className="form-control"
                        id="description"
                        name="description"
                        value={note.description}
                        onChange={onChange}
                        rows={3}
                        minLength={5}
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">
                        Tag
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="tag"
                        name="tag"
                        value={note.tag}
                        onChange={onChange}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                        note.title.length < 1 || note.description.length < 1
                    }
                >
                    Add It
                </button>
            </form>
        </>
    );
}
