import projectSetDarkColor from "./dark/ProjectSetDarkColor";
import projectSetLightColor from "./light/ProjectSetLightColor";
import { ColorType } from "./types/colorType";

function useColor(colorType: 'dark' | 'light' | void) {
  switch (colorType) {
    case ColorType.dark: {
      return projectSetLightColor;
    }
    case ColorType.light: {
      return projectSetDarkColor;
    }
    default: {
      return projectSetDarkColor;
    }
  }
}

export default useColor;