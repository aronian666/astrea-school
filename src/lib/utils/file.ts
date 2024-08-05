export const toFormDataFiles = (files: (FileList | undefined)[], names: string[]) => {
  const formData = new FormData();
  files.forEach((file, index) => {
    if (file && file[0]) {
      formData.append(`files[${index}][file]`, file[0]);
    }
    formData.append(`files[${index}][path]`, names[index]);
  });
  return formData;
}