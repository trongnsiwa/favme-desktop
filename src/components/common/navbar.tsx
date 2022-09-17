import { useRouter } from "next/router";
import { useStore } from "src/store/store";
import { useBoolean } from "usehooks-ts";
import {
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Navbar as MTNavbar,
  Option,
  Popover,
  PopoverContent,
  PopoverHandler,
  Select,
  Typography
} from "@material-tailwind/react";
import { RiBarChartHorizontalFill } from "react-icons/ri";
import { IoLogOutOutline } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { MdBookmarkAdd, MdFilterAlt, MdOutlineBookmarkAdd, MdOutlineClose } from "react-icons/md";
import Link from "next/link";
import { useFormik } from "formik";
import { FavoriteStatus } from "@prisma/client";
import { trpc } from "src/utils/trpc";
import Loader from "@components/loader";
import ScrollContainer from "react-indiana-drag-scroll";
import { deleteCookie } from "cookies-next";
import { AiOutlineTags } from "react-icons/ai";
import tagImage from "@public/tag.png";
import Image from "next/image";
import dayjs from "dayjs";
import LabelDelete from "@components/label-delete";
import { useEffect } from "react";

interface FilterValues {
  searchBy: string;
  status: string;
  orderBy: string;
  labels: string[];
}

function Navbar() {
  const { value: openFilter, setFalse: closeFilter, toggle: toggleFilter } = useBoolean(false);
  const { value: openLabel, toggle: toggleLabel } = useBoolean(false);

  const router = useRouter();

  const openSidebar = useStore((state) => state.openSidebar);
  const toggleSidebar = useStore((state) => state.toggleSidebar);

  const { data, isLoading, refetch } = trpc.useQuery(["labels.labels"]);

  const initialValues: FilterValues = {
    searchBy: "",
    status: "",
    orderBy: "",
    labels: []
  };

  const handleSubmit = (values: FilterValues) => {
    const params = new URLSearchParams();
    if (values.searchBy !== "") {
      params.append("searchBy", values.searchBy);
    }
    if (values.status !== "") {
      params.append("status", values.status);
    }
    if (values.orderBy !== "") {
      params.append("orderBy", values.orderBy);
    }
    if (values.labels.length !== 0) {
      values.labels.forEach((label) => {
        params.append("label", label);
      });
    }
    const queryString = params.toString();
    router.push({
      pathname: router.asPath.split("?")[0],
      query: queryString
    });
    closeFilter();
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit
  });

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <MTNavbar
        className={`bg-fav-200 shadow-lg px-3 right-0 top-0 rounded-none fixed border-none ${
          openSidebar ? "w-[calc(100%-280px)]" : "w-full"
        } h-[80px] max-w-none transition-all ${openSidebar ? "duration-400" : "duration-500"}`}
      >
        <div className="flex items-center justify-between h-full w-full">
          <div className="search-bar-container flex items-center gap-3">
            <IconButton
              className="btn-icon"
              variant="outlined"
              onClick={() => toggleSidebar(!openSidebar)}
              size="lg"
            >
              <RiBarChartHorizontalFill className="w-8 h-8" />
            </IconButton>
            <Popover
              animate={{
                mount: { y: 5 },
                unmount: { y: 0 }
              }}
              placement="bottom-start"
              open={openFilter}
              handler={toggleFilter}
            >
              <PopoverHandler>
                <Input
                  size="lg"
                  className="search-bar w-[22rem]"
                  placeholder="Search favorites..."
                  label={undefined}
                  labelProps={undefined}
                  icon={
                    <BiSearch
                      size={24}
                      onClick={() => {
                        refetch();
                        toggleFilter();
                      }}
                    />
                  }
                />
              </PopoverHandler>
              <PopoverContent className="w-[30rem] p-5">
                <form onSubmit={formik.handleSubmit}>
                  <Input
                    variant="standard"
                    size="lg"
                    label="Tag"
                    color="light-green"
                    className="w-full"
                    name="searchBy"
                    icon={<BiSearch size={24} />}
                    value={formik.values.searchBy}
                    onChange={formik.handleChange}
                    autoFocus={false}
                  />
                  <div className="flex justify-between items-center mt-7 gap-5">
                    {router.asPath.includes("category") && (
                      <Select
                        label="Status"
                        animate={{
                          mount: { y: 0 },
                          unmount: { y: 25 }
                        }}
                        variant="standard"
                        color="light-green"
                        value={formik.values.status}
                        onChange={(value) => formik.setFieldValue("status", value)}
                      >
                        <Option value="">Select a status</Option>
                        <Option value={FavoriteStatus.FAVORED}>Favored</Option>
                        <Option value={FavoriteStatus.UNFAVORED}>Unfavored</Option>
                      </Select>
                    )}
                    {router.asPath.includes("category") ? (
                      <Select
                        label="Order"
                        animate={{
                          mount: { y: 0 },
                          unmount: { y: 25 }
                        }}
                        variant="standard"
                        color="light-green"
                        value={formik.values.orderBy}
                        onChange={(value) => formik.setFieldValue("orderBy", value)}
                      >
                        <Option value="">Select an order</Option>
                        <Option value="name_asc">Name A-Z</Option>
                        <Option value="name_desc">Name Z-A</Option>
                        <Option value="createdAt_asc">Oldest date</Option>
                        <Option value="createdAt_desc">Newest date</Option>

                        <Option value="status_asc">Favored</Option>
                        <Option value="status_desc">Unfavored</Option>
                      </Select>
                    ) : (
                      <Select
                        label="Order"
                        animate={{
                          mount: { y: 0 },
                          unmount: { y: 25 }
                        }}
                        variant="standard"
                        color="light-green"
                        value={formik.values.orderBy}
                        onChange={(value) => formik.setFieldValue("orderBy", value)}
                      >
                        <Option value="">Select an order</Option>
                        <Option value="name_asc">Name A-Z</Option>
                        <Option value="name_desc">Name Z-A</Option>
                        <Option value="createdAt_asc">Oldest date</Option>
                        <Option value="createdAt_desc">Newest date</Option>
                      </Select>
                    )}
                  </div>
                  <Typography className={`text-sm text-gray-700 mt-3 mb-1 ${!data && "hidden"}`}>
                    Labels
                  </Typography>
                  <ScrollContainer
                    className="scroll-container overflow-x-auto overflow-y-hidden whitespace-nowrap relative"
                    vertical={false}
                  >
                    {isLoading && <Loader />}
                    {data &&
                      data.map((label) => (
                        <Chip
                          key={"search_" + label.id}
                          value={label.name}
                          className={`!normal-case text-xs  rounded-full !py-1 mr-1 cursor-pointer ${
                            formik.values.labels.includes(label.name)
                              ? "bg-fav-300 text-white hover:bg-gray-300 hover:text-fav-700"
                              : "bg-gray-300 text-gray-700 hover:bg-fav-300 hover:text-white"
                          }`}
                          icon={
                            formik.values.labels.includes(label.name) ? (
                              <MdOutlineClose className="!text-white w-3 h-3 m-1" />
                            ) : null
                          }
                          onTap={() => {
                            if (formik.values.labels.includes(label.name)) {
                              formik.setFieldValue(
                                "labels",
                                formik.values.labels.filter((l) => l !== label.name)
                              );
                            } else {
                              formik.setFieldValue("labels", [...formik.values.labels, label.name]);
                            }
                          }}
                        />
                      ))}
                  </ScrollContainer>

                  <Button type="submit" className="btn btn-fav mt-7 shadow-fill">
                    <MdFilterAlt className="w-6 h-6 text-gray-900" />
                    Filter
                  </Button>
                  <div
                    className="w-full text-center hover:underline cursor-pointer hover:text-fav-300 mt-5"
                    onClick={() => formik.resetForm()}
                  >
                    Reset
                  </div>
                </form>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/favorite">
              <Button
                className={`btn-add !normal-case ${
                  router.asPath === "/favorite" ? "!text-fav-200" : ""
                }`}
              >
                {router.asPath === "/favorite" ? (
                  <MdBookmarkAdd className="inline-block w-5 h-5 mr-2" />
                ) : (
                  <MdOutlineBookmarkAdd className="inline-block w-5 h-5 mr-2" />
                )}
                Favorites
              </Button>
            </Link>
            <Menu lockScroll={true}>
              <MenuHandler>
                <Button variant="text" className="btn-avatar">
                  <Avatar
                    className="avatar cursor-pointer bg-white"
                    variant="circular"
                    src={"https://avatars.githubusercontent.com/u/80735737?v=4"}
                    size="lg"
                  />
                </Button>
              </MenuHandler>
              <MenuList>
                <p className="text-sm font-semibold text-fav-600 mb-2" suppressHydrationWarning>
                  Hi, Trong!
                </p>
                <MenuItem className="menu-item">
                  <Button
                    variant="text"
                    type="button"
                    onClick={() => {
                      refetch();
                      toggleLabel();
                    }}
                    className="btn-menu !normal-case"
                    ripple={false}
                  >
                    <AiOutlineTags className="inline-block w-5 h-5 mr-2" />
                    Your Labels
                  </Button>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      </MTNavbar>

      <Dialog
        open={openLabel}
        handler={toggleLabel}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 }
        }}
        className="p-5"
        size="lg"
        dismiss={{
          outsidePointerDown: openLabel ? true : false
        }}
      >
        <DialogHeader>
          <div className="!font-bold !text-3xl text-fav-300 flex items-center gap-1">
            <Image src={tagImage} alt="Flaticon" width={45} height={45} />
            Your Labels
          </div>
        </DialogHeader>
        <DialogBody className="block max-h-[60vh] overflow-y-auto relative">
          {isLoading && <Loader />}
          {data &&
            data.map((label) => (
              <div
                key={"setting_" + label.id}
                className="bg-white border border-gray-400 text-gray-800 mb-3 shadow-sm shadow-fav-200 font-medium flex justify-between items-center w-full py-3 px-10 rounded-md hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  {label.name}
                  <p className="text-xs font-normal text-gray-500">
                    {dayjs(label.createdAt).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
                <LabelDelete id={label.id} />
              </div>
            ))}
          {!data ||
            (data && data.length === 0 && (
              <div className="text-gray-600 text-md">You don&apos;t have any label yet</div>
            ))}
        </DialogBody>
      </Dialog>
    </>
  );
}

export default Navbar;
