<script lang="ts">
  import { onMount } from "svelte";

  export let onClose: (() => void) | undefined = undefined;
  export let onOpen: (() => void) | undefined = undefined;
  export let id: string;
  let dialog: HTMLDialogElement;
  onMount(() => {
    if (onClose) dialog.addEventListener("close", onClose);
    if (onOpen) dialog.addEventListener("open", onOpen);
    const handleClick = (event: MouseEvent) => {
      if (event.target === dialog) dialog.close();
    };
    dialog.addEventListener("click", handleClick);

    return () => {
      if (onClose) dialog.removeEventListener("close", onClose);
      if (onOpen) dialog.removeEventListener("open", onOpen);
      dialog.removeEventListener("click", handleClick);
    };
  });
</script>

<dialog bind:this={dialog} {id}>
  <article {...$$restProps}>
    <slot {dialog} />
  </article>
</dialog>
