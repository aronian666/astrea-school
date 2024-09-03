<script lang="ts">
  import { page } from "$app/stores";
  import { BreadCrumb, Button, Field, Form, Icon, Modal, Person, Table } from "$lib/components";
  import { message } from "$lib/stores/message";
  import type { TablesInsert } from "$lib/types/supabase";
  import { formatNumber } from "$lib/utils";
  export let data;
  let person: TablesInsert<"persons"> = {
    dni: "",
    first_name: "",
    last_name1: "",
    last_name2: "",
  };
</script>

<section class="grid">
  <table>
    <thead>
      <tr>
        <th>Estudiante</th>
        <th>Deuda</th>
        <td>
          <div class="flex content">
            <Button data-shape="square" data-size="small" onclick="assing_student.showModal()">
              <Icon icon="ph:user-plus" />
            </Button>
          </div>
        </td>
      </tr>
    </thead>
    <tbody>
      {#each data.class.class_persons as class_person, index}
        {@const popoverId = `options${class_person.id}`}
        {@const debt = class_person.view_carts.reduce((a, b) => a + Number(b.final_value), 0)}
        <tr>
          <td>
            <a href="/schools/{$page.params.school_id}/seasons/{$page.params.season_id}/students/{class_person.id}">
              {index + 1}
              {class_person.person.full_name}
            </a>
          </td>
          <td>
            <div class="grid content">
              <button data-size="tiny" data-style="tonal" style="--color: {!debt ? 'var(--green)' : 'var(--red)'}">
                {formatNumber(debt)}
              </button>
            </div>
          </td>
          <td>
            <div class="grid content">
              <button
                data-size="tiny"
                data-shape="square"
                data-style="tonal"
                popovertarget={popoverId}
                style="anchor-name: --{popoverId};"
              >
                <Icon icon="ph:dots-three" active="bold" />
              </button>
              <div
                class="panel menu"
                popover="auto"
                id={popoverId}
                style="position-anchor: --{popoverId}; inset-area: bottom span-left; --display: grid; --c: start"
              >
                <Button data-shape="menu" data-style="text"><Icon icon="ph:trash" />Eliminar</Button>
                <Button data-shape="menu" data-style="text"><Icon icon="ph:pen" />Editar</Button>
                <Button data-shape="menu" data-style="text"><Icon icon="ph:books" />Descuentos</Button>
              </div>
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</section>

<Modal id="assing_student" let:dialog>
  <Form>
    <Person bind:person />
    <Field bind:value={person.last_name1} name="last_name1" label="Apellido Paterno"></Field>
    <Field bind:value={person.last_name2} name="last_name2" label="Apellido Materno"></Field>
    <Field bind:value={person.first_name} name="first_name" label="Nombres"></Field>
    <button>Agregar estudiante</button>
  </Form>
</Modal>
