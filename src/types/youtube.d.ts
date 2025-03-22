
interface YT {
  Player: {
    new (
      elementId: string,
      options: {
        videoId: string;
        playerVars?: {
          autoplay?: number;
          controls?: number;
          loop?: number;
          mute?: number;
          showinfo?: number;
          rel?: number;
          playlist?: string;
        };
        events?: {
          onReady?: (event: { target: any }) => void;
          onStateChange?: (event: { data: number }) => void;
        };
      }
    ): any;
  };
  PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

interface Window {
  YT: YT;
  onYouTubeIframeAPIReady: () => void;
}
