/** pollFormat.js */
//import { Quill } from 'react-quill';
import Quill from 'quill';
import React from 'react';
import { createPortal } from 'react-dom';
import { v4 } from 'uuid';

const BlockEmbed = Quill.import('blots/block/embed');
console.log(BlockEmbed);

export class Poll extends BlockEmbed {
    static blotName = 'poll';
    static tagName = 'div';
    static className = `ql-custom`;

    /**
     * This static function generates a DOM Node for the Blot.
     * It will generate a DOM Node with the provided tagName and className.
     * This is not a good place to set listeners because you can't save a reference to them anywhere to remove them.
     * Don't call this function directly. Use parchment.create(blotName): Blot instead.
     * @param {Any} value
     */
    static create(value) {
        let node = super.create(value);
        // Do things with the DOM Node in a static context
        const id = v4();
        const refs = Poll.refs;
        node.setAttribute('data-id', id);
        Poll.id = id;
        Poll.data = value;
        Poll.refs = {
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
        console.log(
            '/* ---------------------------- Poll: call constructor ---------------------------- */'
        );
        super(domNode);
        this.id = Poll.id;
        this.data = Poll.data;
    }

    /**
     * Attaches the Blot to it's parent and siblings.
     * Inserts the Blot's DOM Node into the document under it's parent. Don't call this function directly.
     * Use parchment.create(blotName): Blot and one of the various insert functions instead.
     */
    attach() {
        console.log(
            '/* ---------------------------- Poll: call attach ---------------------------- */'
        );
        console.log(this.domNode);
        super.attach();
        this.scroll.emitter.emit('blot-mount', this);
    }

    renderPortal(id) {
        console.log(
            '/* ---------------------------- Poll: renderPortal ---------------------------- */'
        );
        const { options } = Quill.find(this.scroll.domNode.parentNode);
        const ref = Poll.refs[id];
        console.log('options: ', options);
        console.log('ref: ', ref);
        return createPortal(
            <PollComponent
                type={Poll.blotName}
                data={this.data}
                ref={ref}
                readOnly={options.readOnly}
            />,
            this.domNode
        );
    }

    /**
     * The opposite of attach. Do any cleanup from that here.
     */
    detach() {
        super.detach();
        this.scroll.emitter.emit('blot-unmount', this);
    }

    /**
     * Returns the value represented by domNode if it is this Blot's type
     * No checking that domNode can represent this Blot type is required so
     * applications needing it should check externally before calling.
     * @param {Object} domNode
     */
    static value(domNode) {
        console.log(
            '/* ---------------------------------- Poll: value --------------------------------- */'
        );

        /* const id = domNode.getAttribute('data-id');
        const ref = Poll.refs[id];
        if (ref.current) {
            console.log(ref.current.getData());
        }
        console.log(ref && ref.current && ref.current.getData());

        return ref && ref.current && ref.current.getData(); */

        const id = domNode.getAttribute('data-id');
        const ref = Poll.refs[this.id];
        let returnValue = {};
        if (ref && ref.current) {
            returnValue = {
                type: Poll.blotName,
                ref: Poll.refs[this.id],
                idFromDomNode: domNode.getAttribute('data-id'),
                idFromObj: this.id,
                dataFromObj: this.data,
                dataFromReactComponent: ref.current.getData(),
            };
        }
        console.log('>> this: ', this);
        console.log('>> domNode: ', domNode);
        console.log('>> ref: ', ref);
        console.log('>> returnValue: ', returnValue);

        return returnValue;
    }
}

class PollComponent extends React.Component {
    getData() {
        return this.props.data;
    }

    render() {
        console.log(
            '------------ PollComponent: render PollComponent -------------'
        );
        return (
            <div
                style={{
                    backgroundColor: 'green',
                    padding: '0.5em',
                    margin: '0.5em',
                    border: '0.2em solid blue',
                }}
                onClick={() =>
                    alert(
                        `data.id: ${this.props.data.id}\ndata.name: ${this.props.data.name}`
                    )
                }
            >
                {`data.id: ${this.props.data.id} - data.name: ${this.props.data.name}`}{' '}
                - Poll Component
            </div>
        );
    }
}
