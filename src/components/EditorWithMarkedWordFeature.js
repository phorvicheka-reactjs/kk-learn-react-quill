import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactQuill, { Quill } from 'react-quill';
import { MarkedWord } from '../formats/markedWord';
import isWhitespace from 'is-whitespace';

import 'quill/dist/quill.core.css';

Quill.register(
    {
        'formats/markedWord': MarkedWord,
    },
    true
);

const Delta = Quill.import('delta');

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
        setEditorHtml(content);

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

        if (
            reactQuillRef == null ||
            typeof reactQuillRef.getEditor !== 'function'
        )
            return;
        console.log(
            'handleChange, contents:',
            reactQuillRef.getEditor().getContents()
        );

        console.log('>>editor html: ', editorHtml);
        console.log('>>content: ', content);


        /**
         * ================================================================================================
         *  Split texts and lOOP ALL (support when typing, and can use for when text is passed or changed)
         * ================================================================================================
         */
        const text = editor.getText();
        console.log('>>text: ', text);
        console.log('>>text.length: ', text.length);
        let pos = editor.getSelection().index;
        if (
            delta.ops.length === 2 &&
            delta.ops[0].retain &&
            delta.ops[1].delete
        ) {
            // Search for the word's beginning and end.
            const left = text.slice(0, pos).search(/\S+$/);
            const right = text.slice(pos).search(/\s/);
            let currentTypingWord = {
                startIndex: left,
                endIndex: right + pos,
                word: text.slice(left, right + pos),
            };
            console.log('left: ', left);
            console.log('right: ', right);
            // Return the word, using the located bounds to extract it from the string.
            console.log(currentTypingWord);
            console.log(currentTypingWord.word.length);
            quillRef.removeFormat(
                currentTypingWord.startIndex,
                currentTypingWord.word.length
            );
        }

        if (
            delta.ops.length === 2 &&
            delta.ops[0].retain &&
            delta.ops[1].insert &&
            source !== Quill.sources.API
        ) {
            // https://stackoverflow.com/questions/40881365/split-a-string-into-an-array-of-words-punctuation-and-spaces-in-javascript
            const lookupWords = text.match(/\w+|\s+|[^\s\w]+/g);
            console.log(lookupWords);
            console.log(text.length);
            const newDelta = new Delta().retain(0).delete(text.length);
            lookupWords.forEach((lookupWord, index) => {
                console.log(index);
                if (lookupWord.match(/\w+/)) {
                    // do lookup work in keyWords
                    const keyWords = ['cold', 'patient'];
                    if (keyWords.includes(lookupWord)) {
                        newDelta.insert(lookupWord, {
                            markedWord: {
                                color: 'green',
                                word: lookupWord,
                            },
                        });
                    } else {
                        newDelta.insert(lookupWord, {
                            markedWord: false,
                            background: false,
                        });
                    }
                } else {
                    newDelta.insert(lookupWord, {
                        markedWord: false,
                        background: false,
                    });
                }
            });

            console.log('******************');
            console.log('editor getContents: ', editor.getContents());
            console.log(newDelta);

            // https://github.com/quilljs/quill/issues/1940
            setImmediate(() => {
                if (/\r|\n|\t$/.test(delta.ops[1].insert)) {
                    pos = pos + 1;
                }
                quillRef.updateContents(newDelta, Quill.sources.API);
                quillRef.setSelection(pos, 0, Quill.sources.USER);
            });
        }


        /**
         * ===========================================================================
         *  Get the current typing word, and checking (support both when typing)
         *  TODO: Fixing
         * ===========================================================================
         */
        /* 
        // when typing, problem at the first marked text
        const text = editor.getText();
        let pos = editor.getSelection().index;
        // Search for the word's beginning and end.
        const left = text.slice(0, pos).search(/\S+$/);
        const right = text.slice(pos).search(/\s/);
        let currentTypingWord = {
            startIndex: left,
            endIndex: right + pos,
            word: text.slice(left, right + pos),
        };
        console.log('left: ', left);
        console.log('right: ', right);
        // Return the word, using the located bounds to extract it from the string.
        console.log(currentTypingWord);
        console.log(currentTypingWord.word.length);
        if (
            delta.ops.length === 2 &&
            delta.ops[0].retain &&
            delta.ops[1].delete
        ) {
            quillRef.removeFormat(
                currentTypingWord.startIndex,
                currentTypingWord.word.length
            );
        }

        if (
            currentTypingWord.word.length &&
            delta.ops.length === 2 &&
            delta.ops[0].retain &&
            delta.ops[1].insert &&
            source !== Quill.sources.API
        ) {
            quillRef.removeFormat(
                currentTypingWord.startIndex,
                currentTypingWord.word.length
            );
            // do lookup work in keyWords
            const keyWords = ['cold', 'patient'];
            if (keyWords.includes(currentTypingWord.word)) {
                let selection = {
                    index: currentTypingWord.startIndex,
                    length: 0,
                };
                var newDelta = new Delta()
                    .retain(selection.index)
                    .delete(currentTypingWord.word.length)
                    .insert(currentTypingWord.word, {
                        markedWord: {
                            color: 'green',
                            word: currentTypingWord.word,
                        },
                    })
                    .insert(' ');
                console.log('******************');
                console.log(newDelta);
                console.log(Quill.sources.API);
                quillRef.updateContents(newDelta, Quill.sources.API);
                console.log(quillRef.getContents());
                
                    quillRef.setSelection(
                        currentTypingWord.startIndex +
                            currentTypingWord.word.length +
                            1,
                        0,
                        Quill.sources.USER
                    );
            }
        } */

        /* if (
            delta.ops.length === 2 &&
            delta.ops[0].retain &&
            isWhitespace(delta.ops[1].insert)
        ) {
            console.log(delta.ops[1].insert.length);
            const text = editor.getText();
            console.log(text);
            let pos = editor.getSelection().index;
            if (delta.ops[1].insert === ' ') {
                pos = pos - 1;
            }
            // Search for the word's beginning and end.
            const left = text.slice(0, pos).search(/\S+$/);
            const right = text.slice(pos).search(/\s/);
            let currentTypingWord = {
                startIndex: left,
                endIndex: right + pos,
                word: text.slice(left, right + pos),
            };
            if (right === -1) {
                currentTypingWord = {
                    startIndex: left,
                    endIndex: pos,
                    word: text.slice(left, pos),
                };
            }
            console.log('left: ', left);
            console.log('right: ', right);
            // Return the word, using the located bounds to extract it from the string.
            console.log(currentTypingWord);
            console.log(currentTypingWord.word.length);
            quillRef.removeFormat(
                currentTypingWord.startIndex,
                currentTypingWord.word.length
            );

            if (currentTypingWord.word.length) {
                // do lookup work in keyWords
                const keyWords = ['cold', 'patient'];
                let ops = [];
                if (keyWords.includes(currentTypingWord.word)) {
                    let selection = {
                        index: currentTypingWord.startIndex,
                        length: 0,
                    };
                    var newDelta = new Delta()
                        .retain(selection.index)
                        .delete(currentTypingWord.word.length)
                        .insert(currentTypingWord.word, {
                            markedWord: {
                                color: 'green',
                                word: currentTypingWord.word,
                            },
                        });
                    console.log('******************');
                    console.log(newDelta);
                    quillRef.updateContents(newDelta, 'user');
                }
            }
        } */
    };

    const handleOnChangeSelection = (range, source, editor) => {
        console.log(
            '------------------- handleOnChangeSelection ---------------------'
        );
        console.log('range: ', range);
        console.log('source: ', source);
        console.log('editor: ', editor);
        console.log('editor getContents: ', editor.getContents());
        console.log('editor getText: ', editor.getText());
        console.log('editor getHTML: ', editor.getHTML());
        console.log('editor getSelection: ', editor.getSelection());
        console.log('editor getLength: ', editor.getLength());
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
