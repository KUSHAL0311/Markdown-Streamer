import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertItem } from "@shared/routes";

export function useCreateItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertItem) => {
      const res = await fetch(api.items.create.path, {
        method: api.items.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        throw new Error("Failed to create item");
      }
      
      return api.items.create.responses[200].parse(await res.json());
    },
    // In a real app we might invalidate a list query here
    // onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.items.list.path] }),
  });
}
