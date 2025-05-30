import ProjectSetColorType from "@/utils/setColor/types/protocolType";

export class ProjectSetColor implements Partial<ProjectSetColorType> {
  getRandomRGBColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }

  getRGBColor(r: number, g: number, b: number) {
    return `rgb(${r}, ${g}, ${b})`;
  }

  getRandomRGBAColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = (Math.random() * 0.5).toFixed(2)  + 0.5;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  getRGBAColor(r: number, g: number, b: number, a: number) {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  getRandomHSLColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 100);
    // 限制亮度在 20% 到 80% 之间
    const lightness = Math.floor(Math.random() * 60) + 20; 
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  getHSLColor(h: number, s: number, l: number) {
    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  getRandomHSLAColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 100);
    // 限制亮度在 20% 到 80% 之间
    const lightness = Math.floor(Math.random() * 60) + 20; 
    const a = Math.random().toFixed(2);
    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${a})`;
  }

  getHSLAColor(h: number, s: number, l: number, a: number) {
    return `hsla(${h}, ${s}%, ${l}%, ${a})`;
  }

  getRandomHWBColor() {
    const hue = Math.floor(Math.random() * 360);
    // 限制白度在 0% 到 30% 之间
    const whiteness = Math.floor(Math.random() * 30); 
    // 限制黑度在 0% 到 30% 之间
    const blackness = Math.floor(Math.random() * 30); 
    return `hwb(${hue} ${whiteness}% ${blackness}%)`;
  }

  getHWBColor(h: number, w: number, b: number) {
    return `hwb(${h} ${w}% ${b}%)`;
  }

  getRandomHWBAColor() {
    const hue = Math.floor(Math.random() * 360);
    // 限制白度在 0% 到 30% 之间
    const whiteness = Math.floor(Math.random() * 30); 
    // 限制黑度在 0% 到 30% 之间
    const blackness = Math.floor(Math.random() * 30); 
    const a = Math.random().toFixed(2);
    return `hwb(${hue} ${whiteness}% ${blackness}% / ${a})`;
  }

  getHWBAColor(h: number, w: number, b: number, a: number) {
    return `hwb(${h} ${w}% ${b}% / ${a})`;
  }

  getLinearGradient(direction: string, ...colors: string[]) {
    return `linear-gradient(${direction}, ${colors.join(', ')})`;
  }

  getConicGradient(angle: number,...colors: string[]) {
    return `conic-gradient(from ${angle}deg, ${colors.join(', ')})`;
  }

  getRadialGradient(shape: string, ...colors: string[]) {
    return `radial-gradient(${shape}, ${colors.join(', ')})`;
  }

  getRepeatingLinearGradient(direction: string,...colors: string[]) {
    return `repeating-linear-gradient(${direction}, ${colors.join(', ')})`;
  }

  getRepeatingConicGradient(angle: number,...colors: string[]) {
    return `repeating-conic-gradient(from ${angle}deg, ${colors.join(', ')})`;
  }

  getRepeatingRadialGradient(shape: string,...colors: string[]) {
    return `repeating-radial-gradient(${shape}, ${colors.join(', ')})`;
  }
}

const projectSetColor = new ProjectSetColor();
export default projectSetColor;