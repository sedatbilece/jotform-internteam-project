import React from "react";

function Pulse({ customStyles, onBtnGotIt }) {
  return (
    <div className="onboard-pulse" style={customStyles} onClick={onBtnGotIt}></div>
  );
}

export default Pulse;
