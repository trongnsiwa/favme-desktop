import React from "react";
import { Card, CardBody, Typography, Chip, IconButton, Tooltip } from "@material-tailwind/react";
import { AiFillStar, AiOutlineLink } from "react-icons/ai";
import { DynamicFaIcon } from "./dynamic-icon";
import * as Icons from "react-icons/fa";
import { Category, Favorite, FavoriteStatus, Label } from "@prisma/client";
import { trpc } from "src/utils/trpc";
import { toast } from "react-toastify";
import Loader from "./loader";
import { useStore } from "src/store/store";

type FavCardProps = {
  favorite: Favorite & { category: Category; labels: Label[] };
  refetch: () => void;
};

function FavCard({ favorite, refetch }: FavCardProps) {
  const setFavorite = useStore((state) => state.setFavorite);
  const toggleFavorite = useStore((state) => state.toggleFavorite);

  const { mutate, isLoading } = trpc.useMutation(["favorites.change-status"], {
    onSuccess: () => {
      toast.success(favorite.status === FavoriteStatus.FAVORED ? "Unfavored!" : "Favored!", {
        icon: favorite.status === FavoriteStatus.FAVORED ? "💔" : "💚"
      });
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const changeStatus = () => {
    mutate({
      id: favorite.id,
      status:
        favorite.status === FavoriteStatus.FAVORED
          ? FavoriteStatus.UNFAVORED
          : FavoriteStatus.FAVORED
    });
  };

  return (
    <Card className="hover:shadow-lg hover:shadow-fav-200">
      <CardBody className="flex flex-col justify-between h-full">
        <div>
          <img
            src={favorite.cover}
            alt={favorite.name}
            className="h-48 w-full rounded-xl cursor-pointer hover:opacity-90 object-cover"
            onClick={() => {
              setFavorite(favorite);
              toggleFavorite();
            }}
          />
          <Typography variant="h4" className="mt-5">
            {favorite.name}
          </Typography>
          <Typography className="mt-2 font-normal line-clamp-3 overflow-ellipsis">
            {favorite.description}
          </Typography>
          <Chip
            value={favorite.category.name}
            className={`mt-2 !normal-case text-sm bg-fav-500 text-white rounded-full !py-1.5 !pr-3 !pl-5`}
            icon={
              <DynamicFaIcon
                name={favorite.category.cover as keyof typeof Icons}
                color={favorite.category.color}
                size={18}
                className="ml-2"
              />
            }
          />
          <div className="flex mt-2 flex-wrap gap-1">
            {favorite.labels.map(
              (label, index) =>
                index <= 2 && (
                  <Chip
                    key={label.id}
                    value={label.name}
                    className={`!normal-case text-xs bg-gray-200 text-gray-700 rounded-full !py-1`}
                  />
                )
            )}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <Tooltip
            content={favorite?.link}
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0, y: 25 }
            }}
          >
            <IconButton
              className="btn-icon !rounded-full hover:!text-fav-200 hover:!border-fav-200"
              variant="outlined"
              size="md"
              onClick={() => window.open(favorite.link, "_blank")}
            >
              <AiOutlineLink className="w-8 h-8" />
            </IconButton>
          </Tooltip>
          {isLoading ? (
            <Loader size={45} inButton={false} />
          ) : (
            <>
              {favorite.status === "UNFAVORED" ? (
                <AiFillStar
                  className="text-gray-400 w-16 h-16 hover:text-fav-200 hover:cursor-pointer"
                  onClick={changeStatus}
                />
              ) : (
                <AiFillStar
                  className="text-fav-200 w-16 h-16 hover:text-gray-400 hover:cursor-pointer"
                  onClick={changeStatus}
                />
              )}
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

export default FavCard;
