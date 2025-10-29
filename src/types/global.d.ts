export declare global {
  type CoinsEarnedEvent = CustomEvent<{ newTotal: number }>

  interface WindowEventMap {
    coinsEarned: CoinsEarnedEvent
  }
}
