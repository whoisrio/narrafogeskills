import {Config} from '@remotion/cli/config';

// The sandboxed chrome-headless-shell download is unreliable on this network;
// use the locally installed Chrome instead.
Config.setBrowserExecutable(
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
);
