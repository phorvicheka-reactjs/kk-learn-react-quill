import { Quill } from 'react-quill';
import { v4 } from "uuid";

let Inline = Quill.import('blots/inline');
export class MarkedWord extends Inline {

    static create(value) {
        console.log("======================> ", value);
        const id = v4();
        const { color, word } = value;
        let node = super.create(value);
        node.setAttribute("data-id", id);
        node.style.backgroundColor = color;
        node.style.cursor = "pointer";
        node.dataset.id = id;
        node.dataset.word = word;
        node.addEventListener('click', function(ev) {
            global.markedWordClick(word)
            ev.preventDefault();
        }, false);
        
        return node;
      }

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