import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactQuill, { Quill } from 'react-quill';
import { MarkedWord } from '../formats/markedWord';
import isWhitespace from 'is-whitespace'

import 'quill/dist/quill.core.css';

Quill.register(
    {
        'formats/markedWord': MarkedWord,
    },
    true
);

const EditorWithMarkedWordFeature = (props) => {
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


        var regex = /https?:\/\/[^\s]+$/g;
        if (
            delta.ops.length === 2 &&
            delta.ops[0].retain &&
            isWhitespace(delta.ops[1].insert)
        ) {
            var endRetain = delta.ops[0].retain;
            var text = quillRef.getText().substr(0, endRetain);
            console.log(text);
            var match = text.match(regex);
            console.log('**************', match);
            if (match !== null) {
                var url = match[0];

                var ops = [];
                if (endRetain > url.length) {
                    ops.push({ retain: endRetain - url.length });
                }

                ops = ops.concat([
                    { delete: url.length },
                    //{ insert: url, attributes: { link: url } },
                    { insert: url, attributes: { markedWord:  {
                        color: 'green',
                        word: url,
                    } } },
                ]);

                quillRef.updateContents({
                    ops: ops,
                });
            }
        }
    };

    const handleOnChangeSelection = (range, source, editor) => {
        console.log(
            '------------------- handleOnChangeSelection ---------------------'
        );
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

    const insertMarkedWord = (data) => {
        const range = quillRef.getSelection(true);
        const type = 'markedWord';
        quillRef.insertText(range.index, data.word, { [type]: data });
        quillRef.insertText(5, 'Quill');
        console.log(quillRef.getContents());
        console.log(quillRef.getText());
    };

    const handleClickHl = () => {
        console.log('+++++++++handleClickHl');
        const { index, length } = quillRef.getSelection();
        console.log(quillRef.getContents(index, length));
        // if all contains markedWord -> remove
        // else contains markedWord -> remove and add back
        const { ops } = quillRef.getContents(index, length);
        const isMarkedWord = ops.every((op) => {
            return (
                op.attributes !== undefined &&
                op.attributes.markedWord !== undefined
            );
        });
        console.log(isMarkedWord);
        console.log(quillRef.getFormat(index, length));
        if (isMarkedWord) {
            quillRef.removeFormat(index, length);
        } else {
            quillRef.removeFormat(index, length);
            quillRef.formatText(index, length, 'markedWord', {
                color: 'green',
                word: quillRef.getText(index, length),
            });
        }
    };

    return (
        <div>
            <ReactQuill
                ref={(el) => {
                    setReactQuillRef(el);
                }}
                value={editorHtml}
                onChange={handleOnChange}
                onChangeSelection={handleOnChangeSelection}
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
                theme={null}
            />
            <button onClick={() => handleClickHl()}>Highlight</button>
            <button
                onClick={() => insertMarkedWord({ color: 'red', word: 'Cold' })}
            >
                Insert Mared Word
            </button>
        </div>
    );
};

EditorWithMarkedWordFeature.propTypes = {};

export default EditorWithMarkedWordFeature;
