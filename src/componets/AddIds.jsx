import React, { useState, useEffect } from "react";

import { WithContext as ReactTags } from "react-tag-input";

import "./AddIds.css";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const AddIds = ({ onGetIds, storedTags }) => {
  const [tags, setTags] = React.useState([]);
  const [btnDisable, setBtnDisable] = useState(true);

  useEffect(() => {
    if (storedTags) {
      const newTags = storedTags?.map((item) => {
        return { id: item, text: item };
      });

      setTags([...newTags]);
    }
  }, []);
  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    console.log(tags);
    if (tags.length < 5) {
      setTags([...tags, tag]);
    }
    setBtnDisable(false);
  };

  const doneButtonHandler = () => {
    const upatedList = tags.map((item) => item.text);
    onGetIds(upatedList);
    setTags([]);
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
      <button onClick={doneButtonHandler} className="primary-btn">
        Done
      </button>
    </div>
  );
};

export default AddIds;
