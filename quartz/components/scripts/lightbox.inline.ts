const MIN_SCALE = 0.5
const MAX_SCALE = 5
const ZOOM_STEP = 0.25

let scale = 1
let translateX = 0
let translateY = 0
let isDragging = false
let dragStartX = 0
let dragStartY = 0
let startTranslateX = 0
let startTranslateY = 0
let indicatorTimer: ReturnType<typeof setTimeout> | null = null

function createOverlay(): HTMLElement {
  const overlay = document.createElement("div")
  overlay.className = "lightbox-overlay"

  const closeBtn = document.createElement("button")
  closeBtn.className = "lightbox-close"
  closeBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
  overlay.appendChild(closeBtn)

  const container = document.createElement("div")
  container.className = "lightbox-container"
  overlay.appendChild(container)

  const indicator = document.createElement("div")
  indicator.className = "lightbox-zoom-indicator"
  overlay.appendChild(indicator)

  return overlay
}

let overlay: HTMLElement | null = null
let container: HTMLElement | null = null
let lightboxImg: HTMLImageElement | null = null

function showZoomIndicator() {
  const indicator = overlay?.querySelector(".lightbox-zoom-indicator") as HTMLElement
  if (!indicator) return
  indicator.textContent = `${Math.round(scale * 100)}%`
  indicator.classList.add("visible")
  if (indicatorTimer) clearTimeout(indicatorTimer)
  indicatorTimer = setTimeout(() => indicator.classList.remove("visible"), 1000)
}

function updateTransform() {
  if (!lightboxImg) return
  lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`
}

function resetTransform() {
  scale = 1
  translateX = 0
  translateY = 0
  updateTransform()
}

function getMousePos(e: MouseEvent): { x: number; y: number } {
  const imgRect = lightboxImg!.getBoundingClientRect()
  // imgRect includes current transform. Compute the natural (pre-transform) origin
  // so mouse coordinates and translateX/Y share the same coordinate system.
  const originX = imgRect.left - translateX
  const originY = imgRect.top - translateY
  return { x: e.clientX - originX, y: e.clientY - originY }
}

function openLightbox(img: HTMLImageElement) {
  if (overlay) return

  overlay = createOverlay()
  container = overlay.querySelector(".lightbox-container")!

  lightboxImg = document.createElement("img")
  lightboxImg.src = img.src
  lightboxImg.alt = img.alt || ""
  lightboxImg.className = "lightbox-image"
  lightboxImg.draggable = false

  lightboxImg.onload = () => {
    const naturalW = lightboxImg!.naturalWidth
    const naturalH = lightboxImg!.naturalHeight
    const maxW = window.innerWidth * 0.9
    const maxH = window.innerHeight * 0.85
    const ratio = Math.min(maxW / naturalW, maxH / naturalH, 1)
    lightboxImg!.style.width = `${naturalW * ratio}px`
    lightboxImg!.style.height = `${naturalH * ratio}px`
  }

  container.appendChild(lightboxImg)
  document.body.appendChild(overlay)

  requestAnimationFrame(() => overlay!.classList.add("active"))
}

function closeLightbox() {
  if (!overlay) return
  overlay.classList.remove("active")
  overlay.addEventListener("transitionend", () => {
    overlay?.remove()
    overlay = null
    container = null
    lightboxImg = null
    resetTransform()
  }, { once: true })
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
  const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + delta))

  const mouse = getMousePos(e)
  const scaleChange = newScale / scale

  translateX = mouse.x - scaleChange * (mouse.x - translateX)
  translateY = mouse.y - scaleChange * (mouse.y - translateY)
  scale = newScale

  updateTransform()
  showZoomIndicator()
}

function onMouseDown(e: MouseEvent) {
  if (scale <= 1 || e.button !== 0) return
  isDragging = true
  dragStartX = e.clientX
  dragStartY = e.clientY
  startTranslateX = translateX
  startTranslateY = translateY
  if (lightboxImg) lightboxImg.style.cursor = "grabbing"
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging) return
  translateX = startTranslateX + (e.clientX - dragStartX)
  translateY = startTranslateY + (e.clientY - dragStartY)
  updateTransform()
}

function onMouseUp() {
  isDragging = false
  if (lightboxImg) lightboxImg.style.cursor = scale > 1 ? "grab" : "default"
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape") closeLightbox()
}

document.addEventListener("click", (e) => {
  if (overlay) {
    const target = e.target as HTMLElement
    if (target === overlay || target.classList.contains("lightbox-close") || target.closest(".lightbox-close")) {
      e.preventDefault()
      closeLightbox()
    }
    return
  }

  const img = (e.target as HTMLElement).closest("article img") as HTMLImageElement | null
  if (img && !img.closest("a") && !img.closest(".popover")) {
    e.preventDefault()
    openLightbox(img)
  }
})

document.addEventListener("wheel", (e) => {
  if (overlay && container && e.target !== overlay) {
    const isInContainer = container.contains(e.target as Node)
    if (isInContainer || (e.target as HTMLElement).closest(".lightbox-container")) {
      onWheel(e)
    }
  }
}, { passive: false })

document.addEventListener("mousedown", (e) => {
  if (overlay && container) {
    const isInContainer = container.contains(e.target as Node)
    if (isInContainer) onMouseDown(e)
  }
})

document.addEventListener("mousemove", (e) => {
  if (overlay) onMouseMove(e)
})

document.addEventListener("mouseup", () => {
  if (overlay) onMouseUp()
})

document.addEventListener("keydown", onKeyDown)
