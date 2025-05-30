interface ProjectSetColorType {
  getRandomRGBColor(): string;
  getRGBColor(r: number, g: number, b: number): string;
  getRandomRGBAColor(): string;
  getRGBAColor(r: number, g: number, b: number, a: number): string;
  getRandomHSLColor(): string;
  getHSLColor(h: number, s: number, l: number): string;
  getRandomHSLAColor(): string;
  getHSLAColor(h: number, s: number, l: number, a: number): string;
  getRandomHWBColor(): string;
  getHWBColor(h: number, w: number, b: number): string;
  getRandomHWBAColor(): string;
  getHWBAColor(h: number, w: number, b: number, a: number): string;
  getLinearGradient(direction: string, ...colors: string[]): string;
  getConicGradient(angle: number, ...colors: string[]): string;
  getRadialGradient(shape: string,...colors: string[]): string;
  getRepeatingLinearGradient(direction: string,...colors: string[]): string;
  getRepeatingConicGradient(angle: number,...colors: string[]): string;
  getRepeatingRadialGradient(shape: string,...colors: string[]): string;
}

export default ProjectSetColorType;