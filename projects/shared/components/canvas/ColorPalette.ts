import hsl from 'hsl-to-hex'
import { random } from '../../utils/common'

// ColorPalette class
export class ColorPalette {
  hue = 0
  complimentaryHue1 = 0
  complimentaryHue2 = 0
  saturation = 0
  lightness = 0
  baseColor = ''
  complimentaryColor1 = ''
  complimentaryColor2 = ''
  colorChoices: string[] = []

  constructor() {
    this.setColors()
    this.setCustomProperties()
  }

  setColors() {
    // pick a random hue somewhere between 220 and 360
    this.hue = ~~random(180, 360)
    this.complimentaryHue1 = this.hue + 30
    this.complimentaryHue2 = this.hue + 60
    // define a fixed saturation and lightness
    this.saturation = 95
    this.lightness = 50

    // define a base color
    this.baseColor = hsl(this.hue, this.saturation, this.lightness)
    // define a complimentary color, 30 degress away from the base
    this.complimentaryColor1 = hsl(
      this.complimentaryHue1,
      this.saturation,
      this.lightness,
    )
    // define a second complimentary color, 60 degrees away from the base
    this.complimentaryColor2 = hsl(
      this.complimentaryHue2,
      this.saturation,
      this.lightness,
    )

    // store the color choices in an array so that a random one can be picked later
    this.colorChoices = [
      this.baseColor,
      this.complimentaryColor1,
      this.complimentaryColor2,
    ]
  }

  randomColor() {
    // pick a random color
    return this.colorChoices[~~random(0, this.colorChoices.length)].replace(
      '#',
      '0x',
    )
  }

  setCustomProperties() {
    // set CSS custom properties so that the colors defined here can be used throughout the UI
    document.documentElement.style.setProperty('--hue', String(this.hue))
    document.documentElement.style.setProperty(
      '--hue-complimentary1',
      String(this.complimentaryHue1),
    )
    document.documentElement.style.setProperty(
      '--hue-complimentary2',
      String(this.complimentaryHue2),
    )
  }
}
