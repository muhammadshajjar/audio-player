import React, { useState, useEffect } from "react";

//audio player libraray "https://github.com/lhz516/react-h5-audio-player"
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

//icons & loadeer
import {
  BsPlayFill,
  BsFillPauseFill,
  BsToggleOff,
  BsToggleOn,
} from "react-icons/bs";
import { IoSettingsSharp } from "react-icons/io5";
import { Audio } from "react-loader-spinner";

//componets
import Settings from "./Settings";
import "./Music.css";

//constants
const API_KEY = "2d53ecdbbacf09343fe99a147929af9e";
const PROTOCOL = "http://";
const END_POINTS = "/api/textUpload/uploads/";

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
      const url = `${PROTOCOL}${data.baseApi}${END_POINTS}${data.Ids.join(
        ","
      )}?key=${API_KEY}`;

      fetchMusicHandler(url);
    }
    setFirstRender(false);
    setSettings(data);
    setChangedApi(data?.baseApi || "");
  }, []);

  useEffect(() => {
    if (!firstRender)
      localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  const fetchMusicHandler = async (url) => {
    setMusicUrls([]);
    try {
      setIsLoading(true);
      const response = await fetch(url);

      if (!response.ok) throw new Error("Something went wrong");

      const data = await response.json();
      const transfromedData = data.data.urls.filter((item) => item !== "null");

      setMusicUrls(transfromedData);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      audioTag.src = "";
      alert(err);
    }
    setIsLoading(false);
  };

  const selectParticularMusicHandler = (index) => {
    setIsSelected(index);
  };

  const autoNext = () => {
    if (settings.autoPlay) {
      audioTag.currentTime = 0;
      audioTag.play();
    } else {
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

  const ToggleThemeHandler = () => {
    const newTheme = settings.theme === "light" ? "dark" : "light";

    setSettings((prevSettings) => ({
      ...prevSettings,
      theme: newTheme,
    }));
  };

  const autoPlayHandler = () => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      autoPlay: !prevSettings.autoPlay,
    }));
  };

  const changeApiHandler = (e) => {
    setChangedApi(e.target.value);
    setSettings((prevSettings) => ({
      ...prevSettings,
      baseApi: e.target.value,
    }));
  };

  const getIdHandler = (id) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      Ids: [...prevSettings.Ids, id],
    }));
  };

  const deleteIdHandler = (i) => {
    const updatedIds = settings.Ids.filter((_, index) => index !== i);
    setSettings((prevSettings) => ({
      ...prevSettings,
      Ids: updatedIds,
    }));
  };

  const applyAllSettingsHandler = () => {
    const url = `${PROTOCOL}${
      settings?.baseApi
    }${END_POINTS}${settings?.Ids?.join(",")}?key=${API_KEY}`;
    if (url) fetchMusicHandler(url);
  };

  const handleDurationSelect = (e) => {
    const durationInMillis = e.target.value * 60 * 1000;
    audioTag.play();

    setTimeout(() => {
      audioTag.pause();
    }, durationInMillis);
  };

  return (
    <div className="player-container" data-theme={settings.theme}>
      <div className="player">
        {
          <>
            <AudioPlayer
              className="audio-player"
              loop={settings.autoPlay}
              src={musicUrls[selected]}
              progressJumpStep="3000"
              onEnded={autoNext}
              showSkipControls={true}
              onClickNext={skipNextHandler}
              onClickPrevious={skipPrevHandler}
              showJumpControls={true}
              onLoadedMetaData={(e) => setAudioTag(e.target)}
              defaultDuration="Loading.."
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
              <label htmlFor="pause">Pause After </label>
              <select
                id="pause"
                onChange={handleDurationSelect}
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
                    key={index}
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
              {!loading && musicUrls.length === 0 && <p>No Data Found!</p>}
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
                {settings.theme === "light" && (
                  <BsToggleOff className="icons" />
                )}
                {settings.theme === "dark" && <BsToggleOn className="icons" />}
              </button>
            </div>

            {toggleSettingModal && (
              <Settings
                settings={settings}
                onAutoPlay={autoPlayHandler}
                onGetIds={getIdHandler}
                onApplyAllSettings={applyAllSettingsHandler}
                onChangeApi={changeApiHandler}
                changedApi={changedApi}
                onDeleteId={deleteIdHandler}
              />
            )}
          </>
        }
      </div>
    </div>
  );
};

export default Music;
