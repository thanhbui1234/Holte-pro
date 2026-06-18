import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "shared-api/query-keys";
import { contactApi } from "../api/contact.api";

export function useContactCta() {
  return useQuery({
    queryKey: queryKeys.content.contact(),
    queryFn: async () => {
      const res = await contactApi.getCta();
      return res.data;
    },
  });
}

export function useUpdateContactCta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: contactApi.updateCta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.contact() });
    },
  });
}

export function useContactSubmissions() {
  return useQuery({
    queryKey: ["contact-submissions"],
    queryFn: async () => {
      const res = await contactApi.getSubmissions();
      return res.data;
    },
  });
}

export function useUpdateContactStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: import("../types/contact.types").ContactStatus }) => 
      contactApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-submissions"] });
    },
  });
}

export function useRemoveContactSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: contactApi.removeSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-submissions"] });
    },
  });
}
