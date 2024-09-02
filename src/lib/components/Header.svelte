<script lang="ts">
  import type { Session } from "@supabase/supabase-js";
  import { page } from "$app/stores";
  import Icon from "./Icon.svelte";
  import Button from "./Button.svelte";
  import { message } from "$lib/stores/message";

  export let session: Session;
</script>

<header class="flex content items" style="--c: space-between">
  <a href="/" class="button" data-shape="square" data-style="text" style="--color: var(--primary)">
    <img src="/images/logo.svg" alt="Logo de la empresa" />
  </a>
  <button
    popovertarget="user_popover"
    style="padding: 0; border-radius: 50%; overflow: hidden; anchor-name: --user"
    name="Boton del usuario"
    data-shape="square"
  >
    <img src={session.user.user_metadata.avatar_url} alt={session.user.email} style="width: 2.5rem; aspect-ratio: 1" />
  </button>
  <div
    class="panel gap3"
    id="user_popover"
    popover="auto"
    style="--display: grid; position-anchor: --user; inset-area: bottom span-left;"
  >
    <section class="flex gap2">
      <img
        src={session.user.user_metadata.avatar_url}
        alt={session.user.email}
        style=" width: 2.5rem; border-radius: 50%"
      />
      <hgroup class="flex direction">
        <h3>{session.user.email}</h3>
        <small>{session.user.user_metadata.name}</small>
      </hgroup>
    </section>
    <section style="--c: start; --color: var(--black)" class="grid">
      <a class="button" data-size="small" href="/profile" data-style="text">
        <Icon icon="ph:user" />
        Mi perfil
      </a>
      <Button
        data-size="small"
        data-style="text"
        let:loading
        onClick={async () => {
          const { error } = await $page.data.supabase.auth.signOut();
          if (error) return message.set({ details: "No se pudo cerrar sesion.", message: error.message });
        }}
      >
        <Icon {loading} icon="ph:sign-out" />
        Cerrar session
      </Button>
    </section>
  </div>
</header>
