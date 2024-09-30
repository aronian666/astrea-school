<script lang="ts">
  import { page } from "$app/stores";
  import { Button, Form, Icon, Modal, Person, Table } from "$lib/components";
  import { message } from "$lib/stores/message";
  import type { TablesInsert } from "$lib/types/supabase.js";

  export let data;
  let class_season_courses: typeof data.class.class_season_courses = [];
  let person: TablesInsert<"persons"> = {
    dni: "",
    first_name: "",
    last_name1: "",
    last_name2: "",
  };
</script>

<section class="flex direction">
  <Table
    array={data.class.class_season_courses}
    let:item
    header={[{ name: "Curso" }, { name: "Profesor" }]}
  >
    <tr>
      <td>
        <label class="flex items content gap1" style="--c: start">
          <input
            type="checkbox"
            value={item}
            bind:group={class_season_courses}
          />
          {item.season_course.course.name}
        </label>
      </td>
      <td>{item.person?.full_name || ""}</td>
      <td>
        <div class="flex gap1 items content">
          <Button
            data-size="small"
            data-style="tonal"
            onclick="assing_person.showModal()"
            data-shape="square"
            on:click={() => (class_season_courses = [item])}
          >
            <Icon icon="ph:user-plus" />
          </Button>
          <a
            class="button"
            data-size="small"
            data-style="tonal"
            data-shape="square"
            href="{$page.url}/courses/{item.id}"
          >
            <Icon icon="ph:eye" />
          </a>
        </div>
      </td>
    </tr>
  </Table>
</section>

<Modal id="assing_person" let:dialog>
  <Form
    let:loading
    onSubmit={async () => {
      const { data: new_class_school_courses, error } = await data.supabase
        .from("class_season_courses")
        .update({ person_dni: person.dni || null })
        .in(
          "id",
          class_season_courses.map(({ id }) => id),
        )
        .select("person:persons(*)");
      if (error) return message.set(error);
      class_season_courses.forEach((v) =>
        Object.assign(v, {
          person_id: person.id,
          person: new_class_school_courses[0].person,
        }),
      );
      data = data;
      dialog.close();
    }}
  >
    <Person
      bind:person
      name="class_school_courses[person_id]"
      placeholder="DNI"
    >
      <label for="class_school_courses[person_id]">DNI</label>
    </Person>
    <button> <Icon {loading} icon="ph:plus" active="bold" /> Agregar </button>
  </Form>
</Modal>
