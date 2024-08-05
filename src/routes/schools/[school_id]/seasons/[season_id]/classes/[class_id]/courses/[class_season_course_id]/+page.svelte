<script lang="ts">
  import { page } from "$app/stores";
  import { Table } from "$lib/components";

  export let data;
</script>

<main class="flex direction gap5">
  <hgroup>
    <h1>
      {data.class_school_course.season_course?.course?.name}
    </h1>
    <small
      >{data.class?.level?.name}
      {data.class?.grade}
      {data.class?.section?.name}</small
    >
  </hgroup>

  <section class="grid">
    <table class="bordered">
      <thead>
        <tr>
          <th>Alumno</th>
          {#each data.class_school_course?.season_course?.competences || [] as competence}
            <th>
              {competence.name}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each data.class.class_persons as class_person}
          <tr>
            <td>
              <a href="/schools/{$page.params.school_id}/seasons/{$page.params.season_id}/students/{class_person.id}">
                {class_person.person?.full_name}
              </a>
            </td>
            {#each data.class_school_course?.season_course?.competences || [] as competence}
              <td>
                <input type="number" />
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
    <Table class="bordered" array={data.class.class_persons} let:item>
      <tr> </tr>
    </Table>
  </section>
</main>
