import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactQuill, { Quill } from 'react-quill';

const ReactQuillEvents = (props) => {
    const [editorHtml, setEditorHtml] = useState('');
    // Quill instance
    const [quillRef, setQuillRef] = useState(null);
    // ReactQuill component
    const [reactQuillRef, setReactQuillRef] = useState(null);

    useEffect(() => {
        if (
            reactQuillRef == null ||
            (reactQuillRef != null &&
                typeof reactQuillRef.getEditor !== 'function')
        )
            return;
        setQuillRef(reactQuillRef.getEditor());
    }, [reactQuillRef]);

    const handleOnChange = (content, delta, source, editor) => {
        console.log('------------------- handleOnChange ---------------------');
        console.log('content: ', content);
        console.log('delta: ', delta);
        console.log('source: ', source);
        console.log('editor: ', editor);
        console.log('editor getContents: ', editor.getContents());
        console.log('editor getText: ', editor.getText());
        console.log('editor getHTML: ', editor.getHTML());
        console.log('editor getSelection: ', editor.getSelection());
        console.log('editor getLength: ', editor.getLength());

        setEditorHtml(content);
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

    const handleOnChangeSelection = (range, source, editor) => {
        console.log('------------------- handleOnChangeSelection ---------------------');
        console.log('range: ', range);
        console.log('source: ', source);
        console.log('editor: ', editor);
    };

    const handleOnFocus = (range, source, editor) => {
        console.log('-------------------- handleOnFocus --------------------');
        console.log('range: ', range);
        console.log('source: ', source);
        console.log('editor: ', editor);
    };

    const handleOnBlur = (previousRange, source, editor) => {
        console.log('-------------------- handleOnBlur --------------------');
        console.log('previousRange: ', previousRange);
        console.log('source: ', source);
        console.log('editor: ', editor);
    };

    return (
        <div>
            <ReactQuill
                ref={(el) => {
                    setReactQuillRef(el);
                }}
                defaultValue={editorHtml}
                onChange={handleOnChange}
                onChangeSelection={handleOnChangeSelection}
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
                theme={null}
            />
        </div>
    );
};

ReactQuillEvents.propTypes = {};

export default ReactQuillEvents;
