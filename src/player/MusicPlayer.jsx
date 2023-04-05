import React, { useState, useEffect } from "react";

//audio player library "https://github.com/lhz516/react-h5-audio-player"
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

//icons
import {
  BsPlayFill,
  BsFillPauseFill,
  BsToggleOff,
  BsToggleOn,
} from "react-icons/bs";
import { IoSettingsSharp } from "react-icons/io5";

//componets
import Settings from "../componets/Settings";
import playerStyles from "./MusicPlayer.module.css";
import AudioList from "../componets/AudioList";
import TimeBtn from "../ui/TimeBtn";

//api configurations
const API_KEY = "2d53ecdbbacf09343fe99a147929af9e";
const PROTOCOL = `${window.location.protocol}//`;
const END_POINTS = "/api/textUpload/uploads/";

const DEFAULT_SETTINGS = {
  autoPlay: false,
  baseApi: "",
  Ids: [],
  theme: "light",
};

const MusicPlayer = () => {
  const [selected, setIsSelected] = useState(0);
  const [musicUrls, setMusicUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
      const transfromedData = data.data.urls.filter((item) => item !== "null"); //transform the data as some urls are empty

      setMusicUrls(transfromedData);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      audioTag.src = "";
      alert(err);
    }
    setIsLoading(false);
  };

  const autoNextHandler = () => {
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
    audioTag?.play();
    if (audioTag.currentTime) {
      const forwardTime = audioTag.duration * 0.1;
      audioTag.currentTime += forwardTime;
    }
  };

  const tenPerBackHandler = () => {
    audioTag?.play();
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

  const toggleThemeHandler = () => {
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
    const userSelection = e.target.value;
    let durationInMillis;
    const selectedDuration = +userSelection.substring(0, 1);

    if (userSelection.includes("h"))
      durationInMillis = selectedDuration * 60 * 60 * 1000;
    else durationInMillis = selectedDuration * 60 * 1000;

    audioTag.play();

    setTimeout(() => {
      audioTag.pause();
    }, durationInMillis);
  };

  return (
    <div
      className={playerStyles["player-container"]}
      data-theme={settings.theme}
    >
      <div className={playerStyles["player"]}>
        {
          <>
            <AudioPlayer
              className={playerStyles["audio-player"]}
              loop={settings.autoPlay}
              src={musicUrls[selected]}
              progressJumpStep="3000" //you can modify jump steps by giving milliseconds to this prop
              onEnded={autoNextHandler}
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
                <TimeBtn label="-10%" onClick={tenPerBackHandler} />,
                <TimeBtn label="+10%" onClick={tenPerForwardHandler} />,
                <TimeBtn label="-30S" onClick={thirtySecBackHandler} />,
                <TimeBtn label="+30S" onClick={thirtySecForHandler} />,
              ]}
            />
            <div className={playerStyles["pause-container"]}>
              <label htmlFor="pause">Pause After </label>
              <select
                id="pause"
                onChange={handleDurationSelect}
                className={playerStyles["pause-input"]}
              >
                <option value="default">Choose any option.</option>
                <option value="1m">1 Minute</option>
                <option value="5m">5 Minute</option>
                <option value="10h">10 Minute</option>
                <option value="1h">1 Hour</option>
                <option value="2h">2 Hour</option>
                <option value="3h">3 Hour</option>
              </select>
            </div>

            <AudioList
              musicUrls={musicUrls}
              setIsSelected={setIsSelected}
              selected={selected}
              isLoading={isLoading}
            />

            <div className={playerStyles["actions"]}>
              <button className={playerStyles["actions-btn"]}>
                <IoSettingsSharp
                  className={playerStyles["icons"]}
                  onClick={() =>
                    setToggleSettingModal((prevState) => !prevState)
                  }
                />
              </button>
              <button
                className={playerStyles["actions-btn"]}
                onClick={toggleThemeHandler}
              >
                {settings.theme === "light" && (
                  <BsToggleOff className={playerStyles["icons"]} />
                )}
                {settings.theme === "dark" && (
                  <BsToggleOn className={playerStyles["icons"]} />
                )}
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

export default MusicPlayer;
