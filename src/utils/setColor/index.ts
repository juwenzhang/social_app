import projectSetDarkColor from "./dark/ProjectSetDarkColor";
import projectSetLightColor from "./light/ProjectSetLightColor";
import { ColorType } from "./types/colorType";

function useColor(colorType: 'dark' | 'light' | void) {
  switch (colorType) {
    case ColorType.dark: {
      return projectSetDarkColor;
    }
    case ColorType.light: {
      return projectSetLightColor;
    }
    default: {
      return projectSetLightColor;
    }
  }
}

export default useColor;