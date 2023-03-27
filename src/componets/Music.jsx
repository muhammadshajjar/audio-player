import React, { useState, useEffect } from "react";

import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { BsPlayFill, BsFillPauseFill } from "react-icons/bs";
import { GrForwardTen, GrBackTen } from "react-icons/gr";
import { Audio } from "react-loader-spinner";

import "./Music.css";

const DATA = [
  "https://s3.us-west-1.amazonaws.com/karan-java-227922e2/c80f44b1-2748-44f3-b657-20e2efc7460c.mp3",
  "https://s3.us-west-1.amazonaws.com/karan-java-227922e2/e349c2d4-fc8a-4ba4-a831-cba386862992.mp3",
  "https://s3.us-west-1.amazonaws.com/karan-java-227922e2/7813aac4-8ffc-466a-8a55-18e1df6342b1.mp3",
  "https://s3.us-west-1.amazonaws.com/karan-java-227922e2/5ede5929-b95d-4871-82ab-5402aeeb8fe8.mp3",
  "https://s3.us-west-1.amazonaws.com/karan-java-227922e2/f0ceef27-192a-4ca5-be21-572465ab3b60.mp3",
];

const Music = () => {
  const [selected, setIsSelected] = useState(0);
  const [musicUrls, setMusicUrls] = useState(DATA);
  const [loading, setIsLoading] = useState(true);
  const [audioTag, setAudioTag] = useState(undefined);

  // useEffect(() => {
  //   fetchMusicHandler();
  // }, []);

  const fetchMusicHandler = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://test.devarx.org/api/test");

      if (!response.ok) throw new Error("someting went wrong");

      const data = await response.json();

      const transfromedData = data.data.urls.filter((item) => item !== "null");

      setMusicUrls(transfromedData);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err.message);
      alert("someting went wrong..");
    }
  };
  const selectParticularMusicHandler = (index) => {
    setIsSelected(index);
  };

  const autoNext = (e) => {
    if (selected === musicUrls.length - 1) {
      setIsSelected(0);
    } else {
      setIsSelected((perv) => perv + 1);
    }
  };

  const skipNextHandler = () => {
    if (selected === musicUrls.length - 1) {
      setIsSelected(0);
    } else {
      setIsSelected((perv) => perv + 1);
    }
  };

  const skipPrevHandler = () => {
    if (selected === 0) {
      setIsSelected(musicUrls.length - 1);
    } else {
      setIsSelected((perv) => perv - 1);
    }
  };

  const tenPerForwardHandler = () => {
    if (audioTag.currentTime) {
      const forwardTime = audioTag.duration * 0.1;
      audioTag.currentTime += forwardTime;
    } else {
      alert("Loading");
    }
  };

  const tenPerBackHandler = () => {
    if (audioTag.currentTime) {
      const backwardTime = audioTag.duration * 0.1;
      audioTag.currentTime -= backwardTime;
    } else {
      alert("Loading");
    }
  };
  return (
    <div className="player-container">
      {/* {loading && (
        <Audio
          height="100"
          width="100"
          color="#0075ff"
          ariaLabel="audio-loading"
          wrapperStyle={{}}
          wrapperClass="wrapper-class"
          visible={true}
        />
      )} */}
      <div className="player">
        {
          <>
            <AudioPlayer
              className="audio-player"
              autoPlay
              src={musicUrls[selected]}
              onPlay={(e) => console.log("onPlay")}
              progressJumpStep="3000"
              onEnded={autoNext}
              showSkipControls={true}
              onClickNext={skipNextHandler}
              onClickPrevious={skipPrevHandler}
              showJumpControls={true}
              onLoadedMetaData={(e) => setAudioTag(e.target)}
              defaultDuration={"Loading.."}
              customIcons={{
                play: <BsPlayFill />,
                pause: <BsFillPauseFill />,
              }}
              customAdditionalControls={[
                RHAP_UI.LOOP,
                <button className="btns" onClick={tenPerBackHandler}>
                  <GrBackTen className="icons" />
                </button>,
                <button className="btns" onClick={tenPerForwardHandler}>
                  <GrForwardTen className="icons" />
                </button>,
              ]}
            />

            <ul className="list-container">
              {musicUrls.map((url, index) => (
                <>
                  <li
                    className={
                      "player-list " +
                      `${musicUrls[selected] === url ? "isActive" : ""}`
                    }
                    onClick={selectParticularMusicHandler.bind(this, index)}
                  >
                    {url.slice(80, 110)}
                  </li>
                </>
              ))}
            </ul>
          </>
        }
      </div>
    </div>
  );
};

export default Music;
