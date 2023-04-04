import React, { useState, useEffect } from "react";

import { WithContext as ReactTags } from "react-tag-input";

import "./AddIds.css"; //css provided by react-tag lib

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const AddIds = ({ onGetIds, storedTags, onDeleteId }) => {
  const [tags, setTags] = React.useState([]);

  useEffect(() => {
    if (storedTags) {
      const newTags = storedTags?.map((item) => {
        return { id: item, text: item };
      });

      setTags([...newTags]);
    }
  }, []);

  const handleDelete = (i) => {
    const updatedTags = tags.filter((tag, index) => index !== i);
    setTags(updatedTags);
    onDeleteId(i);
  };

  const handleAddition = (tag) => {
    console.log(tags);
    if (tags.length < 5) {
      setTags([...tags, tag]);
    }
    onGetIds(tag.text);
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
    </div>
  );
};

export default AddIds;
