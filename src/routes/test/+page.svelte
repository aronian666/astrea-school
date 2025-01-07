<script lang="ts">
    import type { TablesInsert } from "$lib/types/supabase.js";

    export let data;

    function parseCSV(data: string) {
        const lines = data.trim().split("\n"); // Split data into rows
        const persons: TablesInsert<"persons">[] = [];
        lines.slice(7, -1).forEach((line) => {
            const columns = line.split(";"); // Split each row by semicolon
            const rows = columns.map((col) => col.trim()); // Trim whitespace and add to result
            if (!rows[0]) return;
            const names = rows[1];
            const [last_name1, last_name2, ...first_name] = names.split(" ");
            persons.push({
                last_name1,
                last_name2,
                first_name: first_name.join(" "),
                dni: rows[4],
            });
        });

        return persons;
    }
</script>

<input
    type="file"
    on:change={async (e) => {
        const file = e.currentTarget.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            //@ts-ignore
            const content = e.target.result; // Get file content as text
            const persons = parseCSV(content);
            const { data: new_persons, error } = await data.supabase
                .from("persons")
                .insert(persons)
                .select();

            console.log(error);
        };
        reader.readAsText(file); // Read file as text
    }}
/>
