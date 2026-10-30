// Measurements shared by the factory's pieces, in SVG units (the drawing is 1000 wide).

export const W = 1000;
export const H = 350;
export const TOP = 56; // nothing is drawn above this
export const BELT_Y = 250; // top of the belt
export const BELT = [176, 900]; // where the belt starts and ends
export const SPEED = 70; // px per second
export const EVERY = 1.8; // seconds between two cards
export const CARD = { w: 84, h: 44 };
export const BOX = 56; // half the width of a box or machine
export const DROP = 46; // px a card travels while falling off the belt into a bin

export const fmt = (s) => (s < 0.01 ? '< 0.01 s' : `${s.toFixed(2)} s`);
