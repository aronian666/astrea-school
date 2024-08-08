<script lang="ts">
  import { Table } from "$lib/components";
  import { page } from "$app/stores";
  import { groupBy } from "$lib/utils/groupBy.js";
  export let data;
  const levels = groupBy(data.classes, (clas) => String(clas.level?.name));
</script>

<main class="flex direction gap5">
  <h1>Clases</h1>
  <div class="grid auto-fit gap3">
    {#each Object.entries(levels) as [level, classesByLevel]}
      {@const classesByGrade = groupBy(classesByLevel || [], (clas) => clas.grade)}
      <section class="flex direction gap2 panel">
        <h2>{level}</h2>
        <Table array={Object.entries(classesByGrade)} header={[{ name: "Grado" }, { name: "Secciones" }]} let:item>
          <tr>
            <td class="tcenter">{item[0]}</td>
            <td>
              <div class="flex gap0 items content">
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
</main>
