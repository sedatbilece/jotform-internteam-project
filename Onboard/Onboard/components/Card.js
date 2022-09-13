import React, { useState, useEffect } from "react";
import "../styles/Style.scss";
import Icon from "../assets/Icon";
import Spinner from "./Spinner";

export const Card = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    style,
    arrow,
    arrowColor = "#394049",
    title,
    content,
    steptext,
    btnCancel = "Not now",
    btnGotIt = "Got it",
    btnColor = "#78bb07",
    onBtnCancel,
    handleStep,
    media,
  } = props;

  return (
    <div className="onboard-card" style={style}>
      <Icon name="arrow" color={arrowColor} classname={`arrow-${arrow}`} />
      {media && (
        <div className="onboard-card-header">
          {isLoading && <Spinner />}
          {media &&
            (media.substring(0, 5) != "data:" ||
              (media.substring(0, 5) == "data:" &&
                media.substring(5, 6) == "v")) &&
            !/.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(media) ? (
            <video
              autoPlay
              loop
              muted
              className="onboard-video"
              preload="auto"
              src={media}
              type="video/mp4"
              onLoadedData={() => setIsLoading(false)}
            />
          ) : (
            <img
              className="onboard-video"
              src={media}
              onLoad={() => setIsLoading(false)}
            />
          )}
        </div>
      )}
      <div className="onboard-card-content">
        <div className="onboard-card-title">{title}</div>
        <div className="onboard-card-description">{content}</div>
        <div className="onboard-card-options">
          <div className="onboard-card-progress">{steptext}</div>
          <div className="onboard-card-buttons">
            <button
              className="onboard-card-button-outline"
              onClick={onBtnCancel}
            >
              {btnCancel}
            </button>
            <button
              className="onboard-card-button"
              onClick={handleStep}
              style={{ backgroundColor: btnColor }}
            >
              {btnGotIt}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WelcomeCard = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    style,
    arrow = "top",
    arrowColor = "#78bb07",
    media,
    title = "Welcome to the Sign",
    content = "You can now collect legally binding e-signatures in <b>just 3 steps!</b> We'd love to show you how.",
    btnCancel = "Not now",
    onBtnCancel = () => console.log("btn cancel çalıştı"),
    btnGotIt = "Get Started",
    btnColor = "#78bb07",
    onBtnGotIt = () => console.log("btn got it çalıştı"),
  } = props;

  console.log("media : ", media);
  console.log("media1 : ", media.substring(0, 5));
  console.log("media2 : ", media.substring(5, 6));
  return (
    <div className="welcome-card" style={style}>
      <div className="card-top">
        <Icon name="arrow" color="#78bb07" classname={`arrow-${arrow}`} />
        {media && (
          <>
            {isLoading && <Spinner />}
            {media &&
              (media.substring(0, 5) != "data:" ||
                (media.substring(0, 5) == "data:" &&
                  media.substring(5, 6) == "v")) &&
              !/.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(media) ? (
              <video
                autoPlay
                loop
                muted
                className="onboard-video"
                preload="auto"
                src={media + "#t=2"}
                type="video/mp4"
                onLoadedData={() => setIsLoading(false)}
              />
            ) : (
              <img
                className="onboard-video"
                src={media}
                onLoad={() => setIsLoading(false)}
              />
            )}
          </>
        )}
      </div>
      <div className="card-bottom">
        <div>
          <div className="card-title">{title}</div>
          <div className="card-content">{content}</div>
        </div>
        <div className="btn-container">
          <button className="button-primary" onClick={onBtnGotIt} style={{ backgroundColor: btnColor }}>
            {btnGotIt}
          </button>
          <button className="button-transparent" onClick={onBtnCancel}>
            {btnCancel}
          </button>
        </div>
      </div>
    </div>
  );
};
