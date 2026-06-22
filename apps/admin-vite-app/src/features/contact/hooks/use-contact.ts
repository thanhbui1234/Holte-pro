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

export function useContactSubmissions(filters?: { phone?: string; status?: import("../types/contact.types").ContactStatus; supporter?: string }) {
  return useQuery({
    queryKey: ["contact-submissions", filters],
    queryFn: async () => {
      const res = await contactApi.getSubmissions(filters);
      // Fallback to empty array if response is malformed or missing
      return res?.data?.data?.supportForms || [];
    },
  });
}

export function useUpdateContactStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, supporter }: { id: string | number; status: import("../types/contact.types").ContactStatus; supporter?: string }) => 
      contactApi.updateStatus(id, status, supporter),
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
