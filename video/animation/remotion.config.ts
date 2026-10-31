import {Config} from '@remotion/cli/config';

// Images, logos and screenshots live in ../assets (video/assets) so that
// swapping an asset never means touching this project. staticFile('x.png')
// resolves to video/assets/x.png.
Config.setPublicDir('../assets');
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Render one frame at a time. On an 8 GB Mac, parallel tabs ran Chrome out of
// memory: 4 tabs crashed in the 2e showcase spread, and 2 tabs produced ~40
// corrupt frames (the page drawn tiled at the wrong scale). The longer timeout
// covers the heaviest 2e frames.
Config.setConcurrency(1);
Config.setDelayRenderTimeoutInMilliseconds(120000);
