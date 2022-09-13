import React, { useEffect, useState } from "react";
import { Card, WelcomeCard } from "./components/Card";
import Pulse from "./components/Pulse";

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  const w = window;
  return {
    x: rect.left + window.scrollX < 0 ? 0 : rect.left + window.scrollX,
    y: rect.top + window.scrollY < 0 ? 0 : rect.top + window.scrollY,
    height: rect.height,
    width: rect.width,
    wWidth: w.innerWidth,
    wHeight: w.innerHeight,
  };
}

function selector(target) {
  return document.querySelector(target);
}

function selectorAll(target) {
  return document.querySelectorAll(target);
}

function setLocation(el, type, arrow, media, setArrow) {
  let cardHeight = 330;
  if (!media) {
    cardHeight = 170;
  }
  const { x, y, height, width, wWidth, wHeight } = getOffset(el);
  if (type === "introCard") {
    return { top: `${height + y + 15}px`, left: `${x - 12}px` };
  } else {
    //stepcard
    if (arrow === "left") {
      setArrow("left");
      return { top: `${y - 31}px`, left: `${x + width + 33}px` };
    } else if (arrow === "top") {
      if (wHeight - (y + height + cardHeight) >= 10) {
        setArrow("top");
        return {
          top: `${height + y + 20}px`,
          left: `${x - 53}px`,
        };
      } else {
        // bottom
        setArrow("bottom");
        return {
          top: `${y - (cardHeight + 70)}px`,
          left: `${x - 53}px`,
        };
      }
    }
  }
}

const Onboard = ({
  steps,
  render = true,
  onFinished = () => console.log("onfinished not defined"),
  customStep = 0,
  onStepFinished = (index) => console.log("step index : ", index),
}) => {
  const [show, setShow] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [cardLocation, setCardLocation] = useState({ top: "0px", left: "0px" });
  const [currentIndex, setCurrentIndex] = useState(customStep);
  const [arrow, setArrow] = useState("top");
  const finishOnboard = () => {
    setIsFinished(true);
    onFinished();
  };
  const [currentStep, setCurrentStep] = useState({
    cardType: "",
    location: { top: "0px", left: "0px" },
    customLocation: { top: 0, left: 0 },
    onBtnGotIt: () => console.log("not defined yet"),
    onBtnCancel: () => finishOnboard(),
  });

  const assignFunction = ({ type, operation, target }) => {
    if (type === "click") {
      return selector(target).click();
    } else if (type === "custom") {
      return operation();
    }
    return console.log("not assigned");
  };

  const next = () => {
    onStepFinished(currentIndex);
    setCurrentIndex(currentIndex + 1);
    if (steps.length === currentIndex + 1) {
      finishOnboard();
    }
  };

  const handleClickEventListener = (e) => {
    let target = e.currentTarget.myParam;
    assignFunction(
      steps[currentIndex].onBtnGotIt ? steps[currentIndex].onBtnGotIt : ""
    );
    next();
    setShow(false);
    target.removeEventListener("mousedown", handleClickEventListener);
  };

  const handleLocation = (elemTarget, e) => {
    let target = e?.currentTarget?.myParam ? e.currentTarget.myParam : elemTarget
    setCardLocation(
      setLocation(
        target,
        steps[currentIndex].cardType,
        steps[currentIndex].arrow,
        steps[currentIndex].media,
        setArrow
      )
    );
  }

  let debounce_timer;
  const handleLocationListener = (e) => {
    let target = e.currentTarget.myParam
    if (debounce_timer) clearTimeout(debounce_timer);
    debounce_timer = setTimeout(() => {
      setCardLocation(
        setLocation(
          target,
          steps[currentIndex].cardType,
          steps[currentIndex].arrow,
          steps[currentIndex].media,
          setArrow
        )
      );
    }, 100);
  }


  let timeout;
  useEffect(() => {
    if (isFinished) return;
    if (!render) return;
    console.log("RENDER : ", render);
    console.log("steps : ", steps);
    console.log("current index : ", currentIndex);
    if (steps && steps[currentIndex]) {
      const target = selector(steps[currentIndex].target);
      console.log("target : ", target);
      if (target) {
        // not render condition with target
        let renderStep = steps[currentIndex]?.notRenderStep
        if (selector(renderStep)) {
          next();
          return;
        }
        // touch or click target and go next step
        if (steps[currentIndex].triggerType === "draggable") {
          const allTarget = selectorAll(steps[currentIndex].target);
          Array.from(allTarget).map((el) => {
            el.removeEventListener("mousedown", handleClickEventListener);
            el.addEventListener("mousedown", handleClickEventListener);
            el.myParam = el;
          });
        }
        // Set Main State
        setCurrentStep({
          currentIndex: currentIndex,
          cardType: steps[currentIndex].cardType,
          title: steps[currentIndex].title,
          content: steps[currentIndex].content,
          targetLocation: getOffset(target),
          customLocation: steps[currentIndex].customLocation,
          onBtnGotIt: () => {
            assignFunction(
              steps[currentIndex].onBtnGotIt
                ? steps[currentIndex].onBtnGotIt
                : ""
            );
            next();
            setShow(false);
          },
          onBtnCancel: () => {
            assignFunction(
              steps[currentIndex].onBtnCancel
                ? steps[currentIndex].onBtnCancel
                : ""
            );
            finishOnboard();
            setShow(false);
          },
          steptext: steps[currentIndex].steptext,
          btnCancel: steps[currentIndex].btnCancel,
          btnGotIt: steps[currentIndex].btnGotIt,
          btnColor: steps[currentIndex].btnColor,
          arrowColor: steps[currentIndex].arrowColor,
          media: steps[currentIndex].media,
        });

        // wait the full render timeout
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => handleLocation(target), 300);
        // if scrollable property
        const element = selector(steps[currentIndex].scrollableArea) ? selector(steps[currentIndex].scrollableArea) : document;
        element.myParam = target;
        element.removeEventListener("scroll", handleLocationListener, false);
        element.addEventListener("scroll", handleLocationListener, false);
        // Set Visibility
        setShow(true);
      } else {
        // target is undefined
        setShow(false);
        if (steps[currentIndex].triggerType === "unvisible") {
          next();
        }
      }
    } else {
      // step syntax problem or empty
      setShow(false);
    }
  }, [steps, show, currentIndex, isFinished]);

  useEffect(() => {
    console.log("currentStep : ", currentStep);
  }, [currentStep]);

  return (
    !isFinished &&
    show && (
      <>
        {currentStep.cardType === "stepCard" && (
          <Card
            style={cardLocation}
            arrow={arrow}
            arrowColor={currentStep.arrowColor}
            title={currentStep.title}
            content={currentStep.content}
            steptext={currentStep.steptext}
            onBtnCancel={currentStep.onBtnCancel}
            handleStep={currentStep.onBtnGotIt}
            btnCancel={currentStep.btnCancel}
            btnGotIt={currentStep.btnGotIt}
            btnColor={currentStep.btnColor}
            media={currentStep.media}
          />
        )}
        {currentStep.cardType === "introCard" && (
          <WelcomeCard
            style={cardLocation}
            arrow={arrow}
            arrowColor={currentStep.arrowColor}
            title={currentStep.title}
            content={currentStep.content}
            onBtnGotIt={currentStep.onBtnGotIt}
            onBtnCancel={currentStep.onBtnCancel}
            btnCancel={currentStep.btnCancel}
            btnGotIt={currentStep.btnGotIt}
            btnColor={currentStep.btnColor}
            media={currentStep.media}
          />
        )}
        {currentStep.cardType === "pulse" && (
          <Pulse
            onBtnGotIt={currentStep.onBtnGotIt}
            customStyles={{
              top: `${currentStep.targetLocation.y +
                (currentStep.customLocation?.top
                  ? currentStep.customLocation.top
                  : 0)
                }px`,
              left: `${currentStep.targetLocation.x +
                (currentStep.customLocation?.left
                  ? currentStep.customLocation.left
                  : 0)
                }px`,
            }}
          />
        )}
      </>
    )
  );
};

export default Onboard;
