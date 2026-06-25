<script lang="ts">
  import { Column, Row, Text, View, navigate, Button } from 'svelte-tv';

  function accentColor(index: number) {
    return ['#38bdf8ff', '#f59e0bff', '#22c55eff', '#e879f9ff'][index % 4];
  }

  function focusStyle(index: number, scale = 1.045) {
    return { $focus: { color: accentColor(index), scale } };
  }
</script>

<View w={1920} h={1080} color="#020617ff" padding={0}>
  <Column gap={16}>
    <Text text="Svelte TV" fontSize={64} />
    <Text text="About page" fontSize={28} color="#94a3b8ff" />

    <Button
      padding={16}
      autofocus
      color="#1e293bff"
      borderRadius={8}
      transition={{ color: true, scale: true }}
      style={focusStyle(0)}
      onEnter={() => {
        navigate('/');
        return true;
      }}
    >
      <Text text="Back to Home" fontSize={24} color="#ffffffff" />
    </Button>
  </Column>
</View>
