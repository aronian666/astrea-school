<script lang="ts">
  import { onMount } from "svelte";

  type Letter = {
    value: string;
    color: string;
    width: string;
    family?: string;
  };
  const letters: Letter[] = [
    {
      value: "`la imaginacion`",
      color: "tomato",
      width: "13ch",
      family: "Garamond",
    },
    {
      value: "#la_santidad",
      color: "dodgerblue",
      width: "10ch",
      family: "Arial",
    },
    {
      value: "{el trabajo}",
      color: "purple",
      width: "9ch",
      family: "Brush Script MT",
    },
    {
      value: "<>la in.novacion</>",
      color: "red",
      width: "16ch",
      family: "Verdana",
    },
    {
      value: "l@_creatividad",
      color: "LimeGreen",
      width: "13ch",
    },
  ];
  let letter: Letter = letters[0];
  let index = 1;
  onMount(() => {
    const flip = setInterval(() => {
      letter = letters[index];
      if (index + 1 === letters.length) return (index = 0);
      index++;
    }, 4000);
    return () => clearInterval(flip);
  });
</script>

<div>
  Deja que <span style="--color: {letter.color}; width: {letter.width}; --angle: {(index * 360) / letters.length}deg"
    >{letter.value}</span
  > levite
</div>

<style>
  div {
    font-size: clamp(2rem, 3vw, 3rem);
    font-weight: 500;
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }
  span {
    transition: 0.3s;
    font-size: clamp(1.5rem, 2.5vw, 2.75rem);
    font-style: italic;
    display: grid;
    place-content: center;
    white-space: nowrap;
    color: var(--color);
    background: linear-gradient(var(--angle), color-mix(in srgb, var(--color) 10%, transparent), transparent);
  }
</style>
