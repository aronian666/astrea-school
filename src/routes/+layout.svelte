<script lang="ts">
  import { invalidate } from "$app/navigation";

  import { onMount } from "svelte";
  import Message from "./Message.svelte";
  import { Aside, Button, Header, Icon } from "$lib/components";
  import { page } from "$app/stores";

  export let data;
  $: ({ session, supabase } = data);
  let options: AsideOption[] = [
    {
      paths: [
        { href: "/", name: "Inicio", icon: "iconamoon:home", match: true },
        { href: "/classes", name: "Clases", icon: "ph:building" },
        { href: "/behaviors", name: "Tutoria", icon: "ph:user-check" },
        { href: "/schools", name: "Instituciones", icon: "ph:building" },
      ],
    },
  ];
  const excluded = [/\/schools\/[0-9]+\/seasons\/[0-9]+/];
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
  <Header session={data.session} />
  {#if !excluded.some((regexp) => regexp.test($page.url.pathname))}
    <Aside root="" {options} />
  {/if}
  <main class="flex direction gap4">
    <slot />
  </main>
{:else}
  <slot />
{/if}

<Message />
