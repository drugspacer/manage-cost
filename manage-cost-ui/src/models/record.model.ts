import Person from "./person.model";

interface RecordItem {
  landMoney?: number;
  borrowMoney?: number;
  person: Person;
}

export default RecordItem;
