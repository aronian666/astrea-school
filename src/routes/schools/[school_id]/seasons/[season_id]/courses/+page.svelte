<script lang="ts">
  import { page } from "$app/stores";
  import { Button, Field, Form, Icon, Modal, Table } from "$lib/components";
  import { message } from "$lib/stores/message";
  import { formToJson } from "$lib/utils";
  import { groupBy } from "$lib/utils/groupBy";
  export let data;
  $: levels = groupBy(data.season_courses, (season_course) => season_course.level.name);
  let selected_season_course = data.season_courses[0];
</script>

<section class="wrap flex content gap0" style="--c: space-between">
  <hgroup class="grid">
    <h1>Cursos</h1>
    <small>Agrege los cursos para cada area de su vida.</small>
  </hgroup>
  <Button data-size="small" onclick="add_course.showModal()">
    <Icon icon="ph:plus" active="bold" />
    Agregar curso
  </Button>
</section>

<div class="grid auto-fit gap3">
  {#each Object.entries(levels) as [level, season_courses], id}
    <section class="panel">
      <h2>{level}</h2>
      <div class="grid gap0">
        {#each season_courses as season_course}
          {@const anchorName = `options${season_course.id}`}
          <div class="flex content items" style="--c: space-between;">
            {season_course.course.name}
            <button
              data-style="tonal"
              data-size="tiny"
              data-shape="square"
              popovertarget={anchorName}
              style="anchor-name: --{anchorName}; --c: center"
            >
              <Icon icon="ph:dots-three" active="bold" />
            </button>
            <div
              class="panel menu"
              popover="auto"
              id={anchorName}
              style="position-anchor: --{anchorName}; inset-area: bottom span-left; --display: grid; --c: start"
            >
              <Button
                data-shape="menu"
                data-style="text"
                onclick="competences_modal.showModal()"
                on:click={() => (selected_season_course = season_course)}
              >
                <Icon icon="ph:eye" />
                Competencias
              </Button>
              <Button data-shape="menu" data-style="text">
                <Icon icon="ph:trash" />
                Eliminar
              </Button>
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/each}
</div>

<Modal id="competences_modal">
  <h2>Competencias de {selected_season_course.course.name}</h2>
  <section class="grid gap0">
    {#each selected_season_course.course.competences as competence}
      <label>
        <input
          type="checkbox"
          value={competence.id}
          checked={selected_season_course.competences.some(({ id }) => id === competence.id)}
          on:click={async (e) => {
            const instance = data.supabase.from("season_course_competences");
            if (e.currentTarget.checked) {
              const { error } = await instance.upsert({
                competence_id: competence.id,
                season_course_id: selected_season_course.id,
              });
              if (error) return (e.currentTarget.checked = false);
              else selected_season_course.competences.push(competence);
            } else {
              const { error } = await instance
                .delete()
                .match({ competence_id: competence.id, season_course_id: selected_season_course.id });
              if (error) return (e.currentTarget.checked = true);
              else
                selected_season_course.competences = selected_season_course.competences.filter(
                  ({ id }) => competence.id != id,
                );
            }
            selected_season_course = selected_season_course;
            data = data;
          }}
        />
        {competence.name}
      </label>
    {/each}
  </section>
</Modal>

<Modal id="add_course" let:dialog>
  <Form
    onSubmit={async (e) => {
      const season_course = formToJson(new FormData(e.currentTarget));
      season_course.season_id = $page.params.season_id;
      const { error, data: new_season_course } = await data.supabase
        .from("season_courses")
        .insert(season_course)
        .select("*, level:levels!inner(id, name), course:courses!inner(name, competences(*)), competences(id, name)")
        .single();
      if (error) return message.set(error);
      data.season_courses.push(new_season_course);
      data = data;
      dialog.close();
    }}
  >
    <h2>Agregar curso</h2>
    <Field>
      <label for="level_id"> Nivel </label>
      <select name="level_id" id="level_id">
        {#each data.levels as level}
          <option value={level.id}>{level.name}</option>
        {/each}
      </select>
    </Field>
    <Field>
      <label for="course_id">Curso</label>
      <select name="course_id" id="course_id">
        {#each data.courses as course}
          <option value={course.id}>{course.name}</option>
        {/each}
      </select>
    </Field>
    <button> Agregar </button>
  </Form>
</Modal>
