import type { PlacedElement, ElementType } from "./types";
import { CELL, ELEMENT_SIZE, GRID_W, GRID_H } from "./types";

const GRID_COLOR = "#d1d5db";
const BG_COLOR = "#f9fafb";
const STROKE = "#374151";

function canvasRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawSymbol(
  ctx: CanvasRenderingContext2D,
  type: ElementType,
  cx: number,
  cy: number,
  size: number,
  rotationDeg = 0,
) {
  ctx.save();
  // Coordonnées en espace 64×64, centrées sur (cx, cy)
  ctx.translate(cx, cy);
  ctx.rotate((rotationDeg * Math.PI) / 180);
  ctx.scale(size / 64, size / 64);
  ctx.translate(-32, -32);
  ctx.strokeStyle = STROKE;
  ctx.fillStyle = STROKE;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  switch (type) {
    case "point_lumineux": {
      // sym-pl
      ctx.beginPath();
      ctx.arc(32, 32, 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(14, 32);
      ctx.lineTo(50, 32);
      ctx.moveTo(32, 14);
      ctx.lineTo(32, 50);
      ctx.stroke();
      break;
    }
    case "interrupteur": {
      // sym-inter
      ctx.beginPath();
      ctx.arc(20, 32, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(44, 32, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(26, 32);
      ctx.lineTo(42, 22);
      ctx.stroke();
      break;
    }
    case "prise": {
      // sym-prise
      canvasRoundRect(ctx, 12, 12, 40, 40, 6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(26, 30, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(38, 30, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(32, 40);
      ctx.lineTo(32, 46);
      ctx.moveTo(28, 46);
      ctx.lineTo(36, 46);
      ctx.stroke();
      break;
    }
    case "tableau": {
      // sym-tableau
      canvasRoundRect(ctx, 14, 10, 36, 44, 4);
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 18, 24, 6);
      ctx.strokeRect(20, 28, 24, 18);
      ctx.beginPath();
      ctx.arc(46, 14, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "va_et_vient": {
      ctx.beginPath();
      ctx.arc(8, 32, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(12, 32);
      ctx.lineTo(56, 18);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(12, 32);
      ctx.lineTo(56, 46);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(56, 18, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(56, 46, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "rj45": {
      // sym-rj45
      canvasRoundRect(ctx, 12, 12, 40, 40, 6);
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeRect(22, 26, 20, 14);
      ctx.beginPath();
      ctx.moveTo(24, 26);
      ctx.lineTo(24, 20);
      ctx.lineTo(40, 20);
      ctx.lineTo(40, 26);
      ctx.stroke();
      break;
    }
    case "boite_derivation": {
      // sym-boite-deriv
      ctx.strokeRect(16, 16, 32, 32);
      ctx.beginPath();
      ctx.arc(32, 32, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }

  ctx.restore();
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  cell: number,
) {
  ctx.save();
  ctx.strokeStyle = GRID_COLOR;
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= w; x += cell) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += cell) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();
}

export function exportToPng(elements: PlacedElement[]): void {
  const margin = CELL * 2;

  let minX = GRID_W,
    minY = GRID_H,
    maxX = 0,
    maxY = 0;

  if (elements.length === 0) {
    minX = 0;
    minY = 0;
    maxX = GRID_W;
    maxY = GRID_H;
  } else {
    for (const el of elements) {
      if (el.x < minX) minX = el.x;
      if (el.y < minY) minY = el.y;
      if (el.x + ELEMENT_SIZE > maxX) maxX = el.x + ELEMENT_SIZE;
      if (el.y + ELEMENT_SIZE > maxY) maxY = el.y + ELEMENT_SIZE;
    }
  }

  const left = Math.max(0, minX - margin);
  const top = Math.max(0, minY - margin);
  const right = Math.min(GRID_W, maxX + margin);
  const bottom = Math.min(GRID_H, maxY + margin);
  const w = right - left;
  const h = bottom - top;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(-left, -top);
  drawGrid(ctx, GRID_W, GRID_H, CELL);
  for (const el of elements) {
    drawSymbol(
      ctx,
      el.type,
      el.x + ELEMENT_SIZE / 2,
      el.y + ELEMENT_SIZE / 2,
      ELEMENT_SIZE,
      el.rotation ?? 0,
    );
  }
  ctx.restore();

  const link = document.createElement("a");
  link.download = "plan-electrique.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
