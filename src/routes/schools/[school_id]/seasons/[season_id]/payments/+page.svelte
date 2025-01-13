<script lang="ts">
    import { Pagination, Table } from "$lib/components";
    import { page } from "$app/stores";
    import { message } from "$lib/stores/message";
    import { downloadCSV, ExtendedDate } from "$lib/utils";
    export let data;
    async function dowdload() {
        const head = [
            "Fecha",
            "Nivel",
            "Grado",
            "Seccion",
            "DNI",
            "Estudiante",
            "Concepto",
            "Valor",
        ];
        const {
            data: payments,
            error: err,
            count,
        } = await data.supabase
            .from("payments")
            .select(
                "*,concept:concepts!inner(name), order:orders!inner(class_person:class_persons!inner(person:persons!inner(full_name, dni), class:classes!inner(level:levels!inner(name), area:areas(name, short_name), section:sections(name))))",
                { count: "exact" },
            )
            .eq("order.class_person.class.season_id", $page.params.season_id);
        if (err) return message.set(err);
        const rows = payments.map((payment) => {
            return [
                new ExtendedDate(payment.created_at).toIntl(),
                payment.order.class_person.class.level.name,
                payment.order.class_person.class.area?.short_name,
                payment.order.class_person.class.section?.name,
                payment.order.class_person.person.dni,
                payment.order.class_person.person.full_name,
                payment.concept.name,
                payment.final_value,
            ];
        });
        downloadCSV([head, ...rows], `Pagos`);
    }
</script>

<section>
    <hgroup>
        <h1>Pagos</h1>
        <button on:click={dowdload}>Descargar</button>
    </hgroup>
    <Table array={data.payments} let:item={payment}>
        <tr>
            <td>
                {new ExtendedDate(payment.created_at).toIntl()}
            </td>
            <td>
                {payment.order.class_person.class.level.name}
            </td>
        </tr>
    </Table>
</section>
