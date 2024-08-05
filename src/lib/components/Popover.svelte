<script lang="ts">
  import { onMount } from "svelte";
  let id = "a" + Math.round(Math.random() * 100000000);
  export let x: "top" | "bottom" = "bottom";
  export let y: "left" | "right" = "left";
  export let fullWidth = false;

  onMount(() => {
    const button = document.querySelector(`[popovertarget=${id}]`) as HTMLButtonElement;
    const popover = document.getElementById(id)!;
    const handleEvent = () => {
      const buttonPosition = button.getBoundingClientRect();
      if (x === "top") popover.style.top = buttonPosition.top - popover.clientHeight + "px";
      else popover.style.top = buttonPosition.top + button.clientHeight + "px";
      if (fullWidth) {
        popover.style.left = buttonPosition.left + "px";
        popover.style.width = button.clientWidth + "px";
      } else {
        if (y === "left") popover.style.left = buttonPosition.left + "px";
        else popover.style.left = buttonPosition.left + button.clientWidth - popover.clientWidth + "px";
      }
    };
    function handleToggle(event: Event) {
      //@ts-ignore
      if (event.newState === "closed") {
        window.removeEventListener("resize", handleEvent);
        return document.removeEventListener("scroll", handleEvent);
      }
      handleEvent();
      window.addEventListener("resize", handleEvent);
      return document.addEventListener("scroll", handleEvent);
    }
    popover.addEventListener("toggle", handleToggle);
    return () => popover.removeEventListener("toggle", handleToggle);
  });
</script>

<slot {id} />
