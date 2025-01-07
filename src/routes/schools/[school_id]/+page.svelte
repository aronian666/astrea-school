<script lang="ts">
  import { page } from "$app/stores";
  import { Button, Icon, Modal, Table } from "$lib/components";
  import Form from "$lib/components/Form.svelte";
  import { message } from "$lib/stores/message";

  export let data;
  const usersPromise = data.supabase.from("users").select("id, name");
</script>

<section class="flex wrap auto-fit" style="--gap: var(--size3)">
  <picture class="panel" style="aspect-ratio: 1; --max: 30%">
    <img
      src={data.school_user.school.logo}
      alt={data.school_user.school.name}
    />
  </picture>
  <div style="--max: 70%">
    <hgroup class="flex gap1 content" style="--c: space-between">
      <h1>{data.school_user.school.name}</h1>
      <button
        data-shape="square"
        popovertarget="store_options"
        style="anchor-name: --store_options; --c: center"
        data-size="small"
        data-style="tonal"
      >
        <Icon icon="ph:dots-three-outline" />
      </button>
      <div
        popover="auto"
        class="panel menu"
        id="store_options"
        style="position-anchor: --store_options; position-area: bottom span-left; --display: grid; --c: start"
      >
        <button data-style="text" data-size="small" data-shape="menu">
          <Icon icon="ph:trash" normal="light" />
          Eliminar
        </button>
        <button data-style="text" data-size="small" data-shape="menu">
          <Icon icon="ph:pen" normal="light" />
          Editar
        </button>
      </div>
    </hgroup>
  </div>
</section>
<section class="grid gap3">
  <hgroup class="flex content items" style="--c: space-between">
    <h2>Usuarios</h2>
    <Button onclick="add_school_user.showModal()">Agregar usuarios</Button>
  </hgroup>
  <Table array={data.school_users} let:item let:index>
    <tr>
      <td>{item.user?.email}</td>
      <td>{item.user?.name}</td>
      <td>{item.role?.name}</td>
      <td>
        <div>
          <Button
            data-style="text"
            data-size="small"
            data-shape="square"
            let:loading
            onClick={async () => {
              if (!confirm("Estas seguro?")) return;
              const { error } = await data.supabase
                .from("school_users")
                .delete()
                .match({ user_id: item.user_id, school_id: item.school_id });
              if (error) message.set(error);
              data.school_users.splice(index, 1);
              data = data;
            }}
          >
            <Icon icon="ph:trash" {loading} />
          </Button>
        </div>
      </td>
    </tr>
  </Table>
</section>

<Modal id="add_school_user" let:dialog>
  <Form
    onSubmit={async (e) => {
      const { data: school_user, error: err } = await data.supabase
        .from("school_users")
        .insert({
          user_id: e.currentTarget.user_id.value,
          school_id: Number($page.params.school_id),
          role_id: 1,
        })
        .select("*, user:users(name, email, picture), role:roles(*)")
        .single();
      if (err) return message.set(err);
      data.school_users.push(school_user);
      data = data;
      dialog.close();
    }}
  >
    <label>
      <span>Usuario</span>
      <select name="user_id" id="user_id">
        {#await usersPromise then { data: users, error: err }}
          {#each users || [] as user}
            <option value={user.id}>{user.name}</option>
          {/each}
        {/await}
      </select>
    </label>
    <button> Agregar </button>
  </Form>
</Modal>
