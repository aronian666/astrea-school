import { goto, preloadData, pushState } from "$app/navigation";
export const shallowModal = async (event: MouseEvent & {
  currentTarget: EventTarget & HTMLAnchorElement;
}, data: { [key: string]: any } = {}) => {
  const { href, dataset } = event.currentTarget;
  const result = await preloadData(href);
  // @ts-ignore
  result.data.supabase = null;

  if (result.type === "loaded" && result.status === 200) {
    pushState(href, { data: result.data, dataset: { ...data, ...JSON.parse(JSON.stringify(dataset)) } });
    setTimeout(() => {
      const dialog = document.querySelector(`#${dataset.modal}`) as HTMLDialogElement;
      dialog.showModal();
    }, 1)
  } else goto(href);

}