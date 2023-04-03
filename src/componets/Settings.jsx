import React, { useState } from "react";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";

import AddIds from "./AddIds";
import "./Settings.css";

const Settings = ({
  settings,
  onAutoPlay,
  onSubmitApi,
  onGetIds,
  onApplyAllSettings,
  onChangeApi,
  changedApi,
}) => {
  return (
    <div className="settings-dialog">
      <ul className="dialog-list">
        <li className="flex">
          <span className="dialog-list__label">Automatic Play</span>
          <button className="auto-btn" onClick={onAutoPlay}>
            {settings.autoPlay ? (
              <BsToggleOn className="icons" />
            ) : (
              <BsToggleOff className="icons" />
            )}
          </button>
        </li>
        <li>
          <form onSubmit={onSubmitApi} className="flex">
            <label className="dialog-list__label" id="api" htmlFor="api">
              Change Api
            </label>
            <input
              type="text"
              name="api"
              className="input"
              placeholder="Enter Api"
              onChange={onChangeApi}
              value={changedApi}
            />
          </form>
        </li>

        <li className="flex">
          <span className="dialog-list__label">Enter Id</span>
          <AddIds onGetIds={onGetIds} storedTags={settings.Ids} />
        </li>

        <button className="primary-btn btn-accent" onClick={onApplyAllSettings}>
          Apply All
        </button>
      </ul>
    </div>
  );
};

export default Settings;
