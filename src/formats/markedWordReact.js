/** pollFormat.js */
//import { Quill } from 'react-quill';
import { render } from '@testing-library/react';
import Quill from 'quill';
import React from 'react';
import { createPortal } from 'react-dom';
import { v4 } from 'uuid';

//const BlockEmbed = Quill.import("blots/block/embed");
const Inline = Quill.import('blots/inline');

/**
 * NOT WORKING WITH INLINE BLOT FOR RENDER REACT COMPONENT
 */
export class MarekedWordReact extends Inline {
    static blotName = 'markedwordReact';
    static tagName = 'div';
    static className = `ql-custom-markedword-react`;

    /**
     * This static function generates a DOM Node for the Blot.
     * It will generate a DOM Node with the provided tagName and className.
     * This is not a good place to set listeners because you can't save a reference to them anywhere to remove them.
     * Don't call this function directly. Use parchment.create(blotName): Blot instead.
     * @param {Any} value
     */
    static create(value) {
        const node = super.create(value);
        // Do things with the DOM Node in a static context
        const id = v4();
        const refs = MarekedWordReact.refs;
        node.setAttribute('data-id', id);
        MarekedWordReact.id = id;
        MarekedWordReact.data = value;
        MarekedWordReact.refs = {
            ...refs,
            [id]: React.createRef(),
        };
        return node;
    }

    /**
     * The constructor gets passed the DOM Node created by the create() function.
     * The Blot still has not been connected to it's parent and siblings
     * at the time of construction and it (as well its DOM Node) have not actually been attached anywhere.
     * @param {Object} domNode
     */
    constructor(domNode) {
        super(domNode);
        // Do things with the DOM Node in a class context. Save anything you need a reference to.
        this.id = MarekedWordReact.id;
        this.data = MarekedWordReact.data;
    }

    /**
     * Attaches the Blot to it's parent and siblings.
     * Inserts the Blot's DOM Node into the document under it's parent. Don't call this function directly.
     * Use parchment.create(blotName): Blot and one of the various insert functions instead.
     */
    attach() {
        super.attach();
        // Do something that requires the parent or sibling Blots, or for the Blot to actually be in the document.
        // blot-mount and blot-unmount is the custom listener
        // which will help us if we use store the state of this custom blot list inside editor.
        this.scroll.emitter.emit('blot-mount', this);
    }

    /**
     * Render the format with React component using portal from React
     */
    renderPortal() {
        console.log(
            ' ------------------------------ renderPortal ------------------------------ '
        );
        console.log(MarekedWordReact);
        console.log(MarekedWordReact.blotName);
        console.log(MarekedWordReact.refs);
        console.log(this.id);
        console.log(MarekedWordReact.refs[this.id]);

        return createPortal(
            <MarekedWordReactComponent
                type={MarekedWordReact.blotName}
                ref={MarekedWordReact.refs[this.id]}
                id={this.id}
                data={this.data}
            />,
            this.domNode
        );
    }

    /**
     * The opposite of attach. Do any cleanup from here.
     */
    detach() {
        super.detach();
        // Do any cleanup from that here.
        // blot-mount and blot-unmount is the custom listener
        // which will help us if we use store the state of this custom blot list inside editor.
        this.scroll.emitter.emit('blot-unmount', this);
    }
}

class MarekedWordReactComponent extends React.Component {
    handleOnClick = (data) => {
        console.log(
            '/* ------------------------------ handleOnClick ----------------------------- */'
        );
        console.log(data);
        alert(`handleOnClick:\n${data}`);
    };

    render() {
        const { id, type, data } = this.props;
        return (
            <div
                onClick={() => this.handleOnClick(data)}
                id={id}
                className={type}
                style={{
                    backgroundColor: data.color,
                }}
            >
                {`data.id: ${data.id}\ndata.word: ${data.word}\ndata.color: ${data.color}`}
            </div>
        );
    }
}

/* class MarekedWordReactComponent extends React.Component {
    getData() {
        return 'data';
    }

    render() {
        return (
            <div onClick={() => alert(this.props.data.id)}>
                {this.props.data.id + '' + this.props.data.name}Poll Component
            </div>
        );
    }
} */
