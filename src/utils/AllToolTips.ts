import {
  ArcElement,
  BubbleDataPoint,
  Chart,
  ChartMeta,
  ChartTypeRegistry,
  Element,
  Plugin,
  Point,
} from "chart.js";
import { AnyObject, EmptyObject } from "chart.js/dist/types/basic";

export default class AllToolTips implements Plugin {
  id = "alltooltips";
  // logged = 0;

  // calloutElements: Array<HTMLSpanElement> = [];

  caretmap = [
    { range: [-15, 15], caret: ["left"] },
    {
      range: [15, 45],
      caret: ["left", "top", "vertical"],
    },
    { range: [45, 75], caret: ["left", "top"] },
    { range: [75, 105], caret: ["top"] },
    { range: [105, 135], caret: ["right", "top"] },
    {
      range: [135, 165],
      caret: ["right", "top", "vertical"],
    },
    { range: [165, 195], caret: ["right"] },
    {
      range: [195, 225],
      caret: ["right", "bottom", "vertical"],
    },
    { range: [225, 255], caret: ["right", "bottom"] },
    { range: [255, 285], caret: ["bottom"] },
    { range: [285, 315], caret: ["left", "bottom"] },
    {
      range: [315, 345],
      caret: ["left", "bottom", "vertical"],
    },
    { range: [345, 375], caret: ["left"] },
  ];

  defaults?: Partial<AnyObject> | undefined = {};

  createCallout(title: string, value: string, color: string) {
    const el = document.createElement("span");
    el.classList.add("callout", "dialog");
    el.style.position = "absolute";
    el.style.top = "0";
    el.style.left = "0";

    const labelEl = document.createElement("span");
    labelEl.classList.add("label");
    labelEl.style.background = color;
    labelEl.textContent = title;

    const valueEl = document.createElement("span");
    valueEl.classList.add("value");
    valueEl.textContent = value;

    el.appendChild(labelEl);
    el.appendChild(valueEl);

    return el;
  }

  initCallout(
    chart: Chart,
    {
      labels,
      values,
      colors,
    }: {
      labels: string[];
      values: string[];
      colors: string[];
    }
  ) {
    for (let i = 0; i < labels.length; i++) {
      const el = this.createCallout(labels[i], values[i], colors[i]);
      chart.options.plugins?.alltooltips?.calloutElements?.push(el);
    }
  }

  beforeInit(
    chart: Chart<
      keyof ChartTypeRegistry,
      (number | [number, number] | Point | BubbleDataPoint | null)[],
      unknown
    >,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _args: EmptyObject,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _options: AnyObject
  ): void {
    if (!chart.options.plugins) chart.options.plugins = {};
    if (!chart.options.plugins.alltooltips)
      chart.options.plugins.alltooltips = {};
    chart.options.plugins.alltooltips.calloutElements = [];
    chart.options.plugins.alltooltips.logged = false;
  }

  afterDraw(
    chart: Chart<
      keyof ChartTypeRegistry,
      (number | [number, number] | Point | BubbleDataPoint | null)[],
      unknown
    >
    // args: EmptyObject,
    // options: AnyObject
  ): void {
    // console.log(chart, args, options);
    const parent = chart.canvas.parentElement;
    if (parent) {
      parent.style.setProperty("position", "relative");
      if (chart.options.plugins?.alltooltips?.calloutElements)
        for (const el of chart.options.plugins.alltooltips.calloutElements) {
          if (chart.canvas.parentElement != el.parentElement)
            chart.canvas.parentElement?.appendChild(el as HTMLSpanElement);
        }
    }
  }

  afterDatasetDraw(
    chart: Chart<
      keyof ChartTypeRegistry,
      (number | [number, number] | Point | BubbleDataPoint | null)[],
      unknown
    >,
    args: {
      index: number;
      meta: ChartMeta<
        keyof ChartTypeRegistry,
        Element<AnyObject, AnyObject>,
        Element<AnyObject, AnyObject>
      >;
    }
    // options: AnyObject
  ): void {
    const { meta } = args;
    if (!chart.options.plugins?.alltooltips?.logged) {
      // console.log(args);
      const sum = chart.data.datasets[0].data
        .map((x) => Number(x) ?? 0)
        .reduce((a, b) => a + b);

      const datanum = chart.data.datasets[0].data.map((x) => Number(x) ?? 0);

      this.initCallout(chart, {
        labels: chart.data.labels as string[],
        values: datanum
          .map((x) => 100 * (x / sum))
          .map((x) => x.toFixed(1) + "%") as string[],
        colors: meta.data.map((x) => x.options.backgroundColor),
      });

      if (chart.options.plugins?.alltooltips?.calloutElements)
        for (let i = 0; i < datanum.length; i++) {
          const style = chart.options.plugins.alltooltips.calloutElements[i]
            .style as CSSStyleDeclaration;
          if (datanum[i] <= 0) style.setProperty("display", "none");
          else style.removeProperty("display");
        }

      const parent = chart.canvas.parentElement;
      if (parent) {
        parent.style.setProperty("position", "relative");
        if (chart.options.plugins?.alltooltips?.calloutElements)
          for (const el of chart.options.plugins.alltooltips.calloutElements) {
            parent.appendChild(el as HTMLSpanElement);
          }
      }
      if (chart.options.plugins?.alltooltips)
        chart.options.plugins.alltooltips.logged = true;
    }

    if (chart.options.plugins?.alltooltips?.calloutElements)
      for (const i in meta.data) {
        const arcEl = meta.data[i] as ArcElement;
        const rad = (arcEl.startAngle + arcEl.endAngle) / 2;
        const ctr = { x: arcEl.x, y: arcEl.y };
        const vec = { x: Math.cos(rad), y: Math.sin(rad) };
        const ofs = 1.35 * arcEl.outerRadius;
        const pos = { x: ctr.x + vec.x * ofs, y: ctr.y + vec.y * ofs };

        // chart.ctx.save();
        // chart.ctx.fillStyle = "rgba(255,0,0,0.5)";
        // chart.ctx.fillRect(pos.x - 5, pos.y - 5, 10, 10);
        // chart.ctx.restore();

        const deg = ((rad * 180) / Math.PI + 360) % 360;

        const el = chart.options.plugins.alltooltips.calloutElements[
          i
        ] as HTMLSpanElement;
        el.className = "callout dialog";

        for (const item of this.caretmap) {
          if (deg > item.range[0] && deg <= item.range[1]) {
            el.classList.add(...item.caret);
            break;
          }
        }

        const width = el.clientWidth / 1.75;
        const height = el.clientHeight / 1.75;
        el.style.left = `calc(${pos.x}px - ${width}px)`;
        el.style.top = `calc(${pos.y}px - ${height}px)`;
      }
  }
}
