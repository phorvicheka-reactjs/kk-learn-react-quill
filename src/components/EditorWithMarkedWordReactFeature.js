import React, { Component } from 'react';
import Quill from 'quill';
import defer from 'lodash/defer';
import map from 'lodash/map';
import { MarekedWordReact } from '../formats/markedWordReact';

import 'quill/dist/quill.core.css';

Quill.register(
    {
        'formats/markedwordReact': MarekedWordReact,
    },
    true
);

/**
 * NOT WORKING WITH INLINE BLOT FOR RENDER REACT COMPONENT
 */
class EditorWithMarkedWordReactFeature extends Component {
    constructor(props) {
        super(props);
        this.editor = null;
        this.editorContainer = React.createRef();
        this.state = {
            inlineBlots: [],
        };
    }

    componentDidMount() {
        this.editor = new Quill(this.editorContainer.current, {
            placeholder: 'Start typing',
            formats: ['markedwordReact'],
        });

        console.log(this.editor);

        this.editor.on('text-change', (delta, oldDelta, source) => {
            console.log('---------------------text-change');
            console.log('source: ', source);
            var text = this.editor.getText();
            console.log('editor text: ', text);
            if (source === 'api') {
                console.log('An API call triggered this change.');
            } else if (source === 'user') {
                console.log('A user action triggered this change.');
            }
        });

        let blots = [];
        /** Listener to listen for custom format */
        this.editor.scroll.emitter.on('blot-mount', (blot) => {
            blots.push(blot);
            defer(() => {
                if (blots.length > 0) {
                    this.onMount(...blots);
                    blots = [];
                }
            });
        });
        this.editor.scroll.emitter.on('blot-unmount', this.onUnmount);
       /*  this.editor.scroll.emitter.on('blot-unmount', (blot) => {
            defer(() => {
                this.onUnmount(blot);
            });
        }); */
    }

    onMount = (...blots) => {
        console.log(
            '/* --------------------------------- EditorWithPollFeature: onMount -------------------------------- */'
        );
        console.log('>> blots to be added: ', blots);
        console.log(
            '>> Before adding new blots to state: ',
            this.state.inlineBlots
        );
        const newInlineBlots = blots.reduce(
            (memo, blot) => {
                memo[blot.id] = blot;
                return memo;
            },
            { ...this.state.inlineBlots }
        );
        console.log('>> After adding new blots to state: ', newInlineBlots);
        this.setState({ inlineBlots: newInlineBlots });
    };

    onUnmount = (unmountedBlot) => {
        console.log(
            '/* --------------------------------- onUnmount -------------------------------- */'
        );
        console.log('>> Blots to be removed: ', unmountedBlot);
        console.log(
            '>> Before removing unmountedBlot to state: ',
            this.state.inlineBlots
        );
        const {
            [unmountedBlot.id]: blot,
            ...newInlineBlots
        } = this.state.inlineBlots;
        this.setState({ inlineBlots: newInlineBlots });
        console.log(
            '>> After removing unmountedBlot to state: ',
            newInlineBlots
        );
    };

    renderPoll() {
        const range = this.editor.getSelection(true);
        const type = 'markedwordReact';
        const text = 'word';
        const data = {
            id: '1',
            word: text,
            color: 'green',
        };
        /** Call pollFormat */
        this.editor.insertText(range.index, text, type, data);
        console.log(this.editor.getContents());
        console.log(this.editor.getText());
    }

    render() {
        return (
            <>
                <div spellCheck={false} ref={this.editorContainer}>
                    {map(this.state.inlineBlots, (blot) => {
                        console.log(
                            ' --------------------------------- render --------------------------------- '
                        );
                        console.log(blot);
                        console.log(
                            ' --------------------------------- end render --------------------------------- '
                        );
                        return blot.renderPortal();
                    })}
                </div>
                <button onClick={() => this.renderPoll()}>
                    Insert inlineBlot
                </button>
            </>
        );
    }
}

export default EditorWithMarkedWordReactFeature;
