import React from "react";

import timeBtnStyles from "./TimeBtn.module.css";

const TimeBtn = ({ onClick, label }) => {
  return (
    <button className={timeBtnStyles["time-btns"]} onClick={onClick}>
      {label}
    </button>
  );
};

export default TimeBtn;
