'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  baseX: number
  baseY: number
  size: number
  opacity: number
  index: number
}

export function GlitteryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Helper function to interpolate between colors
    const interpolateColor = (
      color1: [number, number, number],
      color2: [number, number, number],
      factor: number
    ) => {
      const result = color1.slice()
      for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]))
      }
      return result
    }

    // Get color based on wave phase (0 to 1) - using grayscale tones
    const getWaveColor = (phase: number) => {
      // Define grayscale stops: light gray -> dark gray -> medium gray -> light gray
      const lightGray: [number, number, number] = [200, 200, 200] // #c8c8c8
      const darkGray: [number, number, number] = [64, 64, 64] // #404040
      const mediumGray: [number, number, number] = [115, 115, 115] // #737373

      // Normalize phase to 0-1
      phase = phase % 1

      if (phase < 0.33) {
        // light gray to dark gray transition
        const factor = phase / 0.33
        return interpolateColor(lightGray, darkGray, factor)
      } else if (phase < 0.66) {
        // dark gray to medium gray transition
        const factor = (phase - 0.33) / 0.33
        return interpolateColor(darkGray, mediumGray, factor)
      } else {
        // medium gray back to light gray transition
        const factor = (phase - 0.66) / 0.34
        return interpolateColor(mediumGray, lightGray, factor)
      }
    }

    // Create grid of particles
    const cols = 40
    const rows = 30
    const particleCount = cols * rows
    const particles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)

      const x = (canvas.width / cols) * col + canvas.width / cols / 2
      const y = (canvas.height / rows) * row + canvas.height / rows / 2

      particles.push({
        x: x,
        y: y,
        baseX: x,
        baseY: y,
        size: 1.5, // scaled down to 0.5x (from 3px to 1.5px)
        opacity: 0.8,
        index: i,
      })
    }

    // Animation variables
    let animationFrameId: number
    let time = 0

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.01 // Slower time progression for smooth waves

      // Loop the time to create seamless animation
      if (time > Math.PI * 4) {
        time = 0
      }

      // Update and draw particles
      particles.forEach((particle) => {
        // Calculate wave displacement
        const waveSpeed = 0.8
        const waveAmplitude = 30
        const waveFrequency = 0.003

        // Create flowing wave motion based on position
        const waveOffset =
          Math.sin(particle.baseX * waveFrequency + time * waveSpeed) *
          waveAmplitude
        const waveOffset2 =
          Math.cos(
            particle.baseY * waveFrequency * 0.8 + time * waveSpeed * 0.7
          ) *
          waveAmplitude *
          0.5

        // Update particle position with wave
        particle.x = particle.baseX + waveOffset
        particle.y = particle.baseY + waveOffset2

        // Calculate color phase based on wave position
        // The wave flows across the screen, changing colors as it goes
        const colorPhase =
          (particle.baseX * waveFrequency +
            particle.baseY * waveFrequency * 0.5 +
            time * waveSpeed) /
          (Math.PI * 2)
        const rgb = getWaveColor(colorPhase)

        // Calculate opacity based on wave position
        const opacityWave = Math.sin(
          particle.baseX * waveFrequency * 2 + time * waveSpeed * 1.5
        )
        particle.opacity = 0.4 + opacityWave * 0.4

        // Draw square particle with glow
        const glowSize = particle.size * 4
        ctx.shadowColor = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${particle.opacity * 0.6})`
        ctx.shadowBlur = glowSize * 2
        ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${particle.opacity * 0.5})`
        ctx.fillRect(
          particle.x - glowSize / 2,
          particle.y - glowSize / 2,
          glowSize,
          glowSize
        )

        // Reset shadow
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0

        // Draw bright core
        ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${particle.opacity})`
        ctx.fillRect(
          particle.x - particle.size / 2,
          particle.y - particle.size / 2,
          particle.size,
          particle.size
        )
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.4 }}
    />
  )
}
