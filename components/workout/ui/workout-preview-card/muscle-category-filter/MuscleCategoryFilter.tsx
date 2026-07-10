import { muscleApi } from "@/lib/api/muscle.api";
import { muscleQueryKeys } from "@/lib/exercise/keys";
import { useInfiniteOptionsQuery } from "@/lib/query/useInfiniteOptionsQuery";
import { Muscle } from "@/types/workout/response/shared.types";
import { CategoryFilter, CategoryFilterOption } from "./CategoryFilter";
import { CategoryFilterSkeleton } from "./CategoryFilterSkeleton";

interface MuscleCategoryFilterProps {
  selectedMuscleIds: number[];
  onChange: (muscleIds: number[]) => void;
}

export function MuscleCategoryFilter({
  selectedMuscleIds,
  onChange,
}: MuscleCategoryFilterProps) {
  const { data, isLoading, isError } = useInfiniteOptionsQuery<Muscle>({
    url: muscleApi.getAll(),
    queryKey: muscleQueryKeys.all,
    limit: 6,
  });

  const muscles = data?.pages.flatMap((page) => page.data) ?? [];

  const options: CategoryFilterOption<number>[] = muscles.map((muscle) => ({
    label: muscle.name,
    value: muscle.id,
  }));

  if (isLoading) return <CategoryFilterSkeleton />;

  if (isError || options.length === 0) return null;

  return (
    <CategoryFilter
      options={options}
      selectedValues={selectedMuscleIds}
      onChange={onChange}
      allLabel="All"
    />
  );
}
