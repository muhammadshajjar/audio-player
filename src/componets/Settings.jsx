import React from "react";

//icons
import { BsToggleOff, BsToggleOn } from "react-icons/bs";

//componets
import AddIds from "./AddIds";
import settingsStyles from "./Settings.module.css";

const Settings = ({
  settings,
  onAutoPlay,
  onGetIds,
  onApplyAllSettings,
  onChangeApi,
  changedApi,
  onDeleteId,
}) => {
  return (
    <div className={settingsStyles["settings-dialog"]}>
      <ul className={settingsStyles["dialog-list"]}>
        <li className={settingsStyles.flex}>
          <span className={settingsStyles["dialog-list__label"]}>
            Automatic Play
          </span>
          <button className={settingsStyles["auto-btn"]} onClick={onAutoPlay}>
            {settings.autoPlay ? (
              <BsToggleOn className={settingsStyles["icons"]} />
            ) : (
              <BsToggleOff className={settingsStyles["icons"]} />
            )}
          </button>
        </li>
        <li>
          <form className={settingsStyles.flex}>
            <label
              className={settingsStyles["dialog-list__label"]}
              id="api"
              htmlFor="api"
            >
              Change Api
            </label>
            <input
              type="text"
              name="api"
              className={settingsStyles["dialog-list__input"]}
              placeholder="Enter Api"
              onChange={onChangeApi}
              value={changedApi}
            />
          </form>
        </li>

        <li className={settingsStyles.flex}>
          <span className={settingsStyles["dialog-list__label"]}>Enter Id</span>
          <AddIds
            onGetIds={onGetIds}
            storedTags={settings.Ids}
            onDeleteId={onDeleteId}
          />
        </li>

        <button
          className={settingsStyles["btn-accent"]}
          onClick={onApplyAllSettings}
        >
          Apply All
        </button>
      </ul>
    </div>
  );
};

export default Settings;
