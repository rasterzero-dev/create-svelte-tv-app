import {
    CanvasCoreRenderer,
    CanvasTextRenderer,
  } from '@lightningjs/renderer/canvas';
  import {
    WebGlCoreRenderer,
    SdfTextRenderer,
  } from '@lightningjs/renderer/webgl';
  import { mount } from 'svelte';
  import { Config } from 'svelte-tv';
  import App from './App.svelte';
  
  const urlParams = new URLSearchParams(window.location.search);
  const screenSize = urlParams.get('size') || 'default';
  const rendererMode = urlParams.get('mode') || 'webgl';
  const animationsEnabled = urlParams.get('animate') || 'true';
  
  const logFps = true;
  Config.debug = false;
  // Config.keyDebug = true;
  Config.animationsEnabled = animationsEnabled === 'true';
  Config.domRendererEnabled = false;
  Config.fontSettings.fontFamily = 'Roboto-Regular';
  // Config.focusDebug = true;
  
  const deviceLogicalPixelRatio = {
    '720': 0.666667,
    medium: 0.8,
    '1080': 1,
    '4k': 2,
    default: window.innerHeight / 1080,
  }[screenSize];
  
  Config.rendererOptions = {
    fpsUpdateInterval: logFps ? 1000 : 0,
    textureMemory: {
      criticalThreshold: 200e6,
      targetThresholdLevel: 0.8,
    },
    numImageWorkers: 4, // temp fix for renderer bug
    // Set the resolution based on window height
    // 720p = 0.666667, 1080p = 1, 1440p = 1.5, 2160p = 2
    deviceLogicalPixelRatio,
    devicePhysicalPixelRatio: 1,
    createImageBitmapSupport: 'auto',
    boundsMargin: 100,
    targetFPS: 0,
    enableClear: false,
  };
  
  if (rendererMode === 'canvas') {
    Config.rendererOptions.fontEngines = [CanvasTextRenderer];
    Config.rendererOptions.renderEngine = CanvasCoreRenderer;
  } else {
    Config.rendererOptions.fontEngines = [SdfTextRenderer];
    Config.rendererOptions.renderEngine = WebGlCoreRenderer;
  }
  
  mount(App, {
    target: document.getElementById('app')!,
  });
  