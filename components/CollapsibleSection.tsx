'use client'

import { useRef, useState } from 'react'

const DURATION = 220
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)'

type CollapsibleSectionProps = {
  id: string
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export default function CollapsibleSection({
  id,
  title,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<Animation | null>(null)
  const [open, setOpen] = useState(defaultOpen)

  const animate = (from: number, to: number, onDone: () => void) => {
    const content = contentRef.current
    if (!content) return onDone()

    content.style.overflow = 'hidden'
    const animation = content.animate(
      { height: [`${from}px`, `${to}px`], opacity: [from ? 1 : 0, to ? 1 : 0] },
      { duration: DURATION, easing: EASING }
    )
    animationRef.current = animation
    animation.onfinish = () => {
      content.style.overflow = ''
      animationRef.current = null
      onDone()
    }
    animation.oncancel = () => {
      content.style.overflow = ''
    }
  }

  const toggle = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()

    const details = detailsRef.current
    const content = contentRef.current
    if (!details || !content) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      details.open = !details.open
      setOpen(details.open)
      return
    }

    animationRef.current?.cancel()

    if (details.open) {
      setOpen(false)
      animate(content.offsetHeight, 0, () => {
        details.open = false
      })
    } else {
      details.open = true
      setOpen(true)
      animate(0, content.offsetHeight, () => {})
    }
  }

  return (
    <details
      ref={detailsRef}
      id={id}
      open={defaultOpen}
      className="border-b border-gray-200 last:border-b-0"
    >
      <summary
        onClick={toggle}
        className="group flex cursor-pointer list-none items-center gap-2 py-3 [&::-webkit-details-marker]:hidden"
      >
        <span
          aria-hidden="true"
          className={`inline-block w-3 shrink-0 font-mono text-xs text-gray-400 transition-transform duration-200 group-hover:text-gray-900 ${
            open ? 'rotate-90' : ''
          }`}
        >
          &gt;
        </span>
        <h2 className="text-xs uppercase tracking-wider text-gray-400 transition-colors group-hover:text-gray-900">
          {title}
        </h2>
      </summary>
      <div ref={contentRef}>
        <div className="pb-10 pt-3">{children}</div>
      </div>
    </details>
  )
}
