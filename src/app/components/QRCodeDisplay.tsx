import React from 'react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

// A deterministic visual QR code representation
export function QRCodeDisplay({ value, size = 200 }: QRCodeDisplayProps) {
  // Create a deterministic grid based on the value
  const hash = (str: string) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  };

  const gridSize = 21;
  const cellSize = size / gridSize;
  const seed = hash(value);

  const isBlack = (row: number, col: number): boolean => {
    // Corner squares (finder patterns)
    const inCorner = (r: number, c: number) =>
      (r >= 0 && r <= 6 && c >= 0 && c <= 6) ||
      (r >= 0 && r <= 6 && c >= gridSize - 7 && c <= gridSize - 1) ||
      (r >= gridSize - 7 && r <= gridSize - 1 && c >= 0 && c <= 6);

    if (inCorner(row, col)) {
      const inBorder = (r: number, c: number, startR: number, startC: number) =>
        (r === startR || r === startR + 6 || c === startC || c === startC + 6) &&
        r >= startR && r <= startR + 6 && c >= startC && c <= startC + 6;
      const inInner = (r: number, c: number, startR: number, startC: number) =>
        r >= startR + 2 && r <= startR + 4 && c >= startC + 2 && c <= startC + 4;

      if (inBorder(row, col, 0, 0) || inInner(row, col, 0, 0)) return true;
      if (inBorder(row, col, 0, gridSize - 7) || inInner(row, col, 0, gridSize - 7)) return true;
      if (inBorder(row, col, gridSize - 7, 0) || inInner(row, col, gridSize - 7, 0)) return true;
      return false;
    }

    // Timing patterns
    if (row === 6 && col > 7 && col < gridSize - 7) return col % 2 === 0;
    if (col === 6 && row > 7 && row < gridSize - 7) return row % 2 === 0;

    // Data modules (pseudo-random based on seed)
    const cellSeed = seed ^ (row * 7919 + col * 6271);
    return ((cellSeed >> ((row + col) % 8)) & 1) === 1;
  };

  const cells: { x: number; y: number; black: boolean }[] = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      cells.push({
        x: col * cellSize,
        y: row * cellSize,
        black: isBlack(row, col),
      });
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <rect width={size} height={size} fill="white" />
      {cells.map((cell, i) =>
        cell.black ? (
          <rect
            key={i}
            x={cell.x}
            y={cell.y}
            width={cellSize}
            height={cellSize}
            fill="#1C1C1C"
          />
        ) : null
      )}
    </svg>
  );
}
