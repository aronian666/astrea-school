<script lang="ts">
  import { Button, Form, Icon, Modal, Select, Table } from "$lib/components";
  import { message } from "$lib/stores/message";

  export let data;
  let course: (typeof data.courses)[0];
  $: compentences = data.courses
    .map((course) => course.competences)
    .flat()
    .filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id),
    );
  let competence_ids: number[] = [];
</script>

<main>
  <h1>Cursos</h1>
  <section class="flex direction">
    <Table
      array={data.courses}
      let:index
      let:item
      header={[{ name: "Curso" }, { name: "Competencias" }]}
    >
      <tr>
        <td>{item.name}</td>
        <td>
          {item.competences.length}
        </td>
        <td>
          <div class="flex items content">
            <Button
              data-style="tonal"
              on:click={() => (course = item)}
              onclick="competences.showModal()"
              data-shape="square"
              data-size="tiny"
            >
              <Icon icon="ph:note" />
            </Button>
            <Button
              data-style="tonal"
              let:loading
              onClick={async () => {
                if (!confirm("Esta seguro de querer eliminar este curso?"))
                  return;
                const { error } = await data.supabase
                  .from("courses")
                  .delete()
                  .eq("id", item.id);
                if (error) return message.set(error);
                data.courses.splice(index, 1);
                data = data;
              }}
              data-shape="square"
              data-size="tiny"
            >
              <Icon icon="ph:trash" {loading} />
            </Button>
          </div>
        </td>
      </tr>
    </Table>
  </section>
</main>

<Modal id="competences">
  {#if course}
    <form
      on:submit|preventDefault={async (e) => {
        const { error } = await data.supabase.from("course_competences").upsert(
          competence_ids.map((competence_id) => ({
            competence_id,
            course_id: course.id,
          })),
        );
        if (error) return message.set(error);
        course.competences = compentences.filter(({ id }) =>
          competence_ids.includes(id),
        );
        competence_ids = [];
        course = course;
        data = data;
      }}
    >
      <label>
        <span>Competencias</span>
        <Select
          array={compentences}
          on:keydown={async (e) => {
            const input = e.currentTarget;
            // @ts-ingore
            if (e.key === "Enter") {
              e.preventDefault();
              const { data: competence, error } = await data.supabase
                .from("competences")
                // @ts-ignore
                .insert({ name: input.value })
                .select("id, name")
                .single();
              if (error) return message.set(error);
              const { error: err } = await data.supabase
                .from("course_competences")
                .insert({ competence_id: competence.id, course_id: course.id });
              if (err) return message.set(err);
              course.competences.push(competence);
              data = data;
              input.value = "";
            }
          }}
          bind:value={competence_ids}
        ></Select>
      </label>
      <button>
        <Icon icon="ph:plus" />
        Agregar
      </button>
    </form>
    <Table array={course.competences} let:item let:index>
      <tr>
        <td>{item.name}</td>
        <td>
          <Button
            let:loading
            data-shape="square"
            data-size="tiny"
            data-style="tonal"
            onClick={async () => {
              const { error } = await data.supabase
                .from("competences")
                .delete()
                .eq("id", item.id);
              if (error) return message.set(error);
              course.competences.splice(index, 1);
              course = course;
              data = data;
            }}
          >
            <Icon icon="ph:trash" {loading} />
          </Button>
        </td>
      </tr>
    </Table>
  {/if}
</Modal>
