import { useStore } from "src/store/store";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import favmeLogo from "@public/favme-white-text-logo.png";
import { trpc } from "src/utils/trpc";
import { DynamicFaIcon } from "@components/dynamic-icon";
import * as Icons from "react-icons/fa";
import { IconButton, Input, Tooltip } from "@material-tailwind/react";
import { BiCategory, BiSearch } from "react-icons/bi";
import { useBoolean } from "usehooks-ts";
import { IoChevronForwardOutline, IoCloseOutline } from "react-icons/io5";
import { MdPlaylistAdd } from "react-icons/md";
import { useEffect } from "react";
import { useState } from "react";
import { Category } from "@prisma/client";
import AddCategoryDialog from "@components/dialogs/add-category";
import CategoryDetailDialog from "@components/dialogs/category-detail";

function Sidebar() {
  const router = useRouter();
  const { setFalse: closeMode, toggle: toggleMode, value: mode } = useBoolean(false);
  const { toggle: toggleAdd, value: openAdd } = useBoolean(false);
  const { toggle: toggleDetail, value: openDetail } = useBoolean(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [searchBy, setSearchBy] = useState("");

  const openSidebar = useStore((state) => state.openSidebar);
  const setOwnCategories = useStore((state) => state.setOwnCategories);
  const toggleManageCategory = useStore((state) => state.toggleManageCategory);
  const setRefetchCategories = useStore((state) => state.setRefetchCategories);

  const { data, isLoading, refetch } = trpc.useQuery(
    [
      "categories.categories",
      {
        searchBy
      }
    ],
    {
      onSuccess: (data) => {
        setOwnCategories(data);
      }
    }
  );

  useEffect(() => {
    if (mode) {
      router.push("/category");
      toggleManageCategory(true);
    }
  }, [mode]);

  useEffect(() => {
    setRefetchCategories(refetch);
  }, [refetch, setRefetchCategories]);

  return (
    <AnimatePresence initial={false}>
      {openSidebar && (
        <motion.div
          className="bg-fav-600 h-screen top-0 left-0 fixed w-[280px]"
          initial={{ x: "-100%" }}
          animate={{
            x: "0%"
          }}
          exit={{
            x: "-100%"
          }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        >
          <div className="border-b border-b-fav-200">
            <div className="w-3/5 p-3">
              <Image src={favmeLogo} alt="Favme" objectFit="fill" />
            </div>
          </div>

          {mode && (
            <div className="relative">
              <Input
                variant="standard"
                size="lg"
                label=""
                color="green"
                className="w-full !p-4 !text-white relative"
                name="searchBy"
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
              />
              <BiSearch
                size={24}
                className="absolute text-gray-400 !top-1/2 !right-1 !-translate-y-1/2"
              />
            </div>
          )}

          <ul
            className={`flex flex-col p-4 ${
              openSidebar ? "overflow-y-auto h-[calc(100vh-80px)]" : ""
            } text-base-content relative`}
          >
            {isLoading
              ? Array.from(Array(20), (e, i) => i + 1).map((index) => (
                  <li className="bg-fav-500 rounded-lg mb-2 animate-pulse" key={`pulse_${index}`}>
                    <div className={`flex items-center m-4 cursor-pointer gap-3`}>
                      <div className="w-8 h-8 rounded-full bg-fav-400" />
                      <div className="w-32 h-4 rounded-sm bg-fav-400" />
                    </div>
                  </li>
                ))
              : data &&
                data.map((category, index) => (
                  <li
                    className={` mb-2 text-white ${
                      router.asPath === `/category${category.slug}`
                        ? `font-bold bg-fav-500 rounded-lg`
                        : `hover:bg-fav-500 hover:rounded-lg hover:font-bold`
                    } 
                    ${mode ? "hover:!text-fav-200 hover:!bg-fav-100/20 " : ""}
                    `}
                    key={`category_${index}`}
                  >
                    {mode ? (
                      <>
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => {
                            setSelectedCategory(category);
                            toggleDetail();
                          }}
                        >
                          <div className={`flex items-center m-4 cursor-pointer gap-3`}>
                            <DynamicFaIcon
                              name={category.cover as keyof typeof Icons}
                              color={category.color}
                            />
                            <p>{category.name}</p>
                          </div>
                          <IoChevronForwardOutline className="w-4 h-4 mr-4" />
                        </div>
                      </>
                    ) : (
                      <Link href={`/category${category.slug}`}>
                        <div className={`flex items-center m-4 cursor-pointer gap-3`}>
                          <DynamicFaIcon
                            name={category.cover as keyof typeof Icons}
                            color={category.color}
                          />
                          <p>{category.name}</p>
                        </div>
                      </Link>
                    )}
                  </li>
                ))}
          </ul>

          <AddCategoryDialog open={openAdd} handleOpen={toggleAdd} refetch={refetch} />
          <CategoryDetailDialog
            open={openDetail}
            handleOpen={toggleDetail}
            refetch={refetch}
            category={selectedCategory}
          />

          <div className="absolute z-10 bottom-10 left-1/2 -translate-x-1/2">
            {mode ? (
              <div className="flex items-center justify-center gap-3">
                <Tooltip
                  content="Close Manage"
                  animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0, y: 25 }
                  }}
                >
                  <IconButton
                    className="btn-icon !rounded-full !text-white !border-white !opacity-100 !w-16 !h-16 !max-w-none !max-h-fit shadow-fav-200/20 hover:!shadow-fav-200/40 bg-gray-100/20 hover:bg-gray-100/40 hover:scale-105"
                    variant="outlined"
                    size="md"
                    onClick={() => {
                      closeMode();
                      setSearchBy("");
                      refetch();
                      router.back();
                      toggleManageCategory(false);
                    }}
                  >
                    <IoCloseOutline className="w-8 h-8" />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  content="Add Category"
                  animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0, y: 25 }
                  }}
                >
                  <IconButton
                    className="btn-icon !rounded-full !text-white hover:scale-105 !border-transparent  bg-fav-200 !opacity-100 !w-16 !h-16 !max-w-none !max-h-fit shadow-fav-200/20 hover:!shadow-fav-200/40"
                    variant="outlined"
                    size="md"
                    onClick={() => {
                      toggleAdd();
                    }}
                  >
                    <MdPlaylistAdd className="w-8 h-8" />
                  </IconButton>
                </Tooltip>
              </div>
            ) : (
              <Tooltip
                content="Manage Category"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 25 }
                }}
              >
                <IconButton
                  size="lg"
                  className="!rounded-full bg-fav-200 !opacity-100 !w-16 !h-16 !max-w-none !max-h-fit shadow-fav-200/20 hover:!shadow-fav-200/40"
                  onClick={toggleMode}
                >
                  <BiCategory className="!w-8 !h-8 text-white" />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Sidebar;
