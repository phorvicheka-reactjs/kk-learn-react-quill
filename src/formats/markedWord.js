import { Quill } from 'react-quill';
import { v4 } from 'uuid';

const Inline = Quill.import('blots/inline');
export class MarkedWord extends Inline {
    /**
     * This static function generates a DOM Node for the Blot.
     * It will generate a DOM Node with the provided tagName and className.
     * This is not a good place to set listeners because you can't save a reference to them anywhere to remove them.
     * Don't call this function directly. Use parchment.create(blotName): Blot instead.
     * @param {Any} value
     */
    static create(value) {
        console.log('======================> ', value);
        const id = v4();
        const { color, word } = value;
        let node = super.create(value);
        node.setAttribute('data-id', id);
        node.style.backgroundColor = color;
        node.style.cursor = 'pointer';
        node.dataset.id = id;
        node.dataset.word = word;
        node.addEventListener(
            'click',
            function (ev) {
                global.markedWordClick(word);
                ev.preventDefault();
            },
            false
        );

        return node;
    }

    /**
     * when call blot.formats() or getFormat() of the quill of react-quill
     * Returns format values represented by domNode if it is this Blot's type
     * No checking that domNode is this Blot's type is required.
     * @param {*} node
     */
    static formats(node) {
        if (!node.style.backgroundColor) return null;

        return {
            color: node.style.backgroundColor,
            word: node.dataset.word,
            id: node.dataset.id,
        };
    }
}

MarkedWord.blotName = 'markedWord';
