<script lang="ts">
  import { page } from "$app/stores";
  import { BreadCrumb, Button, Form, Icon, Modal, Person, Table } from "$lib/components";
  import { message } from "$lib/stores/message";
  import type { TablesInsert } from "$lib/types/supabase";
  export let data;
  const links = [
    { name: "Estudiantes", path: "/", icon: "ph:student" },
    { name: "Courses", path: "/courses", icon: "ph:courses" },
  ];
  let person: TablesInsert<"persons"> = {
    dni: "",
    first_name: "",
    last_name1: "",
    last_name2: "",
  };
  let class_school_courses: typeof data.class.class_season_courses = [];
</script>

<main class="flex direction gap5">
  <hgroup class="flex content items" style="--c: space-between">
    <h1>{data.class.level?.name} {data.class.grade} {data.class.section?.name}</h1>
    <Button onclick="assing_person.showModal()">
      <Icon icon="ph:user-plus" />
      Agregar persona
    </Button>
  </hgroup>
  <section class="flex direction">
    <Table array={data.class.class_season_courses} let:item header={[{ name: "Curso" }, { name: "Profesor" }]}>
      <tr>
        <td>
          <div>
            <label class="flex items content" style="--c: start">
              <input type="checkbox" value={item} bind:group={class_school_courses} />
              {item.season_course?.course?.name}
            </label>
          </div>
        </td>
        <td>{item.person?.full_name || ""}</td>
        <td>
          <div class="flex gap0 items content">
            <Button
              data-size="small"
              data-style="tonal"
              onclick="assing_person.showModal()"
              data-shape="square"
              on:click={() => (class_school_courses = [item])}
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
</main>

<Modal id="assing_person" let:dialog>
  <Form
    let:loading
    onSubmit={async () => {
      const { data: new_class_school_courses, error } = await data.supabase
        .from("class_season_courses")
        .update({ person_dni: person.dni })
        .in(
          "id",
          class_school_courses.map(({ id }) => id),
        )
        .select("person:persons(*)");
      if (error) return message.set(error);
      class_school_courses.forEach((v) =>
        Object.assign(v, { person_id: person.id, person: new_class_school_courses[0].person }),
      );
      data = data;
      dialog.close();
    }}
  >
    <Person bind:person name="class_school_courses[person_id]" placeholder="DNI">
      <label for="class_school_courses[person_id]">DNI</label>
    </Person>
    <button> <Icon {loading} icon="ph:plus" active="bold" /> Agregar </button>
  </Form>
</Modal>
