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
</script>

<main class="flex direction gap5">
  <h1>Clases</h1>
  <div class="grid auto-fit gap3">
    {#each Object.entries(levels) as [level, classesByLevel]}
      {@const classesByGrade = groupBy(classesByLevel || [], (clas) => clas.grade)}
      <section class="flex direction gap2 panel">
        <h2>{level}</h2>
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
              <td>
                <div class="flex items content gap0">
                  <Button
                    onclick="assign_person.showModal()"
                    on:click={() => (clase = clas)}
                    data-shape="square"
                    data-size="small"
                    data-style="text"
                  >
                    <Icon icon="ph:user-plus" />
                  </Button>
                  {clas.person?.full_name}
                </div>
              </td>
            </tr>
          {/each}
        </Table>
      </section>
    {/each}
  </div>
</main>

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
