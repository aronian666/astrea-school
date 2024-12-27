<script lang="ts">
  import { Form, Pagination, Table } from "$lib/components";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { downloadCSV, ExtendedDate, Filter } from "$lib/utils";
  import { message } from "$lib/stores/message";
  export let data;
  let concepts: { id: number; name: string }[] = [];
  onMount(() => {
    data.supabase
      .from("concepts")
      .select("id, name")
      .then((data) => (concepts = data.data!));
  });
  async function download() {
    const filter = new Filter($page.url);
    filter.perPage = 1000;
    const query = data.supabase
      .from("carts")
      .select(
        `
    *, 
    concept:concepts!inner(name, value), 
    class_person:class_persons!inner(class:classes(season_id, area:areas(name, short_name), section:sections(name), level:levels(name)), 
    person:persons!inner(id, full_name))`,
        { count: "exact" },
      )
      .eq("class_person.class.season_id", $page.params.season_id);
    const { data: carts, error: err, count } = await filter.paginate(query);
    if (err) return message.set(err);

    const rows = carts.map((row) => {
      return [
        row.id,
        new ExtendedDate(row.created_at).toIntl({
          month: "2-digit",
          year: "2-digit",
          day: "2-digit",
        }),
        row.class_person?.class?.level?.name,
        row.class_person?.class?.area?.short_name,
        row.class_person?.class?.section?.name,
        row.class_person?.person?.full_name,
        row.concept.name,
        row.concept.value,
      ].flat();
    });
    const head = [
      "id",
      "Fecha",
      "Nivel",
      "Grado",
      "Seccion",
      "Estudiante",
      "Concepto",
      "Valor",
    ];
    downloadCSV([head, ...rows], `Estudiantes`);
  }
</script>

<Form
  data-sveltekit-keepfocus
  data-sveltekit-noscroll
  data-sveltekit-replacestate
  class="flex gap1"
>
  <label>
    <span>Concepto</span>
    <select
      name="matches[0][value]"
      on:change={(e) => {
        e.currentTarget.closest("form")?.requestSubmit();
      }}
      value={$page.url.searchParams.get("matches[0][value]") || ""}
    >
      <option value=""></option>
      {#each concepts as concept}
        <option value={concept.id.toString()}>{concept.name}</option>
      {/each}
    </select>
    <input type="hidden" name="matches[0][params]" value="concept_id eq =" />
  </label>
  <button style="--color: var(--green)" on:click={download}> Descargar </button>
</Form>

<section>
  <Table
    array={data.carts}
    header={[{ name: "Concepto" }, { name: "Clase" }, { name: "Cantidad" }]}
    let:item
  >
    <tr>
      <td>{item.concept_id}</td>
      <td>{item.class_person.person.full_name}</td>
      <td>
        <div class="grid">
          <strong>{item.class_person.class?.level?.name}</strong>
          <small
            >{item.class_person?.class?.area?.short_name} - {item.class_person
              .class?.section?.name}</small
          >
        </div>
      </td>
      <td>{item.concept.name}</td>
      <td>{item.concept.value}</td>
    </tr>
  </Table>
  {#if data.count}
    <Pagination count={data.count} />
  {/if}
</section>
