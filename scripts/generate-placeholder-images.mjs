#!/usr/bin/env node
/**
 * Generates the local SVG placeholder artwork in `public/images`.
 *
 * The experiment must not embed external images, so every motif is drawn here
 * as plain geometry in the brand palette. The shapes are generic on purpose:
 * they must not resemble the product design of any existing luggage brand.
 *
 * Re-run with `pnpm run images:generate`. See IMAGE-BRIEFING.md for the list of
 * motifs that should later be replaced with real photography.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "images");

const PALETTE = {
  cream: "#f4efe6",
  creamDeep: "#ebe3d6",
  ink: "#16233a",
  brass: "#a8853f",
  leather: "#6b4a2f",
  line: "#2a3852",
};

const COLORS = {
  nachtblau: "#1b2a41",
  sand: "#c8b394",
  graphit: "#3f4247",
  lederbraun: "#6b4a2f",
  burgund: "#5c2230",
};

const W = 1200;
const H = 1200;

/** Slightly lighter / darker variants for simple shading. */
function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const r = clamp(((n >> 16) & 255) + amount);
  const g = clamp(((n >> 8) & 255) + amount);
  const b = clamp((n & 255) + amount);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function frame(inner, { bg = PALETTE.cream } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  <rect width="${W}" height="${H}" fill="${bg}"/>
${inner}
</svg>
`;
}

/** Soft contact shadow under an object. */
function shadow(cx, cy, rx, ry, opacity = 0.16) {
  return `  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${PALETTE.ink}" opacity="${opacity}"/>`;
}

function ribs(x, y, w, h, color, count = 5) {
  const step = w / (count + 1);
  const lines = [];
  for (let i = 1; i <= count; i += 1) {
    const lx = x + step * i;
    lines.push(
      `  <line x1="${lx.toFixed(1)}" y1="${y + 26}" x2="${lx.toFixed(1)}" y2="${y + h - 26}" stroke="${shade(color, -26)}" stroke-width="7" stroke-linecap="round" opacity="0.85"/>`,
    );
  }
  return lines.join("\n");
}

function wheelPair(cx, cy, color, scale = 1) {
  const r = 26 * scale;
  const gap = 30 * scale;
  return [
    `  <rect x="${cx - gap - r}" y="${cy - r - 16 * scale}" width="${(gap + r) * 2}" height="${20 * scale}" rx="${8 * scale}" fill="${shade(color, -40)}"/>`,
    `  <circle cx="${cx - gap}" cy="${cy}" r="${r}" fill="${PALETTE.ink}"/>`,
    `  <circle cx="${cx - gap}" cy="${cy}" r="${r * 0.45}" fill="${PALETTE.brass}"/>`,
    `  <circle cx="${cx + gap}" cy="${cy}" r="${r}" fill="${PALETTE.ink}"/>`,
    `  <circle cx="${cx + gap}" cy="${cy}" r="${r * 0.45}" fill="${PALETTE.brass}"/>`,
  ].join("\n");
}

function telescopicHandle(cx, topY, bottomY, width = 210) {
  const half = width / 2;
  return [
    `  <rect x="${cx - half}" y="${topY}" width="${width}" height="26" rx="13" fill="${PALETTE.ink}"/>`,
    `  <rect x="${cx - half + 18}" y="${topY + 20}" width="22" height="${bottomY - topY - 20}" rx="9" fill="${shade(PALETTE.ink, 34)}"/>`,
    `  <rect x="${cx + half - 40}" y="${topY + 20}" width="22" height="${bottomY - topY - 20}" rx="9" fill="${shade(PALETTE.ink, 34)}"/>`,
  ].join("\n");
}

/* ------------------------------------------------------------------ motifs */

function heroCase(color) {
  const bodyX = 350;
  const bodyY = 330;
  const bodyW = 500;
  const bodyH = 640;
  return frame(
    [
      shadow(600, 1010, 260, 34),
      telescopicHandle(600, 190, 340),
      `  <rect x="${bodyX}" y="${bodyY}" width="${bodyW}" height="${bodyH}" rx="58" fill="${color}"/>`,
      `  <rect x="${bodyX}" y="${bodyY}" width="${bodyW}" height="${bodyH}" rx="58" fill="none" stroke="${shade(color, -46)}" stroke-width="6"/>`,
      ribs(bodyX, bodyY, bodyW, bodyH, color, 5),
      // corner protectors
      `  <path d="M${bodyX + 8} ${bodyY + 90} v-38 a44 44 0 0 1 44-44 h38" fill="none" stroke="${PALETTE.brass}" stroke-width="10" stroke-linecap="round"/>`,
      `  <path d="M${bodyX + bodyW - 8} ${bodyY + 90} v-38 a44 44 0 0 0-44-44 h-38" fill="none" stroke="${PALETTE.brass}" stroke-width="10" stroke-linecap="round"/>`,
      // side handle + lock
      `  <rect x="${bodyX + bodyW - 30}" y="${bodyY + 250}" width="26" height="120" rx="13" fill="${shade(color, -50)}"/>`,
      `  <rect x="${bodyX + bodyW / 2 - 40}" y="${bodyY + bodyH - 118}" width="80" height="46" rx="12" fill="${PALETTE.brass}"/>`,
      `  <circle cx="${bodyX + bodyW / 2}" cy="${bodyY + bodyH - 95}" r="9" fill="${shade(PALETTE.brass, -60)}"/>`,
      wheelPair(bodyX + 108, bodyY + bodyH + 20, color),
      wheelPair(bodyX + bodyW - 108, bodyY + bodyH + 20, color),
    ].join("\n"),
  );
}

function openCase(color) {
  const half = (x) =>
    [
      `  <rect x="${x}" y="300" width="420" height="600" rx="46" fill="${color}"/>`,
      `  <rect x="${x + 26}" y="326" width="368" height="548" rx="30" fill="${PALETTE.creamDeep}"/>`,
    ].join("\n");
  return frame(
    [
      shadow(600, 950, 420, 30, 0.12),
      half(120),
      // left interior: crossing straps
      `  <rect x="${146 + 40}" y="440" width="316" height="26" rx="13" fill="${PALETTE.leather}" opacity="0.9"/>`,
      `  <rect x="${146 + 40}" y="700" width="316" height="26" rx="13" fill="${PALETTE.leather}" opacity="0.9"/>`,
      `  <rect x="${146 + 180}" y="380" width="26" height="440" rx="13" fill="${PALETTE.leather}" opacity="0.55"/>`,
      `  <rect x="${146 + 160}" y="560" width="66" height="46" rx="10" fill="${PALETTE.brass}"/>`,
      half(660),
      // right interior: mesh pocket
      `  <rect x="${686 + 40}" y="400" width="316" height="440" rx="18" fill="none" stroke="${PALETTE.ink}" stroke-width="5" opacity="0.5"/>`,
      ...Array.from({ length: 8 }, (_, i) => {
        const y = 430 + i * 52;
        return `  <line x1="${686 + 46}" y1="${y}" x2="${686 + 350}" y2="${y}" stroke="${PALETTE.ink}" stroke-width="3" opacity="0.28"/>`;
      }),
      ...Array.from({ length: 6 }, (_, i) => {
        const x = 686 + 60 + i * 52;
        return `  <line x1="${x}" y1="405" x2="${x}" y2="835" stroke="${PALETTE.ink}" stroke-width="3" opacity="0.28"/>`;
      }),
      // hinge
      `  <rect x="588" y="330" width="24" height="540" rx="12" fill="${shade(color, -54)}"/>`,
    ].join("\n"),
  );
}

function wheelDetail(color) {
  return frame(
    [
      shadow(600, 1000, 340, 30, 0.12),
      `  <rect x="230" y="150" width="740" height="520" rx="60" fill="${color}"/>`,
      ribs(230, 150, 740, 520, color, 6),
      `  <rect x="230" y="640" width="740" height="60" rx="20" fill="${shade(color, -44)}"/>`,
      wheelPair(430, 800, color, 2.1),
      wheelPair(770, 800, color, 2.1),
      `  <path d="M300 940 h600" stroke="${PALETTE.ink}" stroke-width="4" opacity="0.18"/>`,
    ].join("\n"),
  );
}

function handleDetail(color) {
  return frame(
    [
      `  <rect x="300" y="120" width="600" height="40" rx="20" fill="${PALETTE.ink}"/>`,
      `  <rect x="360" y="150" width="34" height="470" rx="15" fill="${shade(PALETTE.ink, 40)}"/>`,
      `  <rect x="806" y="150" width="34" height="470" rx="15" fill="${shade(PALETTE.ink, 40)}"/>`,
      // height notches
      ...[250, 340, 430].flatMap((y) => [
        `  <line x1="352" y1="${y}" x2="402" y2="${y}" stroke="${PALETTE.brass}" stroke-width="6" stroke-linecap="round"/>`,
        `  <line x1="798" y1="${y}" x2="848" y2="${y}" stroke="${PALETTE.brass}" stroke-width="6" stroke-linecap="round"/>`,
      ]),
      shadow(600, 1090, 300, 26, 0.1),
      `  <rect x="260" y="600" width="680" height="440" rx="54" fill="${color}"/>`,
      `  <rect x="336" y="590" width="82" height="46" rx="16" fill="${PALETTE.brass}"/>`,
      `  <rect x="782" y="590" width="82" height="46" rx="16" fill="${PALETTE.brass}"/>`,
      ribs(260, 600, 680, 440, color, 5),
    ].join("\n"),
  );
}

function sideView(color) {
  return frame(
    [
      shadow(600, 1010, 170, 28),
      telescopicHandle(600, 210, 350, 150),
      `  <rect x="470" y="340" width="260" height="630" rx="52" fill="${shade(color, -14)}"/>`,
      `  <rect x="470" y="340" width="260" height="630" rx="52" fill="none" stroke="${shade(color, -50)}" stroke-width="6"/>`,
      `  <line x1="600" y1="366" x2="600" y2="944" stroke="${shade(color, -40)}" stroke-width="8" stroke-linecap="round"/>`,
      `  <rect x="452" y="560" width="26" height="140" rx="13" fill="${shade(color, -50)}"/>`,
      wheelPair(600, 995, color, 0.9),
    ].join("\n"),
  );
}

function nestedSet(colors) {
  const boxes = [
    { x: 190, y: 520, w: 250, h: 430 },
    { x: 470, y: 400, w: 300, h: 550 },
    { x: 800, y: 300, w: 330, h: 650 },
  ];
  return frame(
    [
      shadow(600, 980, 470, 30, 0.13),
      ...boxes.map((b, i) => {
        const c = colors[i % colors.length];
        return [
          telescopicHandle(b.x + b.w / 2, b.y - 130, b.y + 6, b.w * 0.5),
          `  <rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="42" fill="${c}"/>`,
          `  <rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="42" fill="none" stroke="${shade(c, -46)}" stroke-width="5"/>`,
          ribs(b.x, b.y, b.w, b.h, c, 4),
          wheelPair(b.x + 58, b.y + b.h + 14, c, 0.7),
          wheelPair(b.x + b.w - 58, b.y + b.h + 14, c, 0.7),
        ].join("\n");
      }),
    ].join("\n"),
  );
}

function stackedSet(colors) {
  return frame(
    [
      shadow(600, 990, 300, 28, 0.13),
      `  <rect x="330" y="250" width="540" height="700" rx="56" fill="${colors[0]}"/>`,
      ribs(330, 250, 540, 700, colors[0], 5),
      `  <rect x="330" y="250" width="540" height="700" rx="56" fill="none" stroke="${shade(colors[0], -46)}" stroke-width="6"/>`,
      `  <path d="M410 520 h380" stroke="${shade(colors[0], -50)}" stroke-width="6" stroke-dasharray="18 14" stroke-linecap="round" opacity="0.8"/>`,
      `  <rect x="420" y="560" width="360" height="340" rx="38" fill="${colors[1] ?? colors[0]}" opacity="0.95"/>`,
      `  <rect x="420" y="560" width="360" height="340" rx="38" fill="none" stroke="${shade(colors[1] ?? colors[0], -46)}" stroke-width="5"/>`,
      `  <text x="600" y="1090" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="${PALETTE.ink}" opacity="0.35">ineinander verstaut</text>`,
    ].join("\n"),
  );
}

function softBag(color) {
  return frame(
    [
      shadow(600, 940, 330, 30),
      `  <path d="M250 500 q0-70 90-70 h520 q90 0 90 70 v300 q0 110-120 110 H370 q-120 0-120-110 z" fill="${color}"/>`,
      `  <path d="M250 500 q0-70 90-70 h520 q90 0 90 70 v300 q0 110-120 110 H370 q-120 0-120-110 z" fill="none" stroke="${shade(color, -50)}" stroke-width="6"/>`,
      `  <path d="M250 620 h700" stroke="${shade(color, -40)}" stroke-width="8" opacity="0.6"/>`,
      // leather-bound handles
      `  <path d="M450 440 q0-150 150-150 q150 0 150 150" fill="none" stroke="${PALETTE.leather}" stroke-width="20" stroke-linecap="round"/>`,
      `  <rect x="430" y="430" width="60" height="34" rx="12" fill="${PALETTE.leather}"/>`,
      `  <rect x="710" y="430" width="60" height="34" rx="12" fill="${PALETTE.leather}"/>`,
      // reinforced base
      `  <path d="M280 860 h640" stroke="${PALETTE.leather}" stroke-width="26" stroke-linecap="round" opacity="0.9"/>`,
      `  <rect x="560" y="600" width="80" height="44" rx="12" fill="${PALETTE.brass}"/>`,
    ].join("\n"),
  );
}

function openSoftBag(color) {
  return frame(
    [
      shadow(600, 930, 320, 28, 0.12),
      `  <path d="M250 520 q0-60 90-60 h520 q90 0 90 60 v300 q0 100-120 100 H370 q-120 0-120-100 z" fill="${color}"/>`,
      `  <path d="M290 520 q310-120 620 0 v40 q-310-110-620 0 z" fill="${PALETTE.creamDeep}"/>`,
      `  <rect x="330" y="560" width="240" height="230" rx="18" fill="${PALETTE.creamDeep}" opacity="0.9"/>`,
      `  <rect x="630" y="560" width="240" height="230" rx="18" fill="${PALETTE.creamDeep}" opacity="0.65"/>`,
      `  <text x="450" y="690" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="${PALETTE.ink}" opacity="0.4">Schuhfach</text>`,
      `  <path d="M280 850 h640" stroke="${PALETTE.leather}" stroke-width="24" stroke-linecap="round" opacity="0.9"/>`,
    ].join("\n"),
  );
}

function leatherHandleDetail(color) {
  return frame(
    [
      `  <rect x="180" y="620" width="840" height="330" rx="40" fill="${color}"/>`,
      `  <path d="M180 700 h840" stroke="${shade(color, -40)}" stroke-width="8" opacity="0.6"/>`,
      `  <path d="M380 600 q0-230 220-230 q220 0 220 230" fill="none" stroke="${PALETTE.leather}" stroke-width="34" stroke-linecap="round"/>`,
      `  <rect x="340" y="576" width="96" height="56" rx="18" fill="${shade(PALETTE.leather, -30)}"/>`,
      `  <rect x="764" y="576" width="96" height="56" rx="18" fill="${shade(PALETTE.leather, -30)}"/>`,
      ...[0, 1, 2].map(
        (i) =>
          `  <circle cx="${366 + i * 30}" cy="604" r="6" fill="${PALETTE.brass}"/>` +
          `<circle cx="${790 + i * 30}" cy="604" r="6" fill="${PALETTE.brass}"/>`,
      ),
    ].join("\n"),
  );
}

function smallBox(color) {
  return frame(
    [
      shadow(600, 900, 250, 26),
      `  <rect x="360" y="470" width="480" height="400" rx="40" fill="${color}"/>`,
      `  <rect x="360" y="470" width="480" height="400" rx="40" fill="none" stroke="${shade(color, -48)}" stroke-width="6"/>`,
      `  <path d="M360 610 h480" stroke="${shade(color, -46)}" stroke-width="8"/>`,
      `  <rect x="560" y="586" width="80" height="46" rx="12" fill="${PALETTE.brass}"/>`,
      `  <path d="M480 470 q120-120 240 0" fill="none" stroke="${PALETTE.leather}" stroke-width="24" stroke-linecap="round"/>`,
    ].join("\n"),
  );
}

function openSmallBox(color) {
  return frame(
    [
      shadow(600, 930, 260, 26, 0.12),
      `  <path d="M340 420 h520 v-120 a40 40 0 0 0-40-40 H380 a40 40 0 0 0-40 40 z" fill="${shade(color, -18)}"/>`,
      `  <rect x="340" y="440" width="520" height="440" rx="38" fill="${color}"/>`,
      `  <rect x="374" y="474" width="452" height="372" rx="24" fill="#efe7d8"/>`,
      `  <rect x="400" y="500" width="180" height="150" rx="14" fill="#e2d7c2"/>`,
      `  <rect x="606" y="500" width="196" height="150" rx="14" fill="#e2d7c2"/>`,
      `  <rect x="400" y="676" width="402" height="146" rx="14" fill="#e2d7c2"/>`,
    ].join("\n"),
  );
}

function insertTray(color) {
  return frame(
    [
      shadow(600, 940, 280, 26, 0.12),
      `  <rect x="280" y="420" width="640" height="420" rx="34" fill="${shade(color, -16)}"/>`,
      `  <rect x="312" y="452" width="576" height="356" rx="22" fill="#efe7d8"/>`,
      ...[0, 1, 2].map(
        (i) =>
          `  <rect x="${336 + i * 190}" y="480" width="166" height="300" rx="16" fill="#e2d7c2" stroke="${PALETTE.ink}" stroke-width="3" stroke-opacity="0.14"/>`,
      ),
      `  <path d="M500 400 q100-70 200 0" fill="none" stroke="${PALETTE.leather}" stroke-width="18" stroke-linecap="round"/>`,
    ].join("\n"),
  );
}

function laptopCompartment(color) {
  return frame(
    [
      shadow(600, 990, 300, 28, 0.12),
      `  <rect x="300" y="250" width="600" height="700" rx="52" fill="${color}"/>`,
      `  <rect x="340" y="300" width="520" height="420" rx="26" fill="${PALETTE.creamDeep}"/>`,
      `  <rect x="378" y="340" width="444" height="330" rx="14" fill="${shade(PALETTE.ink, 60)}"/>`,
      `  <rect x="400" y="362" width="400" height="256" rx="8" fill="${PALETTE.creamDeep}" opacity="0.5"/>`,
      `  <path d="M340 750 h520" stroke="${shade(color, -44)}" stroke-width="8" stroke-linecap="round"/>`,
      `  <rect x="360" y="790" width="230" height="110" rx="16" fill="${shade(color, -22)}"/>`,
      `  <rect x="614" y="790" width="230" height="110" rx="16" fill="${shade(color, -22)}"/>`,
      `  <text x="600" y="1070" text-anchor="middle" font-family="Georgia, serif" font-size="32" fill="${PALETTE.ink}" opacity="0.35">gepolstertes Notebookfach</text>`,
    ].join("\n"),
  );
}

function slimHandleDetail(color) {
  return frame(
    [
      `  <rect x="380" y="150" width="440" height="34" rx="17" fill="${PALETTE.ink}"/>`,
      `  <rect x="432" y="176" width="26" height="440" rx="12" fill="${shade(PALETTE.ink, 40)}"/>`,
      `  <rect x="742" y="176" width="26" height="440" rx="12" fill="${shade(PALETTE.ink, 40)}"/>`,
      `  <rect x="300" y="600" width="600" height="420" rx="50" fill="${color}"/>`,
      `  <rect x="404" y="586" width="82" height="42" rx="14" fill="${PALETTE.brass}"/>`,
      `  <rect x="714" y="586" width="82" height="42" rx="14" fill="${PALETTE.brass}"/>`,
      ribs(300, 600, 600, 420, color, 4),
      `  <text x="600" y="1110" text-anchor="middle" font-family="Georgia, serif" font-size="32" fill="${PALETTE.ink}" opacity="0.35">schmaler Griff</text>`,
    ].join("\n"),
  );
}

/* --------------------------------------------------- editorial / workshop */

function workbench() {
  return frame(
    [
      `  <rect x="0" y="700" width="${W}" height="26" fill="${PALETTE.leather}" opacity="0.5"/>`,
      `  <rect x="120" y="726" width="960" height="300" rx="12" fill="${PALETTE.leather}" opacity="0.28"/>`,
      // leather offcuts
      `  <path d="M200 620 l180-40 40 120 -180 40 z" fill="${PALETTE.leather}" opacity="0.85"/>`,
      `  <path d="M420 640 l160 20 -20 100 -160-20 z" fill="${shade(PALETTE.leather, 40)}" opacity="0.8"/>`,
      // tools
      `  <rect x="640" y="640" width="240" height="18" rx="9" fill="${PALETTE.ink}"/>`,
      `  <rect x="860" y="626" width="70" height="46" rx="10" fill="${PALETTE.brass}"/>`,
      `  <circle cx="700" cy="596" r="30" fill="none" stroke="${PALETTE.ink}" stroke-width="10"/>`,
      `  <path d="M718 616 l70 60" stroke="${PALETTE.ink}" stroke-width="12" stroke-linecap="round"/>`,
      // hanging tools on wall
      `  <path d="M180 200 v200 M300 200 v260 M420 200 v170" stroke="${PALETTE.ink}" stroke-width="10" stroke-linecap="round" opacity="0.5"/>`,
      `  <path d="M120 200 h420" stroke="${PALETTE.ink}" stroke-width="8" opacity="0.35"/>`,
      // case in progress
      `  <rect x="760" y="380" width="300" height="240" rx="30" fill="${COLORS.nachtblau}" opacity="0.9"/>`,
      ...Array.from(
        { length: 4 },
        (_, i) =>
          `  <line x1="${800 + i * 60}" y1="404" x2="${800 + i * 60}" y2="596" stroke="${shade(COLORS.nachtblau, -30)}" stroke-width="6" stroke-linecap="round"/>`,
      ),
      `  <text x="600" y="1120" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="${PALETTE.ink}" opacity="0.3">Werkbank</text>`,
    ].join("\n"),
    { bg: PALETTE.creamDeep },
  );
}

function repairHands() {
  return frame(
    [
      `  <rect x="180" y="560" width="840" height="330" rx="40" fill="${COLORS.nachtblau}"/>`,
      ...Array.from(
        { length: 5 },
        (_, i) =>
          `  <line x1="${300 + i * 140}" y1="590" x2="${300 + i * 140}" y2="860" stroke="${shade(COLORS.nachtblau, -30)}" stroke-width="8" stroke-linecap="round"/>`,
      ),
      // stylised hands, no faces
      `  <path d="M300 520 q-60 40-40 120 q10 40 60 40 h120 q40 0 40-40 v-90 q0-40-40-40 z" fill="${PALETTE.leather}" opacity="0.85"/>`,
      `  <path d="M760 520 q60 40 40 120 q-10 40-60 40 H620 q-40 0-40-40 v-90 q0-40 40-40 z" fill="${PALETTE.leather}" opacity="0.85"/>`,
      `  <rect x="520" y="600" width="160" height="60" rx="16" fill="${PALETTE.brass}"/>`,
      `  <text x="600" y="1040" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="${PALETTE.ink}" opacity="0.3">Reparatur in der Werkstatt</text>`,
    ].join("\n"),
    { bg: PALETTE.creamDeep },
  );
}

function luggageTags() {
  const tag = (x, y, rot, fill) =>
    `  <g transform="translate(${x} ${y}) rotate(${rot})">
    <path d="M0 0 h180 a16 16 0 0 1 16 16 v240 a16 16 0 0 1-16 16 H0 a16 16 0 0 1-16-16 V16 A16 16 0 0 1 0 0 z" fill="${fill}"/>
    <circle cx="90" cy="40" r="16" fill="${PALETTE.creamDeep}"/>
    <path d="M28 110 h124 M28 160 h124 M28 210 h84" stroke="${PALETTE.creamDeep}" stroke-width="8" stroke-linecap="round" opacity="0.7"/>
  </g>`;
  return frame(
    [
      `  <path d="M120 180 q480 120 960 -40" stroke="${PALETTE.ink}" stroke-width="6" fill="none" opacity="0.4"/>`,
      tag(200, 260, -8, PALETTE.leather),
      tag(500, 300, 4, shade(PALETTE.leather, 40)),
      tag(800, 250, -3, COLORS.nachtblau),
      `  <text x="600" y="820" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="${PALETTE.ink}" opacity="0.3">Gepäckanhänger aus 27 Jahren</text>`,
    ].join("\n"),
    { bg: PALETTE.cream },
  );
}

function stackedBoxes() {
  const box = (x, y, w, h) =>
    [
      `  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${shade(PALETTE.leather, 96)}"/>`,
      `  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="none" stroke="${shade(PALETTE.leather, 20)}" stroke-width="5"/>`,
      `  <path d="M${x + w / 2} ${y} v${h}" stroke="${shade(PALETTE.leather, 20)}" stroke-width="5" opacity="0.5"/>`,
      `  <rect x="${x + w / 2 - 60}" y="${y + h / 2 - 18}" width="120" height="36" rx="6" fill="${shade(PALETTE.leather, 60)}" opacity="0.6"/>`,
    ].join("\n");
  return frame(
    [
      shadow(600, 1010, 420, 26, 0.12),
      box(200, 640, 320, 340),
      box(540, 700, 280, 280),
      box(840, 620, 260, 360),
      box(300, 340, 300, 290),
      box(620, 400, 240, 290),
      `  <text x="600" y="1120" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="${PALETTE.ink}" opacity="0.3">Die letzten Wochen</text>`,
    ].join("\n"),
    { bg: PALETTE.creamDeep },
  );
}

function workshopWide() {
  return frame(
    [
      `  <rect x="0" y="820" width="${W}" height="380" fill="${shade(PALETTE.leather, 100)}" opacity="0.45"/>`,
      `  <path d="M80 820 V300 h300 v520" fill="none" stroke="${PALETTE.ink}" stroke-width="8" opacity="0.3"/>`,
      `  <path d="M120 380 h220 M120 470 h220 M120 560 h220" stroke="${PALETTE.ink}" stroke-width="6" opacity="0.25"/>`,
      `  <rect x="440" y="560" width="330" height="260" rx="28" fill="${COLORS.nachtblau}" opacity="0.9"/>`,
      `  <rect x="800" y="600" width="300" height="220" rx="26" fill="${COLORS.sand}" opacity="0.9"/>`,
      `  <circle cx="920" cy="300" r="70" fill="${PALETTE.brass}" opacity="0.35"/>`,
      `  <path d="M0 820 h${W}" stroke="${PALETTE.ink}" stroke-width="6" opacity="0.25"/>`,
      `  <text x="600" y="1120" text-anchor="middle" font-family="Georgia, serif" font-size="36" fill="${PALETTE.ink}" opacity="0.32">Werkstatt seit 1999</text>`,
    ].join("\n"),
    { bg: PALETTE.cream },
  );
}

/* ------------------------------------------------------------------ output */

/** Motif builders keyed by the kind used in the manifest below. */
const MOTIFS = {
  hero: heroCase,
  open: openCase,
  wheels: wheelDetail,
  handle: handleDetail,
  side: sideView,
  "soft-hero": softBag,
  "soft-open": openSoftBag,
  "soft-handle": leatherHandleDetail,
  "box-hero": smallBox,
  "box-open": openSmallBox,
  "box-tray": insertTray,
  laptop: laptopCompartment,
  "slim-handle": slimHandleDetail,
};

/**
 * One entry per product image referenced in `src/data/products.ts`.
 * `tests/unit/product-images.test.ts` checks that both lists agree.
 */
const PRODUCT_MANIFEST = [
  {
    slug: "auenfels-kabine-38",
    colors: ["nachtblau"],
    kinds: ["hero", "open", "wheels", "handle"],
  },
  {
    slug: "auenfels-reise-68",
    colors: ["nachtblau", "sand"],
    kinds: ["hero", "open", "wheels", "handle", "side"],
  },
  { slug: "auenfels-grande-76", colors: ["graphit"], kinds: ["hero", "open", "wheels", "handle"] },
  {
    slug: "auenfels-business-42",
    colors: ["graphit"],
    kinds: ["hero", "laptop", "slim-handle", "wheels"],
  },
  {
    slug: "auenfels-weekender",
    colors: ["lederbraun"],
    kinds: ["soft-hero", "soft-open", "soft-handle"],
  },
  { slug: "auenfels-duo", colors: ["nachtblau"], kinds: ["set2", "set-nested", "wheels", "open"] },
  {
    slug: "auenfels-familie",
    colors: ["nachtblau", "graphit"],
    kinds: ["set3", "set-nested", "open", "handle", "side"],
  },
  { slug: "auenfels-reisebox", colors: ["burgund"], kinds: ["box-hero", "box-open", "box-tray"] },
];

const EDITORIAL = {
  "werkbank.svg": workbench(),
  "reparatur.svg": repairHands(),
  "gepaeckanhaenger.svg": luggageTags(),
  "kartons.svg": stackedBoxes(),
  "werkstatt.svg": workshopWide(),
};

async function main() {
  let count = 0;

  for (const entry of PRODUCT_MANIFEST) {
    const dir = join(OUT, "products", entry.slug);
    await mkdir(dir, { recursive: true });

    for (const [index, kind] of entry.kinds.entries()) {
      const primary = COLORS[entry.colors[0]];
      const palette = entry.colors.map((c) => COLORS[c]);

      let svg;
      if (kind === "set2") svg = nestedSet([palette[0], palette[0]]);
      else if (kind === "set3") svg = nestedSet([palette[0], palette[1] ?? palette[0], palette[0]]);
      else if (kind === "set-nested")
        svg = stackedSet([palette[0], palette[1] ?? shade(palette[0], 30)]);
      else {
        const builder = MOTIFS[kind];
        if (!builder) throw new Error(`Unbekanntes Motiv: ${kind}`);
        svg = builder(primary);
      }

      const file = join(dir, `${String(index + 1).padStart(2, "0")}.svg`);
      await writeFile(file, svg, "utf8");
      count += 1;
    }
  }

  await mkdir(join(OUT, "editorial"), { recursive: true });
  for (const [name, svg] of Object.entries(EDITORIAL)) {
    await writeFile(join(OUT, "editorial", name), svg, "utf8");
    count += 1;
  }

  console.log(`${count} SVG-Platzhalter erzeugt.`);
}

await main();
