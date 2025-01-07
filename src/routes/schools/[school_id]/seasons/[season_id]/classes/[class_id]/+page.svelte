<script lang="ts">
  import { page } from "$app/stores";
  import {
    BreadCrumb,
    Button,
    Form,
    Icon,
    Modal,
    Person,
    Table,
  } from "$lib/components";
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
  function parseCSV(data: string) {
    const lines = data.trim().split("\n"); // Split data into rows
    const persons: TablesInsert<"persons">[] = [];
    lines.slice(7, -1).forEach((line) => {
      const columns = line.split(";"); // Split each row by semicolon
      const rows = columns.map((col) => col.trim()); // Trim whitespace and add to result
      if (!rows[0] || !rows[4]) return;
      const names = rows[1];
      const [last_name1, last_name2, ...first_name] = names.split(" ");
      persons.push({
        last_name1,
        last_name2,
        first_name: first_name.join(" "),
        dni: rows[4],
      });
    });

    return persons;
  }
</script>

<section class="grid">
  <table>
    <thead>
      <tr>
        <th>
          <input
            type="file"
            on:change={async (e) => {
              const file = e.currentTarget.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = async (e) => {
                //@ts-ignore
                const content = e.target.result; // Get file content as text
                //@ts-ignore
                const persons = parseCSV(content);

                const { data: new_persons, error } = await data.supabase
                  .from("persons")
                  .insert(persons)
                  .select();
                if (error) return message.set(error);
                const class_persons = new_persons.map((person) => {
                  return {
                    person_id: person.id,
                    class_id: data.class.id,
                  };
                });
                console.log(class_persons);
                const { data: new_class_persons, error: err } =
                  await data.supabase
                    .from("class_persons")
                    .insert(class_persons)
                    .select(
                      "id, person:persons!inner(full_name, first_name, last_name1, last_name2)",
                    );
                if (err) return message.set(err);
                console.log(new_class_persons);
                data.class.class_persons.push(...new_class_persons);
                data = data;
              };
              reader.readAsText(file); // Read file as text
            }}
          /></th
        >
        <th>Estudiante</th>

        <td>
          <div class="flex content">
            <Button
              data-shape="square"
              data-size="small"
              onclick="assing_student.showModal()"
            >
              <Icon icon="ph:user-plus" />
            </Button>
          </div>
        </td>
      </tr>
    </thead>
    <tbody>
      {#each data.class.class_persons as class_person, index}
        {@const popoverId = `options${class_person.id}`}

        <tr>
          <td class="tcenter">{index + 1}</td>
          <td>
            <a
              href="/schools/{$page.params.school_id}/seasons/{$page.params
                .season_id}/students/{class_person.id}"
              style="color: var(--black)"
            >
              {class_person.person.full_name}
            </a>
          </td>

          <td>
            <div class="grid content">
              <button
                data-size="small"
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
                style="position-anchor: --{popoverId}; position-area: bottom span-left; --display: grid; --c: start"
              >
                <Button
                  let:loading
                  onClick={async () => {
                    const { error } = await data.supabase
                      .from("class_persons")
                      .delete()
                      .eq("id", class_person.id);
                    if (error) return message.set(error);
                  }}
                  data-shape="menu"
                  data-style="text"
                  ><Icon icon="ph:trash" />
                  <Icon icon="ph:trash" {loading} />
                  Eliminar
                </Button>
                <Button data-shape="menu" data-style="text"
                  ><Icon icon="ph:pen" />Editar</Button
                >
                <Button data-shape="menu" data-style="text"
                  ><Icon icon="ph:books" />Descuentos</Button
                >
              </div>
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</section>

<Modal id="assing_student" let:dialog>
  <Form
    onSubmit={async () => {
      if (!person.id) {
        console.log(person);
        const { data: new_person, error: err } = await $page.data.supabase
          .from("persons")
          .insert(person)
          .select()
          .single();

        if (err) return message.set(err);
        person = new_person;
      }
      const { error, data: new_class_person } = await data.supabase
        .from("class_persons")
        .insert({
          class_id: data.class.id,
          person_id: Number(person.id),
        })
        .select(
          `id, person:persons!inner(full_name, first_name, last_name1, last_name2)`,
        )
        .single();
      if (error) return message.set(error);
      data.class.class_persons.push(new_class_person);
      data = data;
      dialog.close();
    }}
  >
    <h2 class="tcenter">Agregar estudiante</h2>
    <section class="grid gap3">
      <Person bind:person />
      <label>
        <span>Apellido paterno</span>
        <input
          type="text"
          name="last_name1"
          placeholder=" "
          bind:value={person.last_name1}
        />
      </label>
      <label>
        <span>Apellido materno</span>
        <input
          type="text"
          name="last_name2"
          placeholder=" "
          bind:value={person.last_name2}
        />
      </label>
      <label>
        <span>Apellido paterno</span>
        <input
          type="text"
          name="first_name"
          placeholder=" "
          bind:value={person.first_name}
        />
      </label>
    </section>
    <button>Agregar estudiante</button>
  </Form>
</Modal>
