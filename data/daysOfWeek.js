import uuid from "uuid/dist/v4";

export const Sunday = [
  { id: uuid(), content: "First task" },
  { id: uuid(), content: "Second task" },
];

export const Monday = [
  { id: uuid(), content: "Third task" },
  { id: uuid(), content: "Fourth task" },
  { id: uuid(), content: "Fifth task" },
];

export const Tuesday = [
  { id: uuid(), content: "Sixth task" },
  { id: uuid(), content: "Seventh task" },
];

export const Wedndesday = [
  { id: uuid(), content: "Eighth task" },
  { id: uuid(), content: "Ninth task" },
  { id: uuid(), content: "Tenth task" },
];

export const Thurdsay = [
  { id: uuid(), content: "Eleventh task" },
  { id: uuid(), content: "Twelfth task" },
];

export const Friday = [
  { id: uuid(), content: "Thirteenth task" },
  { id: uuid(), content: "Fourthteenth task" },
  { id: uuid(), content: "Fifteenth task" },
];

export const Saturday = [
  { id: uuid(), content: "Sixteenth task" },
  { id: uuid(), content: "Seventeenth task" },
];

export const columnsFromBackEnd = [
  {
    id: uuid(),
    name: "Sunday",
    items: Sunday,
  },
  {
    id: uuid(),
    name: "Monday",
    items: Monday,
  },
  {
    id: uuid(),
    name: "Tuesday",
    items: Tuesday,
  },
  {
    id: uuid(),
    name: "Wedndesday",
    items: Wedndesday,
  },
  {
    id: uuid(),
    name: "Thursday",
    items: Thurdsay,
  },
  {
    id: uuid(),
    name: "Friday",
    items: Friday,
  },
  {
    id: uuid(),
    name: "Saturday",
    items: Saturday,
  },
];
