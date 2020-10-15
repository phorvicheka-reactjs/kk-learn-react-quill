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
        this.editor = new Quill(this.editorContainer.current, {
            placeholder: 'Start typing',
            readOnly: false,
            formats: ['poll'],
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

        this.editor.on('selection-change', (range, oldRange, source) => {
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
    }

    onMount = (...blots) => {
        const embeds = blots.reduce(
            (memo, blot) => {
                memo[blot.id] = blot;
                return memo;
            },
            { ...this.state.embedBlots }
        );
        this.setState({ embedBlots: embeds });
    };

    onUnmount = (unmountedBlot) => {
        const {
            [unmountedBlot.id]: blot,
            ...embedBlots
        } = this.state.embedBlots;
        this.setState({ embedBlots });
        this.editor.off('text-change');
        this.editor.off('selection-change');
    };

    renderPoll() {
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
                    {map(this.state.embedBlots, (blot) =>
                        blot.renderPortal(blot.id)
                    )}
                </div>
                <button onClick={() => this.renderPoll()}>Poll</button>
            </>
        );
    }
}

export default EditorWithPollFeature;
