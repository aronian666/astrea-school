<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { Form, Field, Icon, Fieldset } from "$lib/components";
  import { formToJson } from "$lib/utils/filter.js";

  export let data;
  let inputPassword: HTMLInputElement;
  $: signUp = $page.url.searchParams.get("signUp");
  const onSubmit: tOnSubmit = async (event) => {
    const formData = new FormData(event.currentTarget);
    const user = formToJson<{ email: string; password: string; name: string }>(
      formData,
    );
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
  };
</script>

<main class="flex items content">
  <Form style="width: min(350px, 100%)" let:loading {onSubmit}>
    <h1 class="tcenter">
      {signUp ? "Registrarse" : "Iniciar sesión"}
    </h1>
    <button
      type="button"
      data-style="outline"
      data-size="large"
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
    <div class="grid gap3">
      {#if signUp}
        <label>
          <span>Nombre</span>
          <input type="text" name="name" required placeholder=" " />
        </label>
      {/if}
      <label>
        <span>Correo electronico</span>
        <input type="email" name="email" required placeholder=" " />
      </label>
      <label>
        <span>Contraseña</span>
        <input
          bind:this={inputPassword}
          id="password"
          type="password"
          name="password"
          required
          minlength="6"
          placeholder=" "
        />
      </label>
      {#if signUp}
        <Fieldset let:handleError>
          <label>
            <span>Repetir contrasena</span>
            <input
              id="password"
              type="password"
              name="password"
              required
              minlength="6"
              placeholder=" "
              on:change={(e) => {
                if (e.currentTarget.value !== inputPassword.value)
                  handleError(e, "Las contrasenas no son iguales");
                else handleError(e, "");
              }}
            />
          </label>
        </Fieldset>
      {/if}
      <span>
        {signUp
          ? "¿Ya tienes una cuenta? Inicia sesión "
          : "¿No tienes una cuenta? Registrate "}
        <a
          href={"/auth" + (signUp ? "" : "?signUp=true")}
          style="color: var(--primary)">aquí.</a
        >
      </span>
    </div>
    <button data-style="gradient" type="submit" data-size="large">
      <Icon {loading} />
      {signUp ? "Registrarse" : "Iniciar sesión"}
    </button>
  </Form>
</main>

<style>
  main {
    grid-column: 1 / -1;
    grid-row: 1/-1;
  }
</style>
