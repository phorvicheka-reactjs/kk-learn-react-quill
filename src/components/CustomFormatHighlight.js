import React, { useState, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CustomFormatHighlight.css';

/*
 * Example Parchment format from
 * https://quilljs.com/guides/cloning-medium-with-parchment/
 * See the video example in the guide for a complex format
 */
let Inline = Quill.import('blots/inline');
class Highlight extends Inline {
    static create(opts) {
        const { color, id } = opts;

        let node = super.create();

        node.style.backgroundColor = color;
        node.dataset.id = id;

        return node;
    }

    static formats(node) {
        if (!node.style.backgroundColor) return null;

        return {
            color: node.style.backgroundColor,
            id: node.dataset.id,
        };
    }
}

Highlight.blotName = 'highlight';
/* Highlight.tagName = "span"; */

Quill.register('formats/highlight', Highlight);

/*
 * Editor component with default and custom formats
 */
const CustomFormatHighlight = () => {
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote', 'code-block'], // blocks
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }], // lists
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction
        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // header dropdown
        [{ color: [] }, { background: [] }], // dropdown with defaults
        [{ font: [] }], // font family
        [{ align: [] }], // text align
        ['clean'], // remove formatting
    ];

    const modules = {
        /* toolbar: toolbarOptions */
    };

    const formats = [
        'header',
        'font',
        'background',
        'color',
        'code',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'script',
        'align',
        'direction',
        'link',
        'image',
        'code-block',
        'formula',
        'video',
        'highlight',
    ]; // add custom format name + any built-in formats you need

    const [editorHtml, setEditorHtml] = useState('');
    // Quill instance
    const [quillRef, setQuillRef] = useState(null);
    // ReactQuill component
    const [reactQuillRef, setReactQuillRef] = useState(null);

    useEffect(() => {
        attachQuillRefs();
    }, [reactQuillRef]);

    const attachQuillRefs = () => {
        if (
            reactQuillRef == null ||
            (reactQuillRef != null &&
                typeof reactQuillRef.getEditor !== 'function')
        )
            return;
        setQuillRef(reactQuillRef.getEditor());
    };

    const handleChange = (value) => {
        setEditorHtml(value);
        if (
            reactQuillRef == null ||
            typeof reactQuillRef.getEditor !== 'function'
        )
            return;
        console.log(
            'handleChange, contents:',
            reactQuillRef.getEditor().getContents()
        );
    };

    const handleClickIns = () => {
        var range = quillRef.getSelection();
        let position = range ? range.index : 0;
        quillRef.insertText(position, 'Hello, World! ');
        quillRef.insertText(position+'Hello, World! '.length, 'Hello, World! ', 'highlight', {
            color: 'blue',
            id: '1',
        });
    };

    const handleClickHl = () => {
        const selection = quillRef.getSelection();
        quillRef.formatText(selection.index, selection.length, 'highlight', {
            color: 'blue',
            id: '1',
        });
    };

    return (
        <div>
            <ReactQuill
                ref={(el) => {
                    setReactQuillRef(el);
                }}
                defaultValue={editorHtml}
                onChange={handleChange}
                /* theme="snow" */
                theme={null}
                modules={modules}
                formats={formats}
            />
            <button onClick={handleClickIns}>Insert Text</button>
            <button onClick={handleClickHl}>Highlight</button>
        </div>
    );
};

export default CustomFormatHighlight;
