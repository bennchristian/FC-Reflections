import {Config} from '@remotion/cli/config';

// Images, logos and screenshots live in ../assets (video/assets) so that
// swapping an asset never means touching this project. staticFile('x.png')
// resolves to video/assets/x.png.
Config.setPublicDir('../assets');
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// The 2e showcase spread (five screenshots plus frozen scenes) is heavy: with
// 4 tabs at once Chrome ran out of memory on an 8 GB Mac, and frames could
// exceed the 30 s default. Override with --concurrency on a bigger machine.
Config.setConcurrency(2);
Config.setDelayRenderTimeoutInMilliseconds(120000);
