export interface UserType {
  email: string;
  first_name: string;
  last_name: string;
  image_url: string;
  id: number;
}

export interface Group {
  name: string;
  price: number;
  capacity: number;
  hour_limit: string;
  id: number;
}

export interface GroupType {
  status: string;
  invoice: number;
  group: Group;
}

export interface ReservationType {
  id: number;
  date: string;
  price: number;
  group: Group;
}

export interface MemberType {
  status: string;
  invoice: number;
  user: UserType;
}

export interface AdminReservationType {
  id: number;
  date: string;
  price: number;
  user: UserType;
}
