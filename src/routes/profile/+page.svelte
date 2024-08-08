<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";
  import { Form, Icon, Modal, Field, Person, Button } from "$lib/components";
  import { message } from "$lib/stores/message";
  import { formToJson } from "$lib/utils/filter.js";

  export let data;
  let { user } = data.session;
  console.log(data.session);
</script>

<section class="flex direction gap0">
  <div style="height: 5rem; background: linear-gradient(100deg, tomato, var(--black));"></div>
  <div class="flex content items" style="height: 3rem; --c: space-between">
    <div class="flex gap0 wrap">
      <picture>
        <img src={user.user_metadata.picture} alt={user.user_metadata.name} />
      </picture>
      <h1 style="place-self: center;">{user.user_metadata.name}</h1>
    </div>
    <Button onclick="edit_profile.showModal()" data-size="tiny" style="--color: var(--black); border-radius: 0.25rem">
      Editar perfil
    </Button>
  </div>
  <div class="panel flex gap3 direction" style="background-color: var(--white);">
    <div class="grid gap0">
      <h4>Correo electronico</h4>
      <p class="w300">{user.email}</p>
    </div>
    <div class="grid gap0">
      <h4>teléfono</h4>
      <p class="w300">
        {#if user.user_metadata.phone}
          {user.user_metadata.phone}
        {:else}
          Todavía no has añadido un numero de teléfono.
        {/if}
      </p>
    </div>
    <div class="grid gap0">
      <h4>DNI</h4>
      <p class="w300">
        {#if user.user_metadata.dni}
          {user.user_metadata.dni} <small>({data.person?.full_name})</small>
        {:else}
          Todavía no has añadido un DNI.
        {/if}
      </p>
    </div>
  </div>
</section>

<Modal id="edit_profile" let:dialog>
  <Form
    let:loading
    onSubmit={async (e) => {
      const userForm = formToJson(new FormData(e.currentTarget));
      // @ts-ignore
      const { error } = await data.supabase.auth.updateUser(userForm);
      if (error) return message.set({ message: error.message, details: "No hay detalles" });
      await invalidateAll();
      dialog.close();
      await goto("/");
    }}
  >
    <h3>Editar perfil</h3>
    <Field>
      <label for="data[name]">Nombre</label>
      <input type="text" id="data[name]" name="data[name]" value={user.user_metadata.name} placeholder="John Doe" />
    </Field>
    <Field>
      <label for="phone">Telefono</label>
      <input type="text" id="data[phone]" name="data[phone]" value={user.user_metadata.phone} />
    </Field>
    <Person placeholder="38372671" name="data[dni]" value={user.user_metadata.dni}>
      <label for="data[dni]">DNI</label>
    </Person>
    <button> <Icon {loading} /> Guardar </button>
  </Form>
</Modal>

<style>
  section {
    border-radius: var(--size3);
    background-color: var(--gray5);
    overflow: hidden;
  }
  picture {
    width: 7rem;
    height: 7rem;
    border-radius: 50%;
    overflow: hidden;
    border: 0.5rem solid var(--white);
    position: relative;
    top: -1rem;
  }
  h4 {
    text-transform: uppercase;
  }
  section > div:not(:first-child) {
    margin: var(--size3);
  }
</style>
