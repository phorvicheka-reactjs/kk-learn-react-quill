import React from "react";
import "./App.css";
import QuillQuickStart from "./components/QuillQuickStart";
import DefaultToolbar from "./components/DefaultToolbar";
import CustomToolbar from "./components/CustomToolbar";
import CustomFormats from "./components/CustomFormats";
import CustomFormatHighlight from "./components/CustomFormatHighlight";
import ReactQuillEvents from "./components/ReactQuillEvents";
import EditorWithPollFeature from "./components/EditorWithPollFeature";
import EditorWithMarkedWordFeature from "./components/EditorWithMarkedWordFeature";
import EditorWithMarkedWordReactFeature from "./components/EditorWithMarkedWordReactFeature";

export default function App() {
  return (
    <div className="App">
      <h1>EditorWithMarkedWordReactFeature</h1>
      <h3>NOT WORKING WITH INLINE BLOT FOR RENDER REACT COMPONENT</h3>
      <EditorWithMarkedWordReactFeature />
      <h1>EditorWithMarkedWordFeature</h1>
      <h3>WORKING WITH CUSTOM FORMAT IN BLOT AND GLOBAL EVENT HANDLER METHOD</h3>
      <EditorWithMarkedWordFeature />
      <h1>EditorWithPollFeature</h1>
      <EditorWithPollFeature />
      <h1>ReactQuillEvents</h1>
      <ReactQuillEvents />
      <h1>QuillQuickStart - snow theme</h1>
      <QuillQuickStart theme="snow" />
      <h1>QuillQuickStart - bubble theme</h1>
      <QuillQuickStart theme="bubble"/>
      <h1>DefaultToolbar</h1>
      <DefaultToolbar />
      <h1>CustomToolbar</h1>
      <CustomToolbar placeholder={"Write something or insert a star ★"} />
      <h1>CustomFormats</h1>
      <CustomFormats />
      <h1>CustomFormatHighlight</h1>
      <CustomFormatHighlight />
    </div>
  );
}
