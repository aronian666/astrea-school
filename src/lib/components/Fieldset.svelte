<script lang="ts">
  let loading = false;
  let error = "";
  function handleError(
    e: Event & { currentTarget: EventTarget & HTMLInputElement },
    message = "",
  ) {
    const input = e.currentTarget;
    input.setCustomValidity(message);
    error = input.validationMessage;
  }
  const setLoading = (l: boolean) => (loading = l);
</script>

<fieldset>
  <slot {loading} {handleError} {setLoading} />
  {#if error}
    <small class="flex gap0 items" style="color: var(--red)">
      <iconify-icon icon="ph:warning-circle" width="1em"></iconify-icon>
      {error}
    </small>
  {/if}
</fieldset>
