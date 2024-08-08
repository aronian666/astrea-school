<script lang="ts">
  import { invalidate } from "$app/navigation";

  import { onMount } from "svelte";
  import Message from "./Message.svelte";
  import { Aside, Button, Icon } from "$lib/components";

  export let data;
  $: ({ session, supabase } = data);
  let options: AsideOption[] = [
    {
      paths: [
        { href: "/", name: "Inicio", icon: "iconamoon:home", match: true },
        { href: "/schools", name: "Instituciones", icon: "ph:building" },
        { href: "/seasons", name: "Temporadas", icon: "ph:clock" },
      ],
    },
  ];
  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });
    return () => data.subscription.unsubscribe();
  });
</script>

{#if data.session}
  <Aside root="" {options} />
  <main class="flex direction gap4">
    <header class="flex content items" style="--c: space-between">
      <nav class="flex gap0" style="--c: center">
        <button data-size="tiny" data-style="tonal" data-shape="square" on:click={() => history.back()}>
          <Icon icon="iconamoon:arrow-left-2" />
        </button>
        <button data-size="tiny" data-style="tonal" data-shape="square" on:click={() => history.forward()}>
          <Icon icon="iconamoon:arrow-right-2" />
        </button>
      </nav>
      <button
        popovertarget="user_popover"
        style="padding: 0; border-radius: 50%; overflow: hidden; anchor-name: --user"
        name="Boton del usuario"
        data-size="tiny"
        data-shape="square"
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
            <h3>{data.session.user.email}</h3>
            <small>{data.session.user.user_metadata.name}</small>
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
              const { error } = await data.supabase.auth.signOut();
            }}
          >
            <Icon {loading} icon="ph:sign-out" />
            Cerrar session
          </Button>
        </section>
      </div>
    </header>
    <slot />
  </main>
{:else}
  <slot />
{/if}
<Message />
