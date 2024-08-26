<script lang="ts">
  import { Icon } from "$lib/components";

  export let data;
</script>

<section class="flex wrap auto-fit" style="--gap: var(--size3)">
  <picture class="panel" style="aspect-ratio: 1; --max: 30%">
    <img src={data.school_user.school.logo} alt={data.school_user.school.name} />
  </picture>
  <div style="--max: 70%">
    <hgroup class="flex gap0 content" style="--c: space-between">
      <h1>{data.school_user.school.name}</h1>
      <button
        data-shape="square"
        popovertarget="store_options"
        style="anchor-name: --store_options; --c: center"
        data-size="small"
        data-style="tonal"
      >
        <Icon icon="ph:dots-three-outline" />
      </button>
      <div
        popover="auto"
        class="panel menu"
        id="store_options"
        style="position-anchor: --store_options; inset-area: bottom span-left; --display: grid; --c: start"
      >
        <button data-style="text" data-size="small" data-shape="menu">
          <Icon icon="ph:trash" normal="light" />
          Eliminar
        </button>
        <button data-style="text" data-size="small" data-shape="menu">
          <Icon icon="ph:pen" normal="light" />
          Editar
        </button>
      </div>
    </hgroup>
  </div>
</section>
