import browser from '../browser';
import * as events from './content-events';

const injectScriptTag = () => {
  const script = document.createElement('script');
  script.src = browser.runtime.getURL('custom-elements.js');
  (document.head || document.documentElement).appendChild(script);
  console.log('Injected script tag', script);

  // Inject the custom-element css to the head to affect the Teleport part.
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = browser.runtime.getURL('custom-elements.css');
  (document.head || document.documentElement).appendChild(link);
  console.log('Injected link tag', link);
};

export const mountContentScript = (contentScript) => {
  window.addEventListener('load', async () => {
    console.log('Overlay is running');

    events.listen();
    injectScriptTag();

    try {
      await events.onScriptLoaded();
    } catch (e) {
      console.error('Injected script is not ready, aborting', e);
      return;
    }

    events.sendEventSettingsChangedToWebapp();

    await contentScript();

    console.log('Overlay is finished');
  });
};
