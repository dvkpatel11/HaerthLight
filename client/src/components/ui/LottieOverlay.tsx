import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import Lottie from 'lottie-react'

interface Props {
  src: string | null
  className?: string
  loop?: boolean
}

interface AnimationData {
  [key: string]: unknown
}

export default function LottieOverlay({ src, className, loop = true }: Props) {
  const shouldReduceMotion = useReducedMotion()
  const [animationData, setAnimationData] = useState<AnimationData | null>(null)

  useEffect(() => {
    if (!src || shouldReduceMotion) return

    let cancelled = false

    fetch(src)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load lottie')
        return res.json()
      })
      .then(json => {
        if (!cancelled) setAnimationData(json)
      })
      .catch(() => {
        // fail silently; overlay is optional
      })

    return () => {
      cancelled = true
    }
  }, [src, shouldReduceMotion])

  if (!src || shouldReduceMotion || !animationData) return null

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      className={className}
    />
  )
}

