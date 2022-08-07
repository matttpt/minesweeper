import React, { Component } from "react";
import { Game } from "./Game";

const MAX_HEIGHT = 50;
const MAX_WIDTH = 50;

export class Panel extends Component {
  constructor(props) {
    super(props);

    // Our initial configuration reflects the traditional 9 by 9,
    // 10-mine "beginner" mode.
    this.state = { 
      gameKey: 0,
      height: 9,
      width: 9,
      mineCount: 10,
      inProgress: false,
    };
  }

  handleStart(e) {
    e.preventDefault();
    this.setState({
      inProgress: true,
    });
  }

  handleChange(e) {
    this.setState((state, _props) => {
      const newState = {
        height: state.height,
        width: state.width,
        mineCount: state.mineCount,
      };
      newState[e.target.name] = Number(e.target.value);
      newState.height =
        Math.max(Math.min(newState.height, MAX_HEIGHT), 1);
      newState.width = Math.max(Math.min(newState.width, MAX_WIDTH), 1);
      const cellCount = newState.height * newState.width;
      newState.mineCount = Math.max(
        Math.min(newState.mineCount, cellCount),
        0,
      );
      return newState;
    });
  }

  handleStartFresh() {
    this.setState((state, _props) => ({
      gameKey: state.gameKey + 1,
      inProgress: true,
    }));
  }

  handleReconfigure() {
    this.setState((state, _props) => ({
      gameKey: state.gameKey + 1,
      inProgress: false,
    }));
  }

  render() {
    if (this.state.inProgress) {
      return (
        <Game
          key={this.state.gameKey}
          initialHeight={this.state.height}
          initialWidth={this.state.width}
          mineCount={this.state.mineCount}
          onStartFresh={() => this.handleStartFresh()}
          onReconfigure={() => this.handleReconfigure()}
        />
      );
    } else {
      return (
        <div className="wrapper">
          <p>
            Good, old-fashioned minesweeper. Left-click to clear a cell,
            right-click to flag. Clear all unmined cells to win.
          </p>
          <p>
            If you’re playing a large board on a small screen, you may
            have to scroll to see the whole board.
          </p>
          <p>
            Good luck and have fun!
          </p>
          <h2>Configure your game</h2>
          <form onSubmit={e => this.handleStart(e)}>
            <div className="form-grid">
              <label htmlFor="start-form-width">Width:</label>
              <input
                type="number" name="width"
                onChange={e => this.handleChange(e)}
                value={this.state.width} id="start-form-width"
              />
              <div>(maximum of {MAX_WIDTH})</div>
              <label htmlFor="start-form-height">Height:</label>
              <input
                type="number" name="height"
                onChange={e => this.handleChange(e)}
                value={this.state.height} id="start-form-height"
              />
              <div>(maximum of {MAX_HEIGHT})</div>
              <label htmlFor="start-form-mine-count">Number of mines:</label>
              <input
                type="number" name="mineCount"
                onChange={e => this.handleChange(e)}
                value={this.state.mineCount} id="start-form-mine-count"
              />
              <div>
                (maximum of {this.state.width * this.state.height})
              </div>
            </div>
            <div className="form-buttons">
              <input type="submit" value="Start sweeping!" />
            </div>
          </form>
        </div>
      );
    }
  }
}
