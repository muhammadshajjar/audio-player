import React, { useState, useEffect } from "react";

import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { BsPlayFill, BsFillPauseFill } from "react-icons/bs";
import { GrForwardTen, GrBackTen } from "react-icons/gr";
import { IoSettingsSharp } from "react-icons/io5";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { Audio } from "react-loader-spinner";

import "./Music.css";
import DropDown from "./DropDown";

const DATA = [
  "https://s3.us-west-1.amazonaws.com/karan-java-227922e2/c80f44b1-2748-44f3-b657-20e2efc7460c.mp3",
  "https://s3.us-west-1.amazonaws.com/karan-java-227922e2/e349c2d4-fc8a-4ba4-a831-cba386862992.mp3",
  "https://s3.us-west-1.amazonaws.com/karan-java-227922e2/7813aac4-8ffc-466a-8a55-18e1df6342b1.mp3",
  "https://s3.us-west-1.amazonaws.com/karan-java-227922e2/5ede5929-b95d-4871-82ab-5402aeeb8fe8.mp3",
  "https://s3.us-west-1.amazonaws.com/karan-java-227922e2/f0ceef27-192a-4ca5-be21-572465ab3b60.mp3",
];

const Music = () => {
  const [selected, setIsSelected] = useState(0);
  const [musicUrls, setMusicUrls] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [audioTag, setAudioTag] = useState(undefined);
  const [autoPlay, setAutoPlay] = useState(false);
  const [changedApi, setChangedApi] = useState("");
  const [toggleSettingModal, setToggleSettingModal] = useState(false);
  const [changeTheme, setChangeTheme] = useState("light");

  // const [duration, setDuration] = useState(0);
  // const [remainingTime, setRemainingTime] = useState(duration);
  useEffect(() => {
    fetchMusicHandler();
  }, [changedApi]);

  const fetchMusicHandler = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://54.177.204.151:8080/api/textUpload/uploads/ID_1664387372668?key=2d53ecdbbacf09343fe99a147929af9e"
      );

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
    if (autoPlay) {
      if (selected === musicUrls.length - 1) {
        setIsSelected(0);
      } else {
        setIsSelected((perv) => perv + 1);
      }
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
  const changeApiHandler = (e) => {
    e.preventDefault();
    setChangedApi(e.target.api.value);
    e.target.api.value = "";
  };

  const ToggleThemeHandler = () => {
    const newTheme = changeTheme === "light" ? "dark" : "light";
    setChangeTheme(newTheme);
  };
  // useEffect(() => {
  //   setRemainingTime(duration);
  // }, [duration]);

  // let timeoutId = null;

  // const handleDurationSelect = (e) => {
  //   clearTimeout(timeoutId);
  //   setDuration(e.target.value);

  //   setRemainingTime(e.target.value);
  //   timeoutId = setTimeout(() => {
  //     audioTag.pause();
  //     console.log("tigger");
  //   }, e.target.value * 60 * 1000);

  //   setRemainingTime(e.target.value * 60);
  // };

  // const seekedHandler = (e) => {
  //   timeoutId = setTimeout(() => {
  //     audioTag.pause();
  //   }, remainingTime * 1000);
  // };
  return (
    <div className="player-container" data-theme={changeTheme}>
      {loading && (
        <Audio
          height="100"
          width="100"
          color="#0075ff"
          ariaLabel="audio-loading"
          wrapperStyle={{}}
          wrapperClass="wrapper-class"
          visible={true}
        />
      )}
      {!loading && (
        <div className="player">
          {
            <>
              <AudioPlayer
                className="audio-player"
                autoPlay={autoPlay}
                src={musicUrls[selected]}
                progressJumpStep="3000"
                onEnded={autoNext}
                showSkipControls={true}
                onClickNext={skipNextHandler}
                onClickPrevious={skipPrevHandler}
                showJumpControls={true}
                onLoadedMetaData={(e) => setAudioTag(e.target)}
                defaultDuration={"Loading.."}
                // onSeeked={seekedHandler}
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
              <div className="pause-container">
                <label htmlFor="pause">Pause After:</label>
                <select
                  id="pause"
                  // onChange={handleDurationSelect}
                  className="input"
                >
                  <option value="default">Choose any option.</option>
                  <option value="1">1 Minutes</option>
                  <option value="5">5 Minutes</option>
                  <option value="10">10 Minutes</option>
                  <option value="1">1 Hour</option>
                  <option value="2">2 Hour</option>
                  <option value="3">3 Hour</option>
                </select>
              </div>

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
              <div className="actions">
                <button className="actions-btn">
                  <IoSettingsSharp
                    className="icons"
                    onClick={() =>
                      setToggleSettingModal((prevState) => !prevState)
                    }
                  />
                </button>
                <button className="actions-btn" onClick={ToggleThemeHandler}>
                  {changeTheme == "light" && <BsToggleOff className="icons" />}
                  {changeTheme == "dark" && <BsToggleOn className="icons" />}
                </button>
              </div>

              {toggleSettingModal && (
                <div className="settings-dialog">
                  <ul className="dialog-list">
                    <li className="flex">
                      <span className="dialog-list__label">Automatic Play</span>
                      <button
                        className="auto-btn"
                        onClick={() => setAutoPlay((prevPlay) => !prevPlay)}
                      >
                        {autoPlay ? (
                          <BsToggleOn className="icons" />
                        ) : (
                          <BsToggleOff className="icons" />
                        )}
                      </button>
                    </li>
                    <li>
                      <form onSubmit={changeApiHandler} className="flex">
                        <label
                          className="dialog-list__label"
                          id="api"
                          htmlFor="api"
                        >
                          Change Api
                        </label>
                        <input
                          type="text"
                          name="api"
                          className="input"
                          placeholder="Enter Api"
                        />
                      </form>
                    </li>
                  </ul>
                </div>
              )}
            </>
          }
        </div>
      )}
    </div>
  );
};

export default Music;
