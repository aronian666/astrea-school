<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { Button, Icon, Modal } from "$lib/components";
  import Form from "$lib/components/Form.svelte";
  import { message } from "$lib/stores/message";
  import { formToJson } from "$lib/utils";

  export let data;
</script>

<div class="grid auto-fit gap3">
  <section class="flex direction gap2">
    <div class="grid gap1" style="grid-template-columns: 1fr 1fr;">
      <b>DNI</b>
      <p>
        {data.class_person.person?.dni}
      </p>
      <b>Direccion</b>
      <p>
        {data.class_person.person?.address ?? ""}
      </p>
      <b>Telefono</b>
      <p>
        {data.class_person.person?.cellphone ?? ""}
      </p>
    </div>
    <div class="flex gap1">
      <Button onclick="edit_person.showModal()" data-size="small">
        <Icon icon="ph:pen" /> Editar
      </Button>
      <button data-size="small" data-style="tonal">
        <Icon icon="ph:trash" />
        Eliminar
      </button>
    </div>
  </section>
</div>

<Modal id="edit_person" let:dialog>
  <Form
    let:loading
    onSubmit={async (e) => {
      const form_user = formToJson(new FormData(e.currentTarget));
      form_user.id = data.class_person.person.id;
      console.log(form_user);
      const { data: new_user, error: err } = await data.supabase
        .from("persons")
        .upsert(form_user)
        .select();
      if (err) return message.set(err);
      Object.assign(data.class_person.person, new_user);
      await invalidate("class_person_id:layout");
      data = data;
      dialog.close();
    }}
  >
    <label>
      <span>DNI</span>
      <input type="text" name="dni" value={data.class_person.person.dni} />
    </label>
    <label>
      <span>Apellido Paterno</span>
      <input
        type="text"
        name="last_name1"
        value={data.class_person.person.last_name1}
      />
    </label>
    <label>
      <span>Apellido Materno</span>
      <input
        type="text"
        name="last_name2"
        value={data.class_person.person.last_name2}
      />
    </label>

    <label>
      <span>Nombres</span>
      <input
        type="text"
        name="first_name"
        value={data.class_person.person.first_name}
      />
    </label>
    <button>
      <Icon {loading} />
      Guardar
    </button>
  </Form>
</Modal>
