import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { footerApi } from "../api/footer.api";

export function useFooter() {
  return useQuery({
    queryKey: ["content", "footer"],
    queryFn: async () => {
      const res = await footerApi.get();
      return res.data;
    },
  });
}

export function useUpdateFooter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: footerApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", "footer"] });
    },
  });
}
