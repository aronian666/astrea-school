<script lang="ts">
  import { page } from "$app/stores";
  import { message } from "$lib/stores/message";
  import type { TablesInsert } from "$lib/types/supabase";

  import { Icon } from ".";
  import Fieldset from "./Fieldset.svelte";
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

<Fieldset let:bindLoading let:setError let:loading>
  <slot />
  <label>
    <span>{type.toUpperCase()}</span>
    <input
      {required}
      type="number"
      bind:value
      placeholder=" "
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
        if (
          (type === "ruc" && value?.length === 11) ||
          (type === "dni" && value?.length === 8)
        ) {
          const { data: p } = await $page.data.supabase
            .from("persons")
            .select()
            .eq("dni", value)
            .maybeSingle();
          if (p) return (person = p);
          const { data: personReniec, success } = await fetch(
            `/api/person?type=dni&number=${value}`,
          ).then((r) => r.json());

          if (!success) {
            person.dni = value;
            return message.set({ message: "No se encontro", details: "" });
          }

          person = {
            last_name1: personReniec.apellido_paterno,
            last_name2: personReniec.apellido_materno,
            first_name: personReniec.nombres,
            dni: value,
          };
          console.log(person);

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
  </label>
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
</Fieldset>
