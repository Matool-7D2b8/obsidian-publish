// @ts-ignore
import lightboxScript from "./scripts/lightbox.inline"
import styles from "./styles/lightbox.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Lightbox: QuartzComponent = ({}: QuartzComponentProps) => {
  return null
}

Lightbox.beforeDOMLoaded = lightboxScript
Lightbox.css = styles

export default (() => Lightbox) satisfies QuartzComponentConstructor
