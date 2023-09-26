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
import { AnyObject } from "chart.js/dist/types/basic";

export default class AllToolTips implements Plugin {
  id = "alltooltips";
  logged = 0;

  calloutElements: Array<HTMLSpanElement> = [];

  createCallout(title: string, value: string, color: string) {
    const el = document.createElement("span");
    el.classList.add("callout", "dialog");
    el.style.position = "absolute";
    el.style.top = "50px";
    el.style.left = "50px";

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

  initCallout({
    labels,
    values,
    colors,
  }: {
    labels: string[];
    values: string[];
    colors: string[];
  }) {
    for (let i = 0; i < labels.length; i++) {
      const el = this.createCallout(labels[i], values[i], colors[i]);
      this.calloutElements.push(el);
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
    },
    options: AnyObject
  ): void {
    const { meta } = args;
    if (this.logged < 1) {
      const sum = chart.data.datasets[0].data
        .map((x) => Number(x) ?? 0)
        .reduce((a, b) => a + b);

      this.initCallout({
        labels: chart.data.labels as string[],
        values: chart.data.datasets[0].data
          .map((x) => Number(x) ?? 0)
          .map((x) => 100 * (x / sum))
          .map((x) => x.toFixed(1) + "%") as string[],
        colors: meta.data.map((x) => x.options.backgroundColor),
      });

      for (const el of this.calloutElements)
        chart.canvas.parentElement?.appendChild(el);
    }

    for (const i in meta.data) {
      const arcEl = meta.data[i] as ArcElement;
      const rad = (arcEl.startAngle + arcEl.endAngle) / 2;
      const ctr = { x: arcEl.x, y: arcEl.y };
      const vec = { x: Math.cos(rad), y: Math.sin(rad) };
      const ofs = 10 + arcEl.outerRadius;
      const pos = { x: ctr.x + vec.x * ofs, y: ctr.y + vec.y * ofs };

      chart.ctx.save();
      chart.ctx.fillStyle = "rgba(255,0,0,0.5)";
      chart.ctx.fillRect(pos.x - 5, pos.y - 5, 10, 10);
      chart.ctx.restore();

      // console.log();
      const { x, y } = chart.canvas.getBoundingClientRect();
      this.calloutElements[i].style.left = `calc(${x + pos.x}px + 20px)`;
      this.calloutElements[i].style.top = `${y + pos.y}px`;
    }
    this.logged++;
  }
}
