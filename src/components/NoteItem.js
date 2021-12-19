import React, { useContext } from "react";
import NoteContext from "../context/note/NoteContext";

export default function NoteItem(props) {
    const { note, updateNote, adjustAlert } = props;
    const context = useContext(NoteContext);
    const { deleteNote } = context;
    return (
        <div className="col-md-6">
            <div className="card my-3">
                <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                        <h5 className="card-title mb-0"> {note.title}</h5>
                        <div className="ms-auto d-flex">
                            <i
                                className="fas fa-trash-alt mx-2"
                                onClick={() => {
                                    deleteNote(note._id);
                                    adjustAlert("Note deleted!", "success");
                                }}
                            ></i>
                            <i
                                className="fas fa-edit mx-2"
                                onClick={() => {
                                    updateNote(note);
                                }}
                            ></i>
                        </div>
                    </div>
                    <p className="card-text">{note.description}</p>
                </div>
            </div>
        </div>
    );
}
