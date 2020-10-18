import React, { Component } from 'react';
import Quill from 'quill';
import defer from 'lodash/defer';
import map from 'lodash/map';
import { Poll } from '../formats/poll';

import 'quill/dist/quill.core.css';

Quill.register(
    {
        'formats/poll': Poll,
    },
    true
);

class EditorWithPollFeature extends Component {
    constructor(props) {
        super(props);
        this.editor = null;
        this.editorContainer = React.createRef();
        this.state = {
            embedBlots: [],
        };
    }

    componentDidMount() {
        console.log(
            `-------------------------------------------------------------------------- \n 
            EditorWithPollFeature: componentDidMount \n 
            -------------------------------------------------------------------------- \n`
        );

        console.log(
            '/* ---------------------------------- EditorWithPollFeature: componentDidMount --------------------------------- */'
        );
        this.editor = new Quill(this.editorContainer.current, {
            placeholder: 'Start typing',
            readOnly: false,
            formats: ['poll'],
        });

        console.log(this.editor);

        /* this.editor.on('text-change', (delta, oldDelta, source) => {
            console.log('---------------------text-change');
            console.log('source: ', source);
            var text = this.editor.getText();
            console.log('editor text: ', text);
            if (source === 'api') {
                console.log('An API call triggered this change.');
            } else if (source === 'user') {
                console.log('A user action triggered this change.');
            }
        }); */

        /* this.editor.on('selection-change', (range, oldRange, source) => {
            console.log('------------------------selection-change');
            console.log('range: ', range);
            if (range) {
                if (range.length === 0) {
                    console.log('User cursor is on', range.index);
                } else {
                    var text = this.editor.getText(range.index, range.length);
                    console.log('User has highlighted', text);
                }
            } else {
                console.log('Cursor not in the editor');
            }
        }); */

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

        console.log(
            '/* ---------------------------------- EditorWithPollFeature: blots --------------------------------- */'
        );

        console.log(blots);
        this.editor.scroll.emitter.on('blot-unmount', this.onUnmount);
    }

    onMount = (...blots) => {
        console.log(
            '/* --------------------------------- EditorWithPollFeature: onMount -------------------------------- */'
        );
        console.log('>> blots to be added: ', blots);
        console.log('>> Before adding new blots to state: ', this.state.embedBlots);
        const embeds = blots.reduce(
            (memo, blot) => {
                memo[blot.id] = blot;
                return memo;
            },
            { ...this.state.embedBlots }
        );
        console.log('>> After adding new blots to state: ', embeds);
        this.setState({ embedBlots: embeds });
    };

    onUnmount = (unmountedBlot) => {
        console.log(
            '/* --------------------------------- EditorWithPollFeature: onUnmount -------------------------------- */'
        );
        console.log('>> Blots to be removed: ', unmountedBlot);
        console.log('>> Before removing unmountedBlot to state: ', this.state.embedBlots);
        const {
            [unmountedBlot.id]: blot,
            ...embedBlots
        } = this.state.embedBlots;
        console.log('>> After removing unmountedBlot to state: ', embedBlots);
        this.setState({ embedBlots });
    };

    renderPoll() {
        console.log(
            '/* --------------------------------- EditorWithPollFeature: renderPoll -------------------------------- */'
        );
        const range = this.editor.getSelection(true);
        const type = 'poll';
        const data = { id: '1', name: 'kk' };
        /** Call pollFormat */
        this.editor.insertEmbed(range.index, type, data);
        console.log(this.editor.getContents());
        console.log(this.editor.getText());
    }

    render() {
        return (
            <>
                <div spellCheck={false} ref={this.editorContainer}>
                    {map(this.state.embedBlots, (blot) => {
                        console.log(
                            ' --------------------------------- EditorWithPollFeature: render --------------------------------- '
                        );
                        console.log(blot);
                        console.log(blot.value());
                        console.log(
                            ' --------------------------------- EditorWithPollFeature: end render --------------------------------- '
                        );
                        return blot.renderPortal(blot.id);
                    })}
                </div>
                <button onClick={() => this.renderPoll()}>Poll</button>
            </>
        );
    }
}

export default EditorWithPollFeature;
