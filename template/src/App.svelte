<script lang="ts">
    import {
      HashRouter,
      LightningRoot,
      Route,
      loadGeneratedFonts,
    } from 'svelte-tv';
    import Home from './routes/Home.svelte';
    import About from './routes/About.svelte';
  </script>
  
  <LightningRoot target="app" onReady={() => loadGeneratedFonts()}>
    <HashRouter>
      <Route path="" component={Home} />
      <Route path="about" component={About} />
    </HashRouter>
  </LightningRoot>
  