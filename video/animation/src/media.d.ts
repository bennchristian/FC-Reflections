// Audio files imported through Remotion's webpack config resolve to a URL.
declare module '*.wav' {
  const src: string;
  export default src;
}
