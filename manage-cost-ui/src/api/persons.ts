import Person from "../models/person.model";
import axiosApi from "./axios";

export const getPersons = () => axiosApi<Person[]>({ url: "/persons" });
