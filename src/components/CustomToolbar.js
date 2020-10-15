import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { StarFillIcon } from '@primer/octicons-react';
import 'react-quill/dist/quill.snow.css';
import './CustomToolbar.css';

const CustomToolbar = ({ placeholder }) => {
    /*
     * Custom "star" icon for the toolbar using an Octicon
     * https://octicons.github.io
     */
    const CustomButton = () => <StarFillIcon size={16} />;

    /*
     * Event handler to be attached using Quill toolbar module
     * http://quilljs.com/docs/modules/toolbar/
     */
    function insertStar() {
        const cursorPosition = this.quill.getSelection().index;
        this.quill.insertText(cursorPosition, '★');
        this.quill.setSelection(cursorPosition + 1);
    }

    function insertCustomTags(args) {
        console.log('insertCustomTags', args);

        const value = args[0];

        const cursorPosition = this.quill.getSelection().index;
        this.quill.insertText(cursorPosition, value);
        this.quill.setSelection(cursorPosition + value.length);
    }

    /*
     * Custom toolbar component including insertStar button and dropdowns
     */
    const Toolbar = () => (
        <div id="toolbar">
            <select
                className="ql-header"
                defaultValue={''}
                onChange={(e) => e.persist()}
            >
                <option value="1"></option>
                <option value="2"></option>
                <option value=""></option>
            </select>
            <button className="ql-bold"></button>
            <button className="ql-italic"></button>
            <select className="ql-color" defaultValue={''}>
                <option value="red"></option>
                <option value="green"></option>
                <option value="blue"></option>
                <option value="orange"></option>
                <option value="violet"></option>
                <option value="#d0d1d2"></option>
                <option value=""></option>
            </select>
            <button className="ql-insertStar">
                <CustomButton />
            </button>
            <select className="ql-insertCustomTags">
                <option value="1">One</option>
                <option value="2">Two</option>
            </select>
        </div>
    );

    const modules = {
        toolbar: {
            container: '#toolbar',
            handlers: {
                insertStar: insertStar,
                insertCustomTags: insertCustomTags,
            },
        },
    };

    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'color',
    ];

    const [editorHtml, setEditorHtml] = useState('');

    const handleChange = (html) => {
        setEditorHtml(html);
    };

    return (
        <div className="text-editor">
            <Toolbar />
            <ReactQuill
                value={editorHtml}
                onChange={handleChange}
                placeholder={placeholder}
                modules={modules}
                formats={formats}
            />
        </div>
    );
};

export default CustomToolbar;
