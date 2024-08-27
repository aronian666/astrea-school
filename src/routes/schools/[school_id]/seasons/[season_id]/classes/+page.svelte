<script lang="ts">
  import { Button, Field, Form, Icon, Modal, Person, Table } from "$lib/components";
  import { page } from "$app/stores";
  import { groupBy } from "$lib/utils/groupBy";
  import type { TablesInsert } from "$lib/types/supabase.js";
  import { message } from "$lib/stores/message";
  export let data;
  const levels = groupBy(data.classes, (clas) => String(clas.level?.name));
  let person: TablesInsert<"persons"> = {
    dni: "",
    first_name: "",
    last_name1: "",
    last_name2: "",
  };
  let clase = data.classes[0];
  let newClass: TablesInsert<"classes"> = {
    grade: data.levels[0].grades[0],
    level_id: data.levels[0].id,
    season_id: Number($page.params.season_id),
    section_id: 0,
  };
</script>

<section class="flex content items gap0 wrap" style="--c: space-between">
  <hgroup>
    <h1>Clases</h1>
    <small>Agrege las claes que quiere, adicionalmente puede ponerle nombres personalizados.</small>
  </hgroup>
  <Button data-style="gradient" onclick="add_class.showModal()">
    <Icon icon="ph:plus" active="bold" />
    Agregar
  </Button>
</section>
<div class="grid auto-fit gap3">
  {#each Object.entries(levels) as [level, classesByLevel]}
    {@const classesByGrade = groupBy(classesByLevel, (clas) => clas.grade)}
    <section class="flex direction gap2 panel">
      <h3>{level}</h3>
      <Table
        array={Object.entries(classesByGrade)}
        header={[{ name: "Grado" }, { name: "Secciones" }, { name: "Acesor" }]}
        let:item
      >
        {#each item[1] || [] as clas}
          <tr>
            <td class="tcenter">{item[0]}</td>

            <td>
              <div class="flex content">
                <a data-size="small" data-shape="square" data-style="tonal" class="button" href="classes/{clas.id}">
                  {clas.section?.name}
                </a>
              </div>
            </td>
            <td class="tleft">
              {#if !clas.person}
                <Button
                  onclick="assign_person.showModal()"
                  on:click={() => (clase = clas)}
                  data-shape="square"
                  data-size="small"
                  data-style="text"
                >
                  <Icon icon="ph:user-plus" />
                </Button>
              {:else}
                {clas.person?.full_name}
              {/if}
            </td>
          </tr>
        {/each}
      </Table>
    </section>
  {/each}
</div>

<Modal id="assign_person" let:dialog>
  <Form
    let:loading
    onSubmit={async () => {
      const { error: err, data: new_class } = await data.supabase
        .from("classes")
        .update({ person_dni: person.dni || null })
        .eq("id", clase.id)
        .select("person:persons(full_name, dni)")
        .single();
      if (err) return message.set(err);
      Object.assign(clase, new_class);
      clase = clase;
      data = data;
      dialog.close();
    }}
  >
    <Person bind:person name="person[dni]">
      <label for="person[dni]">DNI</label>
    </Person>
    <button> <Icon {loading} /> Asignar </button>
  </Form>
</Modal>

<Modal id="add_class" let:dialog>
  <Form let:loading onSubmit={async () => {}}>
    <Field>
      <label for="level">Nivel</label>
      <select name="level" id="level">
        {#each data.levels as level}
          <option value={level.id}>{level.name}</option>
        {/each}
      </select>
    </Field>
    <Field>
      <label for="grade">Grado</label>
      <select name="grade" id="grade">
        {#each data.levels as level}
          <option value={level.id}>{level.name}</option>
        {/each}
      </select>
    </Field>
  </Form>
</Modal>
