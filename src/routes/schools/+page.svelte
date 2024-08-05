<script lang="ts">
  import { goto } from "$app/navigation";
  import { Field, Form, Icon, Modal, Button } from "$lib/components";
  import { message } from "$lib/stores/message";
  import type { TablesInsert } from "$lib/types/supabase";
  import { formToJson } from "$lib/utils/filter";
  export let data;
</script>

<main class="flex direction gap5">
  <hgroup>
    <h1>Instituciones</h1>
    <small> Lista de las sus instituciones </small>
  </hgroup>
  <section class="grid auto-fill gap2" style="grid-auto-rows: 7rem; --width: 13rem">
    {#each data.school_users as { school, role }}
      <a href="/schools/{school?.id}" class="panel">
        <h3>{school?.name}</h3>
        <small style="color: var(--gray70)">{role?.name}</small>
      </a>
    {/each}
    <Button
      class="panel flex direction"
      style="--color:var(--white); height: auto; color: var(--primary)"
      onclick="add_school.showModal()"
    >
      <Icon icon="ph:plus" normal="light" active="bold" />
      Agregar
    </Button>
  </section>
</main>

<Modal id="add_school">
  <Form
    let:loading
    onSubmit={async (e) => {
      // @ts-ignore
      const { school } = formToJson(new FormData(e.currentTarget));
      const { data: newSchool, error } = await data.supabase.from("schools").insert(school).select("id").single();
      if (error) return message.set(error);
      const { error: err } = await data.supabase
        .from("school_users")
        .insert({ school_id: newSchool.id, user_id: data.session.user.id, role_id: 2 });
      if (err) return message.set(err);
      return goto(`/schools/${newSchool.id}`);
    }}
  >
    <h2 class="tcenter">Agregar institucion</h2>
    <Field>
      <label for="school[name]">
        <Icon icon="ph:building" />
        Nombre de la institucion
      </label>
      <input
        id="school[name]"
        name="school[name]"
        type="text"
        placeholder="Institucion educativa..."
        required
        minlength="5"
      />
    </Field>

    <button data-style="gradient">
      <Icon icon="ph:sing-plus" {loading} />
      Agregar
    </button>
  </Form>
</Modal>
