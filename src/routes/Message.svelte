<script lang="ts">
  import { Button, Icon } from "$lib/components";
  import { message } from "$lib/stores/message";
  import { onMount } from "svelte";
  onMount(() => {
    message.subscribe((value) => {
      //@ts-ignore
      if (!value) return notify.hidePopover();
      //@ts-ignore
      notify.showPopover();
    });
  });
</script>

<article
  popover="manual"
  class="panel items content gap1"
  id="notify"
  style="margin: 1rem clamp(1rem, 5vw, 100rem); --display: flex"
>
  <iconify-icon
    icon={!$message?.error ? "ph:x" : "ph:check"}
    style="color: var(--{!$message?.error ? 'red' : 'green'})"
    width="2rem"
  />
  <div>
    <h3>{$message?.message}</h3>
    <small style="color:var(--gray70)">{$message?.details}</small>
  </div>
</article>
