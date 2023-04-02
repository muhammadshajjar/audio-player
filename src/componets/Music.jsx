import React, { useState, useEffect } from "react";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { BsPlayFill, BsFillPauseFill } from "react-icons/bs";
import { GrForwardTen, GrBackTen } from "react-icons/gr";
import { IoSettingsSharp } from "react-icons/io5";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { Audio } from "react-loader-spinner";

import "./Music.css";
import AddIds from "./AddIds";

const apiKey = "2d53ecdbbacf09343fe99a147929af9e";

const DEFAULT_SETTINGS = {
  autoPlay: false,
  baseApi: "",
  Ids: [],
  theme: "light",
};

const Music = () => {
  const [selected, setIsSelected] = useState(0);
  const [musicUrls, setMusicUrls] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [audioTag, setAudioTag] = useState(undefined);
  const [toggleSettingModal, setToggleSettingModal] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [firstRender, setFirstRender] = useState(true);
  const [changedApi, setChangedApi] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("settings")) || settings;
    if (data?.Ids?.length > 0) {
      const url = `${data.baseApi}${data.Ids.join(",")}?key=${apiKey}`;
      fetchMusicHandler(url);
    }
    setFirstRender(false);
    setSettings(data);
    setChangedApi(data?.baseApi || "");
  }, []);

  const fetchMusicHandler = async (url) => {
    setMusicUrls([]);
    try {
      setIsLoading(true);
      const response = await fetch(url);

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
    setIsLoading(false);
  };

  const selectParticularMusicHandler = (index) => {
    setIsSelected(index);
  };

  const autoNext = (e) => {
    if (settings.autoPlay) {
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
    }
  };

  const tenPerBackHandler = () => {
    if (audioTag.currentTime) {
      const backwardTime = audioTag.duration * 0.1;
      audioTag.currentTime -= backwardTime;
    }
  };

  const thirtySecForHandler = () => {
    audioTag.currentTime += 30;
  };

  const thirtySecBackHandler = () => {
    audioTag.currentTime -= 30;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setSettings((prevSettings) => ({
      ...prevSettings,
      baseApi: changedApi,
    }));
    setChangedApi("");
  };
  const changeApiHandler = (e) => {
    console.log("changed handler");
    setChangedApi(e.target.value);
  };

  const ToggleThemeHandler = () => {
    const newTheme = settings.theme === "light" ? "dark" : "light";

    setSettings((prevSettings) => ({
      ...prevSettings,
      theme: newTheme,
    }));
  };

  const getIdsHandler = (ids) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      Ids: ids,
    }));
  };

  const autoPlayHandler = () => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      autoPlay: !prevSettings.autoPlay,
    }));
  };

  useEffect(() => {
    if (!firstRender)
      localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  const test = () => {
    console.log(settings);
    const url = `${settings?.baseApi}${settings?.Ids?.join(",")}?key=${apiKey}`;
    if (url) fetchMusicHandler(url);
  };

  return (
    <div className="player-container" data-theme={settings.theme}>
      <div className="player">
        {
          <>
            <AudioPlayer
              className="audio-player"
              autoPlay={settings.autoPlay}
              src={musicUrls[selected]}
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
                <button className="time-btns" onClick={tenPerBackHandler}>
                  -10%
                </button>,
                <button className="time-btns" onClick={tenPerForwardHandler}>
                  +10%
                </button>,
                <button className="time-btns" onClick={thirtySecBackHandler}>
                  -30S
                </button>,
                <button className="time-btns" onClick={thirtySecForHandler}>
                  +30S
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
                <option value="1">1 Minute</option>
                <option value="5">5 Minute</option>
                <option value="10">10 Minute</option>
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
              {!loading && musicUrls.length == 0 && <p>No Data Found!</p>}
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
                {settings.theme == "light" && <BsToggleOff className="icons" />}
                {settings.theme == "dark" && <BsToggleOn className="icons" />}
              </button>
            </div>

            {toggleSettingModal && (
              <div className="settings-dialog">
                <ul className="dialog-list">
                  <li className="flex">
                    <span className="dialog-list__label">Automatic Play</span>
                    <button className="auto-btn" onClick={autoPlayHandler}>
                      {settings.autoPlay ? (
                        <BsToggleOn className="icons" />
                      ) : (
                        <BsToggleOff className="icons" />
                      )}
                    </button>
                  </li>
                  <li>
                    <form onSubmit={submitHandler} className="flex">
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
                        onChange={changeApiHandler}
                        value={changedApi}
                      />
                    </form>
                  </li>

                  <li className="ids-container">
                    <span className="dialog-list__label">Enter Id</span>
                    <AddIds
                      onGetIds={getIdsHandler}
                      storedTags={settings.Ids}
                    />
                  </li>

                  <button className="primary-btn btn-accent" onClick={test}>
                    Apply All
                  </button>
                </ul>
              </div>
            )}
          </>
        }
      </div>
    </div>
  );
};

export default Music;
