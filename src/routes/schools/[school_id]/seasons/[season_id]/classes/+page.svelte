<script lang="ts">
  import { Button, Field, Form, Icon, Modal, Person, Table } from "$lib/components";
  import { page } from "$app/stores";
  import { groupBy } from "$lib/utils/groupBy";
  import type { TablesInsert } from "$lib/types/supabase.js";
  import { message } from "$lib/stores/message";
  import { formToJson } from "$lib/utils";
  export let data;
  $: levels = groupBy(data.classes, (clas) => String(clas.level?.name));
  let person: TablesInsert<"persons"> = {
    dni: "",
    first_name: "",
    last_name1: "",
    last_name2: "",
  };
  let clase = data.classes[0];
  let levelSelected = data.levels[0];
  /* let newClass: TablesInsert<"classes"> = {
    grade: data.levels[0].grades[0],
    level_id: data.levels[0].id,
    season_id: Number($page.params.season_id),
    section_id: 0,
  }; */
</script>

<section>
  <Button data-style="gradient" onclick="add_class.showModal()">Agregar clase</Button>
</section>
<div class="grid auto-fit gap3" style="--width: 20rem">
  {#each Object.entries(levels) as [level, classesByLevel]}
    {@const classesByGrade = groupBy(classesByLevel, (clas) => clas.grade)}
    <section class="flex direction gap2 panel">
      <h3>{level}</h3>
      <Table array={Object.entries(classesByGrade)} header={[{ name: "Grado" }, { name: "Secciones" }]} let:item>
        <tr>
          <td class="tcenter">{item[0]}</td>

          <td>
            <div class="flex content wrap gap0">
              {#each item[1] || [] as clas}
                <a data-size="small" data-shape="square" data-style="tonal" class="button" href="classes/{clas.id}">
                  {clas.section?.name}
                </a>
              {/each}
            </div>
          </td>
        </tr>
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
  <Form
    let:loading
    onSubmit={async (e) => {
      const form = formToJson(new FormData(e.currentTarget));
      const { error, data: new_class } = await data.supabase
        .from("classes")
        .insert({
          grade: Number(form.grade),
          level_id: levelSelected.id,
          season_id: Number($page.params.season_id),
          section_id: 1,
        })
        .select("*, level:levels(name), section:sections(name), person:persons(dni, full_name)")
        .single();
      if (error) return message.set(error);
      data.classes.push(new_class);
      data = data;
      dialog.close();
    }}
  >
    <hgroup class="grid">
      <h1>Agregar clase</h1>
      <small class="gray70">Seleccione el nivel y grado.</small>
    </hgroup>
    <Field>
      <label for="level_id">Nivel</label>
      <select name="level_id" id="level_id" bind:value={levelSelected}>
        {#each data.levels as level}
          <option value={level}>{level.name}</option>
        {/each}
      </select>
    </Field>
    <Field>
      <label for="grade">Grado</label>
      <select name="grade" id="grade">
        {#each levelSelected.grades as grade}
          <option value={grade}>{grade}</option>
        {/each}
      </select>
    </Field>
    <button> Agregar </button>
  </Form>
</Modal>
