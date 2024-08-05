<script lang="ts">
  import { Button, Field, Form, Icon, Modal, Table } from "$lib/components/index.js";
  import { message } from "$lib/stores/message";
  import type { Tables, TablesInsert } from "$lib/types/supabase.js";
  import { page } from "$app/stores";

  export let data;
  $: levels = Object.groupBy(data.school_courses, (school_course) => String(school_course.level?.name));

  let insert_school_course: TablesInsert<"school_courses"> = {
    course_id: 0,
    level_id: 1,
    school_id: Number($page.params.school_id),
  };
</script>

<main class="flex direction gap5">
  <hgroup class="flex content items" style="--c: space-between">
    <h1>Cursos</h1>
    <Button onclick="add_course.showModal()"><Icon icon="ph:plus" active="bold" /> Agregar</Button>
  </hgroup>

  <div class="grid auto-fit gap3">
    {#each Object.entries(levels) as [level, school_courses]}
      <section>
        <h2>{level}</h2>
        <Table array={school_courses} let:item let:index>
          <tr>
            <td>{item.course?.name}</td>
          </tr>
        </Table>
      </section>
    {/each}
  </div>
</main>

<Modal id="add_course" let:dialog>
  <Form
    let:loading
    onSubmit={async () => {
      const { data: school_course, error } = await data.supabase
        .from("school_courses")
        .insert(insert_school_course)
        .select("*, course:courses(name), level:levels(name)")
        .single();
      if (error) return message.set(error);
      data.school_courses.push(school_course);
      data = data;
      dialog.close();
    }}
  >
    <h2>Agregar curso</h2>
    <Field>
      <label for="course_id">Curso</label>
      <select id="course_id" bind:value={insert_school_course.course_id}>
        {#each data.courses as course}
          <option value={course.id}>{course.name}</option>
        {/each}
      </select>
    </Field>
    <Field>
      <label for="level_id">Curso</label>
      <select id="level_id" bind:value={insert_school_course.level_id}>
        {#each data.levels as level}
          <option value={level.id}>{level.name}</option>
        {/each}
      </select>
    </Field>
    <button>
      <Icon icon="ph:plus" {loading} />
      Agregar
    </button>
  </Form>
</Modal>
