import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Option,
  Select,
  Textarea,
  Typography
} from "@material-tailwind/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import noImage from "@public/no-image.png";
import infoImage from "@public/about.png";
import { useStore } from "src/store/store";
import { useFormik } from "formik";
import * as Yup from "yup";
import slugify from "slugify";
import { testImage } from "src/utils/valid-image";
import { trpc } from "src/utils/trpc";
import Loader from "@components/loader";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useBoolean, useOnClickOutside } from "usehooks-ts";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { VscOpenPreview } from "react-icons/vsc";
import Creatable from "react-select/creatable";

interface MultiSelectType {
  value: string;
  label: string;
  _isNew?: boolean;
}

interface EditValues {
  name: string;
  description: string;
  slug: string;
  category: string;
  cover: string;
  link: string;
  labels: string[];
}

function FavDetailDialog() {
  const open = useStore((state) => state.showFavorite);
  const handleOpen = useStore((state) => state.toggleFavorite);
  const favorite = useStore((state) => state.favorite);
  const refetchFavorites = useStore((state) => state.refetchFavorites);
  const [labels, setLabels] = useState<MultiSelectType[]>([]);

  const { toggle, setFalse: backToView, value: isEdit } = useBoolean(false);
  const menuRef = useRef(null);
  const { setFalse, setTrue, value: outsideMenu } = useBoolean(true);

  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const ownCategories = useStore((state) => state.ownCategories);

  const { isLoading: loadingLabels, refetch } = trpc.useQuery(["labels.labels"], {
    onSuccess: (data) => {
      setLabels(data.map((l) => ({ value: l.name, label: l.name })));
    },
    onError: (err) => {
      setLabels([]);
    }
  });

  const { mutate, isLoading } = trpc.useMutation(["favorites.edit-favorite"], {
    onSuccess: () => {
      formik.resetForm();
      setTrue();
      backToView();
      handleOpen();
      router.push(`/category${ownCategories.find((c) => c.id === formik.values.category)?.slug}`);
      refetchFavorites();
      toast.success("Edit favorite successfully!");
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const { mutate: mutateDel, isLoading: loadingDel } = trpc.useMutation(
    ["favorites.delete-favorite"],
    {
      onSuccess: () => {
        formik.resetForm();
        handleOpen();
        refetchFavorites();
        toast.success("Delete favorite successfully!");
      },
      onError: (err) => {
        toast.error(err.message);
      }
    }
  );

  const initialValues: EditValues = {
    name: favorite?.name || "",
    description: favorite?.description || "",
    slug: favorite?.slug || "",
    category: favorite?.category.id || "",
    cover: favorite?.cover || "",
    link: favorite?.link || "",
    labels: favorite?.labels.map((label) => label.name) || []
  };

  const editSchema = Yup.object().shape({
    name: Yup.string().min(2, "Too short!").max(100, "Too long!").required("Name is required"),
    description: Yup.string()
      .min(5, "Too short!")
      .max(300, "Too long!")
      .required("Description is required"),
    slug: Yup.string()
      .min(2, "Too short!")
      .max(30, "Too long!")
      .required("Slug is required")
      .matches(/^\/[a-z0-9-]+$/, 'Slug must start with "/", lowercase, numbers and dashes only'),
    category: Yup.string().required("Category is required"),
    cover: Yup.string()
      .required("Cover is required")
      .test("valid-image-url", "Must use valid image URL", (value) =>
        testImage(value!, 1000).then((status) => status === "success")
      ),
    link: Yup.string().required("Link is required").url("Must be a valid URL"),
    labels: Yup.array().of(Yup.string().min(1, "Too short!").max(30, "Too long!"))
  });

  const handleSubmit = (values: EditValues) => {
    if (!favorite) return;
    mutate({ id: favorite.id, ...values });
  };

  const handleDelete = (values: { id: string }) => {
    mutateDel(values);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: editSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    onReset(values, formikHelpers) {
      formikHelpers.setValues(initialValues);
    }
  });

  useEffect(() => {
    refetch();
  }, []);

  useOnClickOutside(menuRef, () => setTrue());

  return (
    <Dialog
      open={open && favorite != null}
      handler={() => {
        backToView();
        handleOpen();
        formik.resetForm();
      }}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 }
      }}
      className="p-5"
      size="lg"
      dismiss={{
        outsidePointerDown: outsideMenu ? true : false
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogHeader className="flex justify-between items-center">
          <div className="!font-bold !text-3xl text-fav-300 flex items-center gap-1">
            <Image
              src={infoImage}
              alt="Plus icons created by AB Design - Flaticon"
              width={45}
              height={45}
            />
            {favorite?.name}
          </div>
          <Menu placement="bottom-end" open={!outsideMenu}>
            <MenuHandler onClick={() => setFalse()} ref={menuRef}>
              <IconButton className="btn-icon !rounded-full" variant="outlined" size="md">
                <BiDotsVerticalRounded className="w-8 h-8" />
              </IconButton>
            </MenuHandler>
            <MenuList className="z-[10000]">
              <MenuItem>
                <Button
                  type="button"
                  variant="text"
                  className="btn-menu !normal-case !py-2 flex items-center"
                  ripple={false}
                  onClick={() => {
                    toggle();
                    formik.resetForm();
                  }}
                >
                  {isEdit ? (
                    <>
                      <VscOpenPreview className="inline-block w-5 h-5 mr-2" />
                      View favorite
                    </>
                  ) : (
                    <>
                      <AiOutlineEdit className="inline-block w-5 h-5 mr-2" />
                      Edit favorite
                    </>
                  )}
                </Button>
              </MenuItem>
              <Menu placement="right-start" offset={15}>
                <MenuHandler>
                  <MenuItem className="!p-0">
                    <Button
                      type="button"
                      variant="text"
                      color="red"
                      className="!normal-case !py-3 !px-3 flex items-center !text-sm"
                      ripple={false}
                    >
                      <AiOutlineDelete className="inline-block w-5 h-5 mr-2" />
                      Delete favorite
                    </Button>
                  </MenuItem>
                </MenuHandler>
                <MenuList className="z-[10000]">
                  <MenuItem className="!p-0">
                    <Button
                      className={`!normal-case btn-del !text-sm flex items-center`}
                      onClick={() => handleDelete({ id: favorite!.id })}
                      disabled={loadingDel}
                    >
                      {loadingDel ? <Loader /> : <AiOutlineDelete className="w-5 h-5 mr-2" />}
                      <span>Confirm Delete</span>
                    </Button>
                  </MenuItem>
                </MenuList>
              </Menu>
            </MenuList>
          </Menu>
        </DialogHeader>
        <DialogBody className="block max-h-[60vh] overflow-y-auto">
          <Typography
            variant="paragraph"
            className={`font-semibold text-fav-500 mb-2 flex justify-between items-center ${
              isEdit ? "" : "hidden"
            }`}
          >
            1. Choose image cover: <span className="text-red-300 text-xs">Required(*)</span>
          </Typography>
          <div className="flex flex-col-reverse items-center gap-5 w-full">
            <div className="flex flex-col justify-center w-full">
              <div className="border-dashed border-2 border-gray-400 py-12 px-5 flex-col justify-center items-center bg-blue-gray-50 cursor-not-allowed hidden">
                <p className="font-semibold text-gray-900 flex flex-wrap justify-center text-center">
                  <span>Drag and drop your image here or</span>
                </p>
                <input
                  type="file"
                  multiple={false}
                  className="hidden"
                  ref={fileRef}
                  accept="image/*"
                />
                <button
                  className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-fav-300 hover:text-white disabled:hover:text-inherit focus:shadow-outline focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={true}
                  onClick={() => fileRef?.current?.click()}
                >
                  Upload a file
                </button>
              </div>
              <span className="text-sm text-center my-3 hidden">Or</span>
              <div className={`${isEdit ? "" : "hidden"}`}>
                <Input
                  variant="outlined"
                  size="lg"
                  label="Image link"
                  color="light-green"
                  className="text-base placeholder-transparent focus:placeholder-gray-500 flex-1 w-max"
                  placeholder="https://"
                  name="cover"
                  onChange={formik.handleChange}
                  value={formik.values.cover}
                  error={formik.errors.cover != null && formik.touched.cover != null}
                  success={formik.errors.cover == null && formik.touched.cover != null}
                />
              </div>
              {isEdit && formik.errors.cover && formik.touched.cover && (
                <div className="error-msg">{formik.errors.cover}</div>
              )}
            </div>

            <div className="border-dashed border-2 border-gray-400 flex flex-col justify-center items-center relative cursor-default">
              {(isEdit && formik.errors.cover == null) || formik.values.cover != null ? (
                <img
                  src={formik.values.cover}
                  alt={formik.values.cover}
                  className="object-cover h-full xl:h-96"
                />
              ) : (
                <>
                  <Image
                    src={noImage}
                    alt="No Image Selected"
                    objectFit="cover"
                    width={300}
                    height={300}
                  />
                  <span className="text-gray-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hover:opacity-80">
                    No image selected
                  </span>
                </>
              )}
            </div>
          </div>
          <Typography
            variant="paragraph"
            className={`font-semibold text-fav-500 mb-2 flex justify-between mt-5 items-center ${
              isEdit ? "" : "hidden"
            }`}
          >
            2. Information about favorite: <span className="text-red-300 text-xs">Required(*)</span>
          </Typography>
          <div className="mt-3">
            <Input
              variant="outlined"
              size="lg"
              label="Name"
              color="light-green"
              className="text-base"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              error={formik.errors.name != null && formik.touched.name != null}
              success={formik.errors.name == null && formik.touched.name != null}
              readOnly={!isEdit}
            />
            {isEdit && formik.errors.name && formik.touched.name && (
              <div className="error-msg">{formik.errors.name}</div>
            )}
          </div>
          <div className="mt-3">
            <Textarea
              variant="outlined"
              size="lg"
              label="Description"
              color="light-green"
              className="text-base"
              name="description"
              onChange={formik.handleChange}
              value={formik.values.description}
              error={formik.errors.description != null && formik.touched.description != null}
              success={formik.errors.description == null && formik.touched.description != null}
              readOnly={!isEdit}
            />
            {isEdit && formik.errors.description && formik.touched.description && (
              <div className="error-msg">{formik.errors.description}</div>
            )}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Input
              variant="outlined"
              size="lg"
              label="Slug"
              color="light-green"
              className="text-base placeholder-transparent focus:placeholder-gray-500 flex-1 w-max"
              placeholder="/your-fav"
              name="slug"
              onChange={formik.handleChange}
              value={formik.values.slug}
              error={formik.errors.slug != null && formik.touched.slug != null}
              success={formik.errors.slug == null && formik.touched.slug != null}
              readOnly={!isEdit}
            />
            <Button
              variant="text"
              color="gray"
              type="button"
              className={`!normal-case text-fav-500 text-sm hover:!bg-fav-100 hover:!text-black !text-center w-1/4 ${
                isEdit ? "" : "hidden"
              }`}
              onClick={() =>
                formik.setFieldValue(
                  "slug",
                  "/" + slugify(formik.values.name, { remove: /[*+~.()'"!:@]/g, lower: true })
                )
              }
            >
              Generate
            </Button>
          </div>
          {isEdit && formik.errors.slug && formik.touched.slug && (
            <div className="error-msg">{formik.errors.slug}</div>
          )}
          <div className="mt-3">
            <Input
              variant="outlined"
              size="lg"
              label="Link URL"
              color="light-green"
              className="text-base"
              name="link"
              onChange={formik.handleChange}
              value={formik.values.link}
              error={formik.errors.link != null && formik.touched.link != null}
              success={formik.errors.link == null && formik.touched.link != null}
              readOnly={!isEdit}
            />
            {isEdit && formik.errors.link && formik.touched.link && (
              <div className="error-msg">{formik.errors.link}</div>
            )}
          </div>
          <Typography
            variant="paragraph"
            className={`font-semibold text-fav-500 mb-2 flex justify-between mt-5 items-center ${
              isEdit ? "" : "hidden"
            }`}
          >
            3. Choose category: <span className="text-red-300 text-xs">Required(*)</span>
          </Typography>
          <div className={`${isEdit ? "" : "mt-3"}`}></div>
          <Select
            label="Select Category"
            animate={{
              mount: { y: 0 },
              unmount: { y: 25 }
            }}
            color="light-green"
            onChange={(value) => formik.setFieldValue("category", value)}
            value={formik.values.category}
            error={formik.errors.category != null && formik.touched.category != null}
            success={formik.errors.category == null && formik.touched.category != null}
            disabled={!isEdit}
          >
            {ownCategories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
          {isEdit && formik.errors.category && formik.touched.category && (
            <div className="error-msg">{formik.errors.category}</div>
          )}
          <div className={`${isEdit ? "" : "mt-3"}`}></div>
          <Typography
            variant="paragraph"
            className={`font-semibold text-fav-500 mb-2 flex justify-between mt-5 items-center ${
              isEdit ? "" : "hidden"
            }`}
          >
            4. Choose labels: <span className="text-red-300 text-xs">Required(*)</span>
          </Typography>
          <Creatable
            options={labels}
            isMulti={true}
            name="labels"
            value={formik.values.labels.map((label) => ({ value: label, label: label }))}
            onChange={(newValue: ReadonlyArray<MultiSelectType>) => {
              console.log(newValue);
              formik.setFieldValue(
                "labels",
                newValue.map((lb) => lb.value)
              );
            }}
            noOptionsMessage={(obj) => <>No Labels</>}
            isDisabled={!isEdit}
            isLoading={loadingLabels}
            styles={{
              control: (provided, state) => ({
                ...provided,
                border: state.isFocused ? "1px solid #89BF4D" : "1px solid #B0BEC5",
                borderColor: state.isFocused ? "#89BF4D" : " #B0BEC5",
                boxShadow: state.isFocused ? "#89BF4D" : " #B0BEC5",
                borderRadius: "0.375rem",
                ":hover": {
                  border: "1px solid #89BF4D"
                },
                ":focus": {
                  border: "1px solid #89BF4D"
                }
              })
            }}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={() => formik.resetForm()}
            className={`mr-1 !normal-case ${isEdit ? "" : "hidden"}`}
            size="lg"
          >
            <span>Reset</span>
          </Button>
          <Button
            className={`!normal-case btn-add !bg-fav-200 hover:!bg-fav-300 hover:!text-white ${
              isEdit ? "" : "hidden"
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : <AiOutlineEdit className="w-6 h-6 mr-1" />}
            <span>Edit Fav</span>
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

export default FavDetailDialog;
