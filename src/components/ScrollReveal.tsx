'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { animate, inView } from 'framer-motion'

const OFFSET_Y = 40
const EASE = [0.22, 1, 0.36, 1] as const
const STAGGER = 0.15
const MAX_GROUP_CHILDREN = 12

function topLevelSections(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('section')).filter(
    (el) =>
      !el.closest('header, footer, [data-no-reveal]') &&
      !el.parentElement?.closest('section') &&
      !el.dataset.revealed
  )
}

function animatableChildren(el: Element): HTMLElement[] {
  return Array.from(el.children).filter((child): child is HTMLElement => {
    if (!(child instanceof HTMLElement)) return false
    const { position, display } = getComputedStyle(child)
    return position !== 'absolute' && position !== 'fixed' && display !== 'none' && child.offsetHeight > 0
  })
}

const LEAF_TAGS = new Set([
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'A', 'BUTTON', 'IMG', 'PICTURE', 'VIDEO',
  'IFRAME', 'SVG', 'UL', 'OL', 'TABLE', 'FORM', 'BLOCKQUOTE', 'FIGURE',
])

function hasOwnText(el: HTMLElement): boolean {
  return Array.from(el.childNodes).some((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim())
}

// A transparent layout wrapper is split into its children; cards, text and media animate as one piece.
// Sliders stay whole: their moving track and off-screen slides would never report as in view.
function isWrapper(el: HTMLElement, children: HTMLElement[]): boolean {
  if (children.length === 0 || children.length > MAX_GROUP_CHILDREN) return false
  if (LEAF_TAGS.has(el.tagName.toUpperCase()) || hasOwnText(el)) return false
  if (el.scrollWidth > el.clientWidth + 1) return false
  const s = getComputedStyle(el)
  const painted =
    (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent') ||
    s.backgroundImage !== 'none' ||
    s.boxShadow !== 'none' ||
    parseFloat(s.borderTopWidth) > 0 ||
    parseFloat(s.borderBottomWidth) > 0
  return !painted && s.animationName === 'none' && s.overflowX !== 'auto' && s.overflowX !== 'scroll'
}

// Headings, paragraphs and individual cards animate on their own; section backgrounds never move.
function revealTargets(container: HTMLElement, depth = 0): HTMLElement[] {
  const targets: HTMLElement[] = []
  for (const child of animatableChildren(container)) {
    const inner = animatableChildren(child)
    if (depth < 6 && isWrapper(child, inner)) targets.push(...revealTargets(child, depth + 1))
    else targets.push(child)
  }
  return targets
}

export function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    const releasePending = () => document.documentElement.classList.remove('reveal-pending')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return releasePending()

    const cleanups: Array<() => void> = []
    let queue: HTMLElement[] = []
    let flushFrame = 0

    const restore = (el: HTMLElement) => {
      el.style.removeProperty('opacity')
      el.style.removeProperty('transform')
      el.style.transition = el.dataset.revealTransition ?? ''
      delete el.dataset.revealTransition
    }

    // Elements entering the viewport in the same frame are staggered top-to-bottom, left-to-right.
    const flush = () => {
      const batch = queue.sort((a, b) => {
        const ra = a.getBoundingClientRect()
        const rb = b.getBoundingClientRect()
        return Math.abs(ra.top - rb.top) > 8 ? ra.top - rb.top : ra.left - rb.left
      })
      queue = []
      batch.forEach((el, i) => {
        const delay = Math.min(i, 6) * STAGGER
        animate(el, { opacity: [0, 1] }, { duration: 0.6, delay, ease: 'easeOut' })
        animate(el, { y: [OFFSET_Y, 0] }, { duration: 1.1, delay, ease: EASE }).then(() => restore(el))
      })
    }

    const scan = () => {
      for (const section of topLevelSections()) {
        section.dataset.revealed = 'true'
        for (const el of revealTargets(section)) {
          el.dataset.revealTransition = el.style.transition
          el.style.transition = 'none'
          el.style.opacity = '0'

          const stop = inView(
            el,
            () => {
              stop()
              queue.push(el)
              cancelAnimationFrame(flushFrame)
              flushFrame = requestAnimationFrame(flush)
            },
            { margin: '0px' }
          )
          cleanups.push(() => {
            stop()
            restore(el)
          })
        }
        cleanups.push(() => delete section.dataset.revealed)
      }
    }

    scan()
    releasePending()
    let scanFrame = 0
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(scanFrame)
      scanFrame = requestAnimationFrame(scan)
    })
    mutations.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(scanFrame)
      cancelAnimationFrame(flushFrame)
      mutations.disconnect()
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [pathname])

  return null
}
