import useSWR from "swr";
import { GroupType, MemberType, ReservationType } from "./types";

const fetcherAuth = async (url: string) =>
  await fetch(`${process.env.NEXT_PUBLIC_API_HOSTNAME}${url}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  }).then((r) => r.json());

export function useOwnedGroup() {
  const { data, error, mutate } = useSWR("/admin/group/", fetcherAuth);
  return {
    ownedGroup: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useMyReservations() {
  const { data, error, mutate } = useSWR("/user/reservations/", fetcherAuth);
  return {
    reservations:
      data?.sort(
        (a: ReservationType, b: ReservationType) =>
          Number(new Date(b.date)) - Number(new Date(a.date))
      ) || undefined,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useMyGroups() {
  const { data, error, mutate } = useSWR("/user/groups/", fetcherAuth);
  return {
    groups: data?.sort((a: GroupType, b: GroupType) => a.group.id - b.group.id),
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  };
}

export function useOwnedGroupMembers() {
  const { data, error, mutate } = useSWR("/admin/members/", fetcherAuth);
  return {
    members: data?.sort(
      (a: MemberType, b: MemberType) => a.user.id - b.user.id
    ),
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useOwnedGroupReservations() {
  const { data, error } = useSWR("/admin/reservations/", fetcherAuth, {
    refreshInterval: 60000,
  });
  return {
    reservations: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useGroupPlaces(group_id: number) {
  const { data, error } = useSWR(`/group/${group_id}/places/`, fetcherAuth);
  return {
    places: data?.places,
    isLoading: !error && !data,
    isError: error,
  };
}
