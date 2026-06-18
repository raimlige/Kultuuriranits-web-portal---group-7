import { AddFavorites } from "./AddFavorites";
import { RemoveFavorites } from "./RemoveFavorites";
import { Favorites } from "../models/Favorites";

type Props = {
  programId: number;
  personId: number;
  favorites: Favorites[];
  apiUrl: string | undefined;
};

export function TeacherProgramActions({
  programId,
  personId,
  favorites,
  apiUrl,
}: Props) {
  const favoriteRelation = favorites.find(
    (favorite) => favorite.program?.id === programId
  );

  if (favoriteRelation) {
    return (
      <RemoveFavorites
        favoriteId={favoriteRelation.id}
        apiUrl={apiUrl}
      />
    );
  }

  return (
    <AddFavorites
      programId={programId}
      personId={personId}
      apiUrl={apiUrl}
    />
  );
}