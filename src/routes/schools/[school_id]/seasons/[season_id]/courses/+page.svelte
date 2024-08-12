<script lang="ts">
  import { page } from "$app/stores";
  import { Button, Icon, Modal, Table } from "$lib/components";
  import { message } from "$lib/stores/message";
  import { groupBy } from "$lib/utils/groupBy";

  export let data;
  const levels = groupBy(data.school_courses, (school_course) => JSON.stringify(school_course.level));
  $: season_ids = data.season_courses.map(({ course_id, level_id }) => `${course_id}-${level_id}`);
  let selected_school_course = data.school_courses[0];
  let selected_season_course = data.season_courses[0];
</script>

<main>
  <h1>Cursos</h1>
  <div class="grid auto-fit gap3">
    {#each Object.entries(levels) as [level_string, school_courses]}
      {@const level = JSON.parse(level_string)}
      <section class="panel">
        <h2>{level.name}</h2>
        <div class="grid gap0">
          {#each school_courses || [] as school_course}
            {@const season_course = data.season_courses.find(
              ({ level_id, course_id }) => school_course.level_id === level_id && course_id === school_course.course_id,
            )}
            <div class="flex content items" style="--c: space-between">
              <label class="flex content items gap1">
                <input
                  type="checkbox"
                  value={school_course.course?.id}
                  on:click={async (e) => {
                    if (e.currentTarget.checked) {
                      const { error } = await data.supabase.from("season_courses").insert({
                        course_id: Number(school_course.course?.id),
                        season_id: Number($page.params.season_id),
                        level_id: level.id,
                      });
                      console.log(error);
                      if (error) e.preventDefault();
                      return;
                    }
                    const { error } = await data.supabase
                      .from("season_courses")
                      .delete()
                      .match({
                        course_id: Number(school_course.course?.id),
                        season_id: Number($page.params.season_id),
                        level_id: level.id,
                      });
                    if (error) return e.preventDefault();
                  }}
                  checked={Boolean(season_course)}
                />
                {school_course.course?.name}
              </label>
              {#if season_course}
                <div class="flex items">
                  <input
                    type="number"
                    value={season_course?.order}
                    on:change={async (e) => {
                      const { error: err } = await data.supabase
                        .from("season_courses")
                        .update({ order: Number(e.currentTarget.value) })
                        .eq("id", season_course.id);
                      if (err) return message.set(err);
                    }}
                  />
                  <Button
                    data-style="text"
                    on:click={() => {
                      //season_course = data.season_courses.find(({ course_id }) => school_course.course_id === course_id);
                      selected_school_course = school_course;
                      //@ts-ignore
                      selected_season_course = data.season_courses.find(
                        ({ course_id, level_id }) => school_course.course_id === course_id && level_id === level.id,
                      );
                    }}
                    data-size="tiny"
                    data-shape="square"
                    style="--c: center"
                    onclick="competences_modal.showModal()"
                  >
                    <Icon icon="ph:eye" />
                  </Button>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </section>
    {/each}
  </div>
</main>

<Modal id="competences_modal">
  <h2>Competencias de {selected_school_course.course?.name}</h2>
  <section class="grid gap0">
    {#each selected_school_course.course?.competences || [] as competence}
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
