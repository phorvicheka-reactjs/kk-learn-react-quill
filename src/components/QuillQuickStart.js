import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

const QuillQuickStart = ({theme}) => {
    const [value, setValue] = useState('');

    return <ReactQuill theme={theme} value={value} onChange={setValue} />;
};

export default QuillQuickStart;
