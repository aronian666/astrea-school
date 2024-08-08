<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { Form, Field, Icon } from "$lib/components";
  import { formToJson } from "$lib/utils/filter.js";

  export let data;
  let inputPassword: HTMLInputElement;
  $: signUp = $page.url.searchParams.get("signUp");
  async function onSubmit(event: SubmitEvent) {
    //@ts-ignore
    const formData = new FormData(event.currentTarget);
    const user = formToJson<{ email: string; password: string; name: string }>(formData);
    if (signUp) {
      const { error: err } = await data.supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          emailRedirectTo: `${location.origin}/`,
          data: {
            name: user.name,
          },
        },
      });
      return goto("/auth/new?email=" + user.email);
    }
    const { error: err } = await data.supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    });
    if (err) return alert(err.message);
    return await goto("/");
  }
</script>

<main class="flex items content">
  <Form style="width: min(350px, 100%)" let:loading {onSubmit}>
    <h1 class="tcenter">
      {signUp ? "Registrarse" : "Iniciar sesión"}
    </h1>
    <button
      type="button"
      data-style="outline"
      on:click={async () => {
        await data.supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${location.origin}/`,
          },
        });
      }}
    >
      <iconify-icon icon="devicon:google"></iconify-icon>
      Ingresar con google
    </button>
    {#if signUp}
      <Field label="Nombre" name="name" required />
    {/if}
    <Field required label="Correo electronico" type="email" name="email"></Field>
    <Field>
      <div class="flex items content" style="--c: space-between">
        <label for="password" class="w500"> Contraseña </label>
        <small style="color: var(--primary)">
          <a href="/auth/recovery">¿Olvidaste tu contraseña?</a>
        </small>
      </div>
      <input bind:this={inputPassword} id="password" type="password" name="password" required minlength="6" />
    </Field>

    {#if signUp}
      <Field required title="Repetir contrasena" let:setError>
        <label for="repeat_password">Repetir contraseña </label>
        <input
          type="password"
          name="repeat_password"
          id="repeat_password"
          on:blur={(e) => {
            if (e.currentTarget.value !== inputPassword.value)
              setError(e.currentTarget, "Las contrasenas no son iguales");
            else setError(e.currentTarget, "");
          }}
        />
      </Field>
    {/if}
    <p>
      {signUp ? "¿Ya tienes una cuenta? Inicia sesión " : "¿No tienes una cuenta? Registrate "}
      <a href={"/auth" + (signUp ? "" : "?signUp=true")} style="color: var(--primary)">aquí.</a>
    </p>
    <button data-style="gradient" type="submit">
      <Icon {loading} />
      {signUp ? "Registrarse" : "Iniciar sesión"}
    </button>
  </Form>
</main>

<style>
  main {
    grid-column: 2 / span 1;
  }
</style>
