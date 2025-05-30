import { ProjectSetColor } from "@/utils/setColor/base/ProjectSetColor";

export class ProjectSetLightColor extends ProjectSetColor {
  // 重写随机 RGB 颜色生成方法，限制生成较亮的颜色
  getRandomRGBColor() {
    // 限制每个通道的值在 128 - 255 之间，生成较亮的颜色
    const r = Math.floor(Math.random() * 128) + 128;
    const g = Math.floor(Math.random() * 128) + 128;
    const b = Math.floor(Math.random() * 128) + 128;
    return `rgb(${r}, ${g}, ${b})`;
  }

  // 重写随机 RGBA 颜色生成方法，限制生成较亮的颜色
  getRandomRGBAColor() {
    const r = Math.floor(Math.random() * 128) + 128;
    const g = Math.floor(Math.random() * 128) + 128;
    const b = Math.floor(Math.random() * 128) + 128;
    const a = Math.random().toFixed(2);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  // 重写随机 HSL 颜色生成方法，限制亮度在较高范围
  getRandomHSLColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 100);
    // 限制亮度在 60% - 100% 之间，生成较亮的颜色
    const lightness = Math.floor(Math.random() * 41) + 60; 
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  // 重写随机 HSLA 颜色生成方法，限制亮度在较高范围
  getRandomHSLAColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 100);
    // 限制亮度在 60% - 100% 之间，生成较亮的颜色
    const lightness = Math.floor(Math.random() * 41) + 60; 
    const a = Math.random().toFixed(2);
    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${a})`;
  }

  // 重写随机 HWB 颜色生成方法，增加白度和限制黑度
  getRandomHWBColor() {
    const hue = Math.floor(Math.random() * 360);
    // 限制白度在 30% - 100% 之间
    const whiteness = Math.floor(Math.random() * 71) + 30; 
    // 限制黑度在 0% - 20% 之间
    const blackness = Math.floor(Math.random() * 21); 
    return `hwb(${hue} ${whiteness}% ${blackness}%)`;
  }

  // 重写随机 HWBA 颜色生成方法，增加白度和限制黑度
  getRandomHWBAColor() {
    const hue = Math.floor(Math.random() * 360);
    // 限制白度在 30% - 100% 之间
    const whiteness = Math.floor(Math.random() * 71) + 30; 
    // 限制黑度在 0% - 20% 之间
    const blackness = Math.floor(Math.random() * 21); 
    const a = Math.random().toFixed(2);
    return `hwb(${hue} ${whiteness}% ${blackness}% / ${a})`;
  }
}

const projectSetLightColor = new ProjectSetLightColor();
export default projectSetLightColor;