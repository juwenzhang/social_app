import { ProjectSetColor } from "../base/ProjectSetColor";

export class ProjectSetDarkColor extends ProjectSetColor {
  constructor() {
    super();
  }

  // 重写随机 RGB 颜色生成方法，限制生成较深的颜色
  getRandomRGBColor() {
    // 限制每个通道的值在 0 - 128 之间，生成较深的颜色
    const r = Math.floor(Math.random() * 129);
    const g = Math.floor(Math.random() * 129);
    const b = Math.floor(Math.random() * 129);
    return `rgb(${r}, ${g}, ${b})`;
  }

  // 重写随机 RGBA 颜色生成方法，限制生成较深的颜色
  getRandomRGBAColor() {
    const r = Math.floor(Math.random() * 129);
    const g = Math.floor(Math.random() * 129);
    const b = Math.floor(Math.random() * 129);
    const a = Math.random().toFixed(2);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  // 重写随机 HSL 颜色生成方法，限制亮度在较低范围
  getRandomHSLColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 100);
    // 限制亮度在 0% - 40% 之间，生成较深的颜色
    const lightness = Math.floor(Math.random() * 41); 
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  // 重写随机 HSLA 颜色生成方法，限制亮度在较低范围
  getRandomHSLAColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 100);
    // 限制亮度在 0% - 40% 之间，生成较深的颜色
    const lightness = Math.floor(Math.random() * 41); 
    const a = Math.random().toFixed(2);
    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${a})`;
  }

  // 重写随机 HWB 颜色生成方法，限制白度和增加黑度
  getRandomHWBColor() {
    const hue = Math.floor(Math.random() * 360);
    // 限制白度在 0% - 20% 之间
    const whiteness = Math.floor(Math.random() * 21); 
    // 限制黑度在 30% - 100% 之间
    const blackness = Math.floor(Math.random() * 71) + 30; 
    return `hwb(${hue} ${whiteness}% ${blackness}%)`;
  }

  // 重写随机 HWBA 颜色生成方法，限制白度和增加黑度
  getRandomHWBAColor() {
    const hue = Math.floor(Math.random() * 360);
    // 限制白度在 0% - 20% 之间
    const whiteness = Math.floor(Math.random() * 21); 
    // 限制黑度在 30% - 100% 之间
    const blackness = Math.floor(Math.random() * 71) + 30; 
    const a = Math.random().toFixed(2);
    return `hwb(${hue} ${whiteness}% ${blackness}% / ${a})`;
  }
}

const projectSetDarkColor = new ProjectSetDarkColor();
export default projectSetDarkColor;