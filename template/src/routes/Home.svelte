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
    <Text
      text="A tiny starter for remote-first apps."
      fontSize={28}
      color="#94a3b8ff"
    />

    <Row gap={0}>
      <Button
        autofocus
        padding={16}
        color="#1e293bff"
        borderRadius={8}
        transition={{ color: true, scale: true }}
        style={focusStyle(1)}
        onEnter={() => {
          console.log('here');
          navigate('/about');
          return true;
        }}
      >
        <Text text="About" fontSize={24} color="#ffffffff" />
      </Button>
    </Row>
  </Column>
</View>
