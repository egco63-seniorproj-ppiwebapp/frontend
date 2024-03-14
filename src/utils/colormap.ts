type ColorRGB = [number, number, number];
type ColormapData = ColorRGB[];
function lerp(a: number, b: number, ratio: number) {
  return a + (b - a) * ratio;
}
function lerpRGB(a: ColorRGB, b: ColorRGB, ratio: number) {
  return [
    lerp(a[0], b[0], ratio),
    lerp(a[1], b[1], ratio),
    lerp(a[2], b[2], ratio),
  ] as ColorRGB;
}

export function applymap(v: number, map: ColormapData) {
  const L = map.length;
  const dL = 1 / (L - 1);
  const i = v / dL;
  const s = Math.floor(i);
  const e = Math.min(L - 1, s + 1);
  const d = i - s;
  const mix = lerpRGB(map[s], map[e], d);
  return mix;
}

// SOURCE: https://www.mathworks.com/matlabcentral/fileexchange/2662-cmrmap-m
export const CMRmap_data: ColormapData = [
  [0, 0, 0],
  [0.15, 0.15, 0.5],
  [0.3, 0.15, 0.75],
  [0.6, 0.2, 0.5],
  [1, 0.25, 0.15],
  [0.9, 0.5, 0],
  [0.9, 0.75, 0.1],
  [0.9, 0.9, 0.5],
  [1, 1, 1],
];

// MORE SOURCE: https://github.com/matplotlib/matplotlib/blob/main/lib/matplotlib/_cm.py
