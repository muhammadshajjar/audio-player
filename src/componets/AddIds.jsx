import React, { useEffect } from "react";

import { WithContext as ReactTags } from "react-tag-input";

import addIdsStyles from "./AddIds.module.css";

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
    if (tags.length < 5) {
      setTags([...tags, tag]);
    }
    onGetIds(tag.text);
  };

  return (
    <div className={addIdsStyles["tags-container"]}>
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
