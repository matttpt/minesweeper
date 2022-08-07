export class Board {

  // Creates a new board. All cells are covered, and no cells are mined
  // or flagged.
  constructor(height, width) {
    const rows = new Array(height);
    for (let i = 0; i < height; i++) {
      const row = new Array(width);
      for (let j = 0; j < width; j++) {
        row[j] = {
          isMined: false,
          isFlagged: false,
          isCovered: true,
          neighboringMines: 0,
        };
      }
      rows[i] = row;
    }
    this.rows = rows;
  }

  height() {
    return this.rows.length;
  }

  width() {
    return this.rows[0].length;
  }

  get(row, col) {
    return this.rows[row][col];
  }

  // Makes a deep copy of the board.
  clone() {
    const cloned = Object.create(Board.prototype);
    cloned.rows = this.rows.map(row => row.map(cell => ({ ...cell })));
    return cloned;
  }

  // Places mines on the board. This is done by randomly choosing a cell
  // and placing a mine there if one is not already present, until the
  // requested number of mines has been placed. Thus, the count must not
  // exceed the board's size (or this method will never terminate).
  placeMines(count) {
    for (let i = 0; i < count; i++) {
      for (;;) {
        const row = Math.floor(Math.random() * this.rows.length);
        const col = Math.floor(Math.random() * this.rows[0].length);
        const cell = this.get(row, col);
        if (!cell.isMined) {
          cell.isMined = true;
          break;
        }
      }
    }
    this.computeNeighborCounts();
  }

  computeNeighborCounts() {
    for (let row = 0; row < this.rows.length; row++) {
      for (let col = 0; col < this.rows[0].length; col++) {
        if (this.get(row, col).isMined) {
          this.forEachNeighbor(
            row,
            col,
            (r, c, cell) => cell.neighboringMines++,
          );
        }
      }
    }
  }

  uncoverMines() {
    for (const row of this.rows) {
      for (const cell of row) {
        if (cell.isMined) {
          cell.isCovered = false;
        }
      }
    }
  }

  markMines() {
    for (const row of this.rows) {
      for (const cell of row) {
        if (cell.isMined) {
          cell.isFlagged = true;
        }
      }
    }
  }

  countCovered() {
    let count = 0;
    for (const row of this.rows) {
      for (const cell of row) {
        if (cell.isCovered) {
          count++;
        }
      }
    }
    return count;
  }

  countFlagged() {
    let count = 0;
    for (const row of this.rows) {
      for (const cell of row) {
        if (cell.isCovered && cell.isFlagged) {
          count++;
        }
      }
    }
    return count;
  }

  // Handles a click on a cell, returning whether a mine was hit.
  handleCellClick(row, col) {
    if (this.get(row, col).isCovered) {
      return this.uncoverCell(row, col);
    } else {
      return this.uncoverNeighbors(row, col);
    }
  }

  // Uncovers a single cell, returning whether a mine was hit. If the
  // cell turns out to have no neighboring mines, then this also
  // recursively uncovers all of its neighbors. (This is how a single
  // click can reveal a large empty chunk of the board.)
  uncoverCell(row, col) {
    const cell = this.get(row, col);
    let hitMine = false;

    if (cell.isCovered) {
      cell.isCovered = false;
      if (cell.isMined) {
        hitMine = true;
      } else if (cell.neighboringMines === 0) {
        const toProcess = [[row, col]];
        let next = toProcess.pop();
        while (next) {
          const [row, col] = next;
          this.forEachNeighbor(
            row,
            col,
            (r, c, neighborCell) => {
              if (neighborCell.isCovered) {
                neighborCell.isCovered = false;
                if (neighborCell.neighboringMines === 0) {
                  toProcess.push([r, c]);
                }
              }
            },
          );
          next = toProcess.pop();
        }
      }
    }

    return hitMine;
  }

  // Uncovers the unflagged neighbors of a cell if enough neighbors are
  // flagged to make this safe (assuming that the flags are placed
  // correctly). Returns whether a mine was hit.
  uncoverNeighbors(row, col) {
    let flaggedNeighborCount = 0;
    this.forEachNeighbor(
      row,
      col,
      (r, c, neighborCell) => {
        if (neighborCell.isCovered && neighborCell.isFlagged) {
          flaggedNeighborCount++;
        }
      },
    );

    let hitMine = false;
    if (flaggedNeighborCount >= this.get(row, col).neighboringMines) {
      // Assuming that the player has placed flags correctly, it's safe
      // (by process of elimination) to uncover all unflagged neighbors.
      this.forEachNeighbor(
        row,
        col,
        (r, c, neighborCell) => {
          if (neighborCell.isCovered && !neighborCell.isFlagged) {
            hitMine = hitMine || this.uncoverCell(r, c);
          }
        },
      );
    }

    return hitMine;
  }

  forEachNeighbor(centerRow, centerCol, f) {
    const startRow = Math.max(centerRow - 1, 0);
    const startCol = Math.max(centerCol - 1, 0);
    const endRow = Math.min(centerRow + 2, this.rows.length);
    const endCol = Math.min(centerCol + 2, this.rows[0].length);
    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        if (row !== centerRow || col !== centerCol) {
          f(row, col, this.get(row, col));
        }
      }
    }
  }
}
