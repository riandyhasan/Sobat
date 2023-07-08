export const monthNames: string[] = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const snakeCaseToTitleCase = (snakeCase: string): string => {
  const words = snakeCase.replace(/_/g, " ").split(" ");
  const titleCase = words
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
  return titleCase;
};

export const formatIndonesianDate = (date: Date): string => {
  const day: number = date.getDate();
  const monthIndex: number = date.getMonth();
  const year: number = date.getFullYear();

  const formattedDate: string = `${day} ${monthNames[monthIndex]} ${year}`;
  return formattedDate;
};

export const formatIndonesianDateToISO = (dateString: string): string => {
  const [day, monthName, year] = dateString.split(" ");

  const monthIndex: number = monthNames.findIndex((name) => name === monthName);
  const month: string = (monthIndex + 1).toString().padStart(2, "0");

  const formattedDate: string = `${year}-${month}-${day}`;
  return formattedDate;
};
