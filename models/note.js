const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    articleID: Number,
    comment: String,
});

const Note = mongoose.model("Note", NoteSchema);

module.export = Note;