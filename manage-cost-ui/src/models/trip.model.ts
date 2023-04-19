import Activity from "./activity.model";
import PersonTrip from "./personTrip.model";
import { Id, Version } from "./model";
import { User } from "./user.model";

interface Trip extends Id, Version {
  place: string;
  name: string;
  persons: PersonTrip[];
  archive: boolean;
  activities: Activity[];
  user: User;
}

export default Trip;
