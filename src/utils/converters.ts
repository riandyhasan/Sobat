export const snakeCaseToTitleCase = (snakeCase: string): string => {
  const words = snakeCase.replace(/_/g, " ").split(" ");
  const titleCase = words
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
  return titleCase;
};
