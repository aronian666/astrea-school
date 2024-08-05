<script lang="ts">
  import { invalidate, invalidateAll } from "$app/navigation";
  import { Button, Form, Icon, Modal, Person } from "$lib/components";

  import { onMount } from "svelte";
  import Message from "./Message.svelte";

  export let data;
  $: ({ session, supabase } = data);

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });
    return () => data.subscription.unsubscribe();
  });
</script>

<header style="--c: space-between">
  <nav class="flex content items">
    <div class="flex items">
      {#if data.session}
        <button data-shape="square" data-style="text" style="--c: center">
          <Icon icon="ph:list" width="1.5rem" />
        </button>
      {/if}
      <a href="/" class="flex gap0 items" style="text-decoration: none;">
        <picture style="width: var(--size4); height: var(--size4)">
          <img src="/images/logo.svg" alt="" />
        </picture>
        <h2>Astrea</h2>
      </a>
    </div>

    <div>
      {#if data.session}
        <button
          popovertarget="user_popover"
          style="padding: 0; border-radius: 50%; overflow: hidden; anchor-name: --user"
          name="Boton del usuario"
        >
          <img
            src={data.session.user.user_metadata.avatar_url}
            alt={data.session.user.email}
            style="width: 2.5rem; aspect-ratio: 1"
          />
        </button>
        <div
          class="panel gap3"
          id="user_popover"
          popover="auto"
          style="--display: grid; position-anchor: --user; inset-area: bottom span-left;"
        >
          <section class="flex gap2">
            <img
              src={data.session.user.user_metadata.avatar_url}
              alt={data.session.user.email}
              style=" width: 2.5rem; border-radius: 50%"
            />
            <hgroup class="flex direction">
              <h4>{data.session.user.email}</h4>
              <small>{data.session.user.user_metadata.name}</small>
            </hgroup>
          </section>
          <section style="--c: start; --color: var(--black)" class="grid">
            <a class="button" href="/profile" data-style="text">
              <Icon icon="ph:user" />
              Mi perfil
            </a>
            <Button
              data-style="text"
              let:loading
              onClick={async () => {
                const { error } = await data.supabase.auth.signOut();
              }}
            >
              <Icon {loading} icon="ph:sign-out" />
              Cerrar session
            </Button>
          </section>
        </div>
      {:else}
        <a class="button" href="/auth"> Iniciar sesion </a>
      {/if}
    </div>
  </nav>
</header>
<slot />
<Message />
