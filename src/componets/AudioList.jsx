import React from "react";

import { Audio } from "react-loader-spinner";

import listStyles from "./AudioList.module.css";

const AudioList = ({ musicUrls, setIsSelected, selected, isLoading }) => {
  return (
    <ul className={listStyles.list__container}>
      {musicUrls.map((url, index) => (
        <li
          key={`${index}${Math.random().toString()}`}
          className={
            `${listStyles.player__list}` +
            `${musicUrls[selected] === url ? ` ${listStyles.isActive}` : ""}`
          }
          onClick={() => setIsSelected(index)}
        >
          {url.slice(80, 110)}
        </li>
      ))}
      {isLoading && (
        <Audio
          height="100"
          width="100"
          color="#0075ff"
          ariaLabel="audio-loading"
          wrapperStyle={{}}
          wrapperClass={listStyles["wrapper-class"]}
          visible={true}
        />
      )}
      {!isLoading && musicUrls.length === 0 && (
        <p className={listStyles.feedback}>No Data Found!</p>
      )}
    </ul>
  );
};

export default AudioList;
