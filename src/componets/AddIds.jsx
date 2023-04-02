import React, { useState } from "react";

import { WithContext as ReactTags } from "react-tag-input";

import "./AddIds.css";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const AddIds = ({ onGetIds, onDone }) => {
  const [tags, setTags] = React.useState([]);
  const [btnDisable, setBtnDisable] = useState(true);

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
    if (tags.length <= 1) {
      setBtnDisable(true);
    }
  };

  const handleAddition = (tag) => {
    if (tags.length < 5) {
      setTags([...tags, tag]);
    }
    setBtnDisable(false);
  };

  const doneButtonHandler = () => {
    const upatedList = tags.map((item) => item.text);
    onGetIds(upatedList);
    setTags([]);
    setBtnDisable(true);
  };
  return (
    <div className="tags-container">
      <ReactTags
        inline
        inputFieldPosition="top"
        tags={tags}
        delimiters={delimiters}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        placeholder="Add Ids"
        autocomplete
      />
      <button
        disabled={btnDisable}
        onClick={doneButtonHandler}
        className="done-btn"
      >
        Done
      </button>
    </div>
  );
};

export default AddIds;
