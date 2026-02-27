import { useEffect, useRef, useState } from 'react'
import styles from './AudioControls.module.css'

interface Props {
  src: string
  accentColor?: string
  autoPlay?: boolean
}

export default function AudioControls({ src, accentColor = '#c9a84c', autoPlay = true }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.loop = true
    audio.volume = 0.35

    if (autoPlay) {
      audio.play().then(() => setPlaying(true)).catch(() => {
        // Autoplay blocked — user must click to start
        setPlaying(false)
      })
    }

    return () => {
      audio.pause()
    }
  }, [src, autoPlay])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  function toggleMute() {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !muted
    setMuted(m => !m)
  }

  return (
    <>
      <audio ref={audioRef} src={src} preload="auto" />
      <div
        className={styles.wrap}
        style={{ '--accent': accentColor } as React.CSSProperties}
        title={playing ? 'Pause music' : 'Play music'}
      >
        <button
          className={`${styles.btn} ${playing && !muted ? styles.playing : ''}`}
          onClick={togglePlay}
          aria-label={playing ? 'Pause background music' : 'Play background music'}
        >
          {playing ? (
            <span className={styles.waveform} aria-hidden>
              <span className={styles.bar} />
              <span className={styles.bar} />
              <span className={styles.bar} />
              <span className={styles.bar} />
            </span>
          ) : (
            <span className={styles.playIcon} aria-hidden>♪</span>
          )}
        </button>
        {playing && (
          <button
            className={styles.muteBtn}
            onClick={toggleMute}
            aria-label={muted ? 'Unmute music' : 'Mute music'}
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? '🔇' : '🔊'}
          </button>
        )}
      </div>
    </>
  )
}
