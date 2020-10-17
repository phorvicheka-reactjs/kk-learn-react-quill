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

    // Clipboard Module: Auto format on paste
    useEffect(() => {
        if (quillRef) {
            console.log('--------------useEffect  [quillRef]-------------');
            console.log(quillRef);
            quillRef.clipboard.addMatcher(Node.TEXT_NODE, function (
                node,
                delta
            ) {
                console.log('-------------------------delta:', delta);
                console.log('-------------------------node:', node);
                console.log('-------------------------node.data:', node.data);
                const text = node.data;
                const lookupWords = text.match(/\w+|\s+|[^\s\w]+/g);
                console.log(lookupWords);
                console.log(text.length);
                //const newDelta = new Delta().retain(0).delete(text.length);
                const newDelta = new Delta();
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
                /* var regex = /https?:\/\/[^\s]+/g;
                if (typeof node.data !== 'string') return;
                var matches = node.data.match(regex);

                if (matches && matches.length > 0) {
                    var ops = [];
                    var str = node.data;
                    matches.forEach(function (match) {
                        var split = str.split(match);
                        var beforeLink = split.shift();
                        ops.push({ insert: beforeLink });
                        ops.push({
                            insert: match,
                            attributes: { link: match },
                        });
                        str = split.join(match);
                    });
                    ops.push({ insert: str });
                    delta.ops = ops;
                } */
                console.log('-------------------------newDelta:', newDelta);

                //return delta;
                return newDelta;
            });
        }
    }, [quillRef]);

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
        let pos;
        // editor.getSelection(), when user pasts text
        if (editor.getSelection()) {
            pos = editor.getSelection().index;
        } else {
            pos = text.length;
        }

        // Search for the current typing word's beginning and end.
        const left = text.slice(0, pos).search(/\S+$/);
        const right = text.slice(pos).search(/\s/);
        let currentTypingWord = {
            startIndex: left,
            endIndex: right + pos,
            word: text.slice(left, right + pos),
        };
        console.log('left: ', left);
        console.log('right: ', right);
        console.log(currentTypingWord);
        console.log(currentTypingWord.word.length);
        console.log(
            '>> Current Typing Word Format: ',
            quillRef.getFormat(
                currentTypingWord.startIndex,
                currentTypingWord.word.length
            )
        );
        console.log(
            '>> Current contents: ',
            quillRef.getContents(
                currentTypingWord.startIndex,
                currentTypingWord.word.length
            )
        );

        // when user delete letter
        /* if (
            delta.ops.length === 2 &&
            delta.ops[0].retain &&
            delta.ops[1].delete
        ) {
            quillRef.removeFormat(
                currentTypingWord.startIndex,
                currentTypingWord.word.length
            );
        } */

        // when user input or delete letter
        if (
            // when insert the begining of the text area
            (delta.ops.length === 1 &&
                (delta.ops[0].insert || delta.ops[0].delete) &&
                source === Quill.sources.USER) ||
            // when insert or delete letter
            (delta.ops.length === 2 &&
                delta.ops[0].retain &&
                (delta.ops[1].insert || delta.ops[1].delete) &&
                source === Quill.sources.USER)
        ) {
            quillRef.removeFormat(
                currentTypingWord.startIndex,
                currentTypingWord.word.length
            );
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
                if (
                    delta.ops.length === 2 &&
                    delta.ops[1].insert &&
                    /\r|\n|\t$/.test(delta.ops[1].insert)
                ) {
                    pos = pos + 1;
                }
                quillRef.updateContents(newDelta, Quill.sources.API);
                quillRef.setSelection(pos, 0, Quill.sources.API);
            });
        }

        /**
         * ===========================================================================
         *  Get the current typing word, and checking (support when typing)
         * ===========================================================================
         */

        // when typing, problem at the first marked text
        /* const text = editor.getText();
        let pos;
        // editor.getSelection(), when user pasts text
        if (editor.getSelection()) {
            pos = editor.getSelection().index;
        } else {
            pos = text.length;
        }
        // Search for the current typing word's beginning and end.
        let left = text.slice(0, pos).search(/\S+$/);
        const right = text.slice(pos).search(/\s/);
        if (left === -1) {
            // when type in the begining of the input text area, left set to 0
            left =
                text.slice(0, pos).search(/\s$/) === -1
                    ? 0
                    : text.slice(0, pos).search(/\s$/);
            console.log('***new left: ', left);
        }
        let currentTypingWord = {
            startIndex: left,
            endIndex: right + pos,
            word: text.slice(left, right + pos),
        };
        console.log('left: ', left);
        console.log('right: ', right);
        console.log(currentTypingWord);
        console.log(currentTypingWord.word.length);
        console.log(
            '>> Current Typing Word Format: ',
            quillRef.getFormat(
                currentTypingWord.startIndex,
                currentTypingWord.word.length
            )
        );

        // when user delete letter
        // if (
        //     delta.ops.length === 2 &&
        //     delta.ops[0].retain &&
        //     delta.ops[1].delete
        // ) {
        //     quillRef.removeFormat(
        //         currentTypingWord.startIndex,
        //         currentTypingWord.word.length
        //     );
        // }

        // when user input or delete letter
        if (
            // when insert the begining of the text area
            (delta.ops.length === 1 &&
                (delta.ops[0].insert || delta.ops[0].delete) &&
                source === Quill.sources.USER) ||
            // when insert or delete letter
            (delta.ops.length === 2 &&
                delta.ops[0].retain &&
                (delta.ops[1].insert || delta.ops[1].delete) &&
                source === Quill.sources.USER)
        ) {
            quillRef.removeFormat(
                currentTypingWord.startIndex,
                currentTypingWord.word.length
            );
            // do lookup work in keyWords
            const keyWords = ['cold', 'patient'];
            const lookupWord = currentTypingWord.word;
            console.log('>> currentTypingWord: ', currentTypingWord);
            console.log('>> lookupWord: ', lookupWord);
            const newDelta = new Delta()
                .retain(currentTypingWord.startIndex)
                .delete(lookupWord.length);
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

            console.log('******************');
            console.log('editor getContents: ', editor.getContents());
            console.log(newDelta);

            // https://github.com/quilljs/quill/issues/1940
            setImmediate(() => {
                // if the insert text is enter character
                if (
                    delta.ops.length === 2 &&
                    delta.ops[1].insert &&
                    /\r|\n|\t$/.test(delta.ops[1].insert)
                ) {
                    pos += 1;
                }
                quillRef.updateContents(newDelta, Quill.sources.API);
                quillRef.setSelection(pos, 0, Quill.sources.API);
            });
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
