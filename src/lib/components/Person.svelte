<script lang="ts">
  import { page } from "$app/stores";
  import { message } from "$lib/stores/message";
  import type { TablesInsert } from "$lib/types/supabase";

  import { Icon, Field } from ".";
  export let type: "dni" | "ruc" = "dni";
  export let required = false;

  export let name = "";
  export let person: TablesInsert<"persons"> = {
    dni: "",
    first_name: "",
    last_name1: "",
    last_name2: "",
  };
  export let value: string | undefined | null = person.dni;
</script>

<Field let:bindLoading let:setError let:loading>
  <slot />
  <input
    {required}
    type="number"
    bind:value
    on:blur={(e) => {
      const value = e.currentTarget.value;
      if (value?.length === 0) return setError(e.currentTarget, "");
      if (!(value?.length === 8 || value?.length === 11)) {
        setError(e.currentTarget, "No es un numero valido");
      }
    }}
    on:input={bindLoading(async (e) => {
      const input = e.currentTarget;
      const value = input.value;
      if ((type === "ruc" && value?.length === 11) || (type === "dni" && value?.length === 8)) {
        const { data: p } = await $page.data.supabase.from("persons").select().eq("dni", value).maybeSingle();
        if (p) return (person = p);
        const personReniec = await fetch(`/api/person?query=${type}?numero=${value}`).then((r) => r.json());
        if (!personReniec.numeroDocumento) {
          return setError(input, `No se encontro al ${type}: ${value}`);
        }
        console.log(personReniec);
        const [last_name1, last_name2, ...first_name] = personReniec.nombre.split(" ");
        person = {
          last_name1,
          last_name2,
          first_name: first_name.join(" "),
          dni: value,
        };

        const { data: new_person, error: err } = await $page.data.supabase
          .from("persons")
          .insert(person)
          .select()
          .single();

        if (err) return message.set(err);
        return (person = new_person);
      }
      person = {
        dni: "",
        first_name: "",
        last_name1: "",
        last_name2: "",
      };
    })}
    {name}
    id={name}
    {...$$restProps}
  />
  {#if loading}
    <div class="panel">
      <Icon {loading} />
    </div>
  {/if}
  {#if person.last_name1}
    <article class="panel">
      <hgroup>
        <h4>{person.last_name1} {person.last_name2} {person.first_name}</h4>
        <small>{person.dni}</small>
      </hgroup>
    </article>
  {/if}
</Field>
