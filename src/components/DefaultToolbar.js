import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const DefaultToolbar = () => {
    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link', 'image'],
            ['clean'],
        ],
    };

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
    ];

    return (
        <div className="text-editor">
            <ReactQuill
                theme="snow"
                modules={modules}
                formats={formats}
            ></ReactQuill>
        </div>
    );
};

export default DefaultToolbar;
