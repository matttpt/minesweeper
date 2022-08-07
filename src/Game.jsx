import React, { Component, Fragment } from "react";
import { Board } from "./Board";
import { Cell } from "./Cell";

export class Game extends Component {
  constructor(props) {
    super(props);

    const board = new Board(props.initialHeight, props.initialWidth);
    board.placeMines(props.mineCount);

    this.state = {
      board,
      resolution: null,
      mineCount: props.mineCount,
    };
  }

  handleClick(row, col) {
    this.setState((state, _props) => {
      if (state.resolution) {
        return null;
      }

      const cell = state.board.get(row, col);
      if (cell.isFlagged) {
        return null;
      }

      const newBoard = state.board.clone();
      let resolution = null;

      const hitMine = newBoard.handleCellClick(row, col);
      if (hitMine) {
        newBoard.uncoverMines();
        resolution = "lost";
      } else if (newBoard.countCovered() <= state.mineCount) {
        newBoard.markMines();
        resolution = "won";
      }

      return {
        board: newBoard,
        resolution,
      };
    });
  }

  handleRightClick(row, col) {
    this.setState((state, _props) => {
      if (state.resolution) {
        return null;
      }

      const cell = state.board.get(row, col);
      if (cell.isCovered) {
        const newBoard = state.board.clone();
        newBoard.get(row, col).isFlagged = !cell.isFlagged;
        return {
          board: newBoard,
        };
      }
    });
  }

  render() {
    const height = this.state.board.height();
    const width = this.state.board.width();

    const cells =
      new Array(height * width);
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const cell = this.state.board.get(i, j);
        const flatIndex = i * width + j;
        cells[flatIndex] = (
          <Cell key={flatIndex} isMined={cell.isMined}
            isFlagged={cell.isFlagged} isCovered={cell.isCovered}
            neighboringMines={cell.neighboringMines}
            resolution={this.state.resolution}
            onClick={() => this.handleClick(i, j)}
            onRightClick={() => this.handleRightClick(i, j)}
          />
        );
      }
    }

    const cls = "game-grid " + (this.state.resolution ?? "in-progress");
    const maxBoardWidth = width * 37 + (width - 1) * 3 + 10;
    const gridStyle = {
      gridTemplateColumns: `repeat(${width}, 1fr)`,
      minWidth: `${width * 17 + (width - 1) * 3}px`,
    };
    const scrollerStyle = {
      maxWidth: `min(${maxBoardWidth}px, calc(100vw - 2rem))`,
    };

    let message;
    if (this.state.resolution) {
      message = `You’ve ${this.state.resolution}!`;
    } else {
      message =
        `${this.state.board.countFlagged()}/${this.state.mineCount} flagged`;
    }

    return (
      <Fragment>
        <div className="wrapper game-bar">
          <div>{message}</div>
          <div className="button-bar">
            <button onClick={this.props.onReconfigure}>
              Reconfigure
            </button>
            <button onClick={this.props.onStartFresh}>
              Start fresh
            </button>
          </div>
        </div>
        <div className="game-grid-scroller" style={scrollerStyle}>
          <div className={cls} style={gridStyle}
            onContextMenu={e => e.preventDefault()}
          >
            {cells}
          </div>
        </div>
      </Fragment>
    );
  }
}
