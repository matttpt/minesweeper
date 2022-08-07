import React from "react";

export function Cell(props) {
  let content = null;
  let cls;
  if (props.isCovered) {
    cls = "cell covered";
    if (props.isFlagged) {
      content = <img src="flag.svg" alt="Flag" />;
    }
  } else {
    cls = "cell uncovered";
    if (props.isMined) {
      content = <img src="mine.svg" alt="Mine" />;
    } else {
      cls += ` neighbors-${props.neighboringMines}`;
      if (props.neighboringMines !== 0) {
        content = (
          <svg viewBox="0 0 100 100">
            <text fontSize="60" textAnchor="middle" x="50" y="75">
              {props.neighboringMines}
            </text>
          </svg>
        );
      }
    }
  }

  return (
    <div className={cls} onClick={props.onClick}
      onContextMenu={e => {
        e.preventDefault();
        return props.onRightClick();
      }}
    >
      {content}
    </div>
  );
}
