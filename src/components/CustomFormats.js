import React, { useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/*
 * Example Parchment format from
 * https://quilljs.com/guides/cloning-medium-with-parchment/
 * See the video example in the guide for a complex format
 */
let Inline = Quill.import('blots/inline');
class BoldBlot extends Inline {}
BoldBlot.blotName = 'bold';
BoldBlot.tagName = 'b';
Quill.register('formats/bold', BoldBlot);

/* class MarkBlot extends Inline {}
MarkBlot.blotName = "background";
MarkBlot.tagName = "mark";
Quill.register("formats/background", MarkBlot); */

/*
 * Editor component with default and custom formats
 */
const CustomFormats = () => {
    const toolbarOptions = [
        ['bold' /* , "italic", "underline", "strike" */], // toggled buttons
        /* ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }], */

        [
            /* { color: [] },  */
            /* { background: [] } */
        ], // dropdown with defaults from theme
        /*  [{ font: [] }],
    [{ align: [] }], */

        /* ["clean"]  */ // remove formatting button
    ];

    const modules = {
        toolbar: toolbarOptions,
    };

    const formats = ['bold', 'background']; // add custom format name + any built-in formats you need

    const [text, setText] = useState('');

    const handleChange = (value) => {
        setText(value);
    };

    return (
        <ReactQuill
            value={text}
            onChange={handleChange}
            theme="snow"
            modules={modules}
            formats={formats}
        />
    );
};

export default CustomFormats;
