import FavCard from "@components/fav-card";
import Loader from "@components/loader";
import { Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { trpc } from "src/utils/trpc";
import noFoundImage from "@public/bookmark.png";
import Image from "next/image";
import { useStore } from "src/store/store";
import { uniqueId } from "lodash";

function CategoryPage() {
  const router = useRouter();
  const { slug, searchBy, status, orderBy, label } = router.query;

  const setRefetchFavorites = useStore((state) => state.setRefetchFavorites);

  const { ref, inView } = useInView({ threshold: 0 });

  const { data, fetchNextPage, hasNextPage, refetch, isLoading } = trpc.useInfiniteQuery(
    [
      "favorites.get-favorites",
      {
        category: "/" + slug,
        limit: 10,
        searchBy: searchBy as string | undefined,
        status: status as string | undefined,
        orderBy: orderBy as string | undefined,
        labels: label as string[] | undefined
      }
    ],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor
    }
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  useEffect(() => {
    setRefetchFavorites(refetch);
  }, []);

  return (
    <div className="h-full">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(22rem,1fr))] gap-7">
        {data &&
          data.pages.map((page, index) =>
            page.favorites.map((favorite) => (
              <FavCard key={uniqueId() + favorite.id} favorite={favorite} refetch={refetch} />
            ))
          )}
      </div>
      {data && data.pages[0]?.favorites.length === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex justify-center mb-5">
            <Image
              src={noFoundImage}
              alt="Save icons created by bqlqn - Flaticon"
              width="120"
              height="120"
            />
          </div>

          <Typography variant="h3" className="w-full text-white font-bold">
            No favorites found
          </Typography>
        </div>
      )}
      <div className="w-full mt-3">{isLoading && <Loader size={50} inButton={false} />}</div>

      <span style={{ visibility: "hidden" }} ref={ref}>
        intersection observer marker
      </span>
    </div>
  );
}

export default CategoryPage;
