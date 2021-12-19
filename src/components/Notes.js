import React, { useContext, useEffect, useRef, useState } from "react";
import NoteContext from "../context/note/NoteContext";
import NoteItem from "./NoteItem";
import { useNavigate } from "react-router-dom"; // useHistory() changed to useNavigate In react router v6

export default function Notes(props) {
    const context = useContext(NoteContext);
    const { notes, getNote, editNote } = context;
    const ref = useRef(null);
    const refClose = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) getNote();
        else navigate("/login");
        // eslint-disable-next-line
    }, []);

    //  Updating the Notes
    const [note, setNote] = useState({
        id: "",
        etitle: "",
        edescription: "",
        etag: "",
    });
    const handleUpdateClick = () => {
        refClose.current.click();
        editNote(note.id, note.etitle, note.edescription, note.etag);
        props.adjustAlert("Updated successfully", "success");
    };
    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };

    //  Notes update modal box
    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({
            id: currentNote._id,
            etitle: currentNote.title,
            edescription: currentNote.description,
            etag: currentNote.tag,
        });
    };
    return (
        <>
            <button
                type="button"
                className="d-none"
                data-bs-toggle="modal"
                data-bs-target="#editModal"
                ref={ref}
            >
                No text
            </button>
            {/* Modal Box for Update/Edit */}
            <div
                className="modal fade"
                id="editModal"
                tabIndex="-1"
                aria-labelledby="editModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editModalLabel">
                                Edit Note
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>

                        {/* Modal body for note update */}
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label
                                        htmlFor="etitle"
                                        className="form-label"
                                    >
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="etitle"
                                        name="etitle"
                                        aria-describedby="emailHelp"
                                        onChange={onChange}
                                        value={note.etitle}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="edescription"
                                        className="form-label"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        id="edescription"
                                        name="edescription"
                                        onChange={onChange}
                                        value={note.edescription}
                                        rows={4}
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="etag"
                                        className="form-label"
                                    >
                                        Tag
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="etag"
                                        name="etag"
                                        onChange={onChange}
                                        value={note.etag}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                ref={refClose}
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                disabled={
                                    note.etitle.length < 3 ||
                                    note.edescription.length < 5
                                }
                                onClick={handleUpdateClick}
                            >
                                Update Note
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal box end */}

            <div className="row my-3">
                <h3 className="mb-3 mt-2">Your Notes</h3>
                <div className="container ms-2">
                    {notes.length === 0 && "No Notes to dsiplay"}
                </div>
                {notes.map((note) => {
                    return (
                        <NoteItem
                            key={note._id}
                            updateNote={updateNote}
                            note={note}
                            adjustAlert={props.adjustAlert}
                        />
                    );
                })}
            </div>
        </>
    );
}
