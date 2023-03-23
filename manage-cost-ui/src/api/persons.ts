import Person from "../models/person.model";

export const getPersons = async (): Promise<Person[]> => {
  const response = await fetch("/persons");
  return response.json();
};
