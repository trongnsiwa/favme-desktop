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
  Textarea,
  Typography
} from "@material-tailwind/react";
import Image from "next/image";
import React, { useRef } from "react";
import infoImage from "@public/about.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import slugify from "slugify";
import { trpc } from "src/utils/trpc";
import Loader from "@components/loader";
import { toast } from "react-toastify";
import { useBoolean, useOnClickOutside } from "usehooks-ts";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { VscOpenPreview } from "react-icons/vsc";
import { Category } from "@prisma/client";
import { IconPicker } from "react-fa-icon-picker";

type CategoryDetailDialogProps = {
  open: boolean;
  handleOpen: () => void;
  refetch: () => void;
  category: Category | null;
};

interface EditValues {
  name: string;
  description: string;
  slug: string;
  cover: string;
  color: string;
}

function CategoryDetailDialog({ open, handleOpen, refetch, category }: CategoryDetailDialogProps) {
  const { toggle, setFalse: backToView, value: isEdit } = useBoolean(false);
  const menuRef = useRef(null);
  const { setFalse, setTrue, value: outsideMenu } = useBoolean(true);

  const { mutate, isLoading } = trpc.useMutation(["categories.edit-category"], {
    onSuccess: () => {
      formik.resetForm();
      setTrue();
      backToView();
      handleOpen();
      refetch();
      toast.success("Edit category successfully!");
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const { mutate: mutateDel, isLoading: loadingDel } = trpc.useMutation(
    ["categories.delete-category"],
    {
      onSuccess: () => {
        formik.resetForm();
        handleOpen();
        refetch();
        toast.success("Delete category successfully!");
      },
      onError: (err) => {
        toast.error(err.message);
      }
    }
  );

  const initialValues: EditValues = {
    name: category?.name || "",
    description: category?.description || "",
    slug: category?.slug || "",
    cover: category?.cover || "",
    color: category?.color || ""
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
    cover: Yup.string()
      .required("Icon is required")
      .test("test-icon", "Invalid icon", (value) => {
        if (!value) return false;
        return value.startsWith("Fa");
      }),
    color: Yup.string()
      .required("Color is required")
      .test("is-valid-color", "Require hex color", (value) => {
        if (!value) return false;
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(value);
      })
  });

  const handleSubmit = (values: EditValues) => {
    if (!category) return;
    mutate({ id: category.id, ...values });
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

  useOnClickOutside(menuRef, () => setTrue());

  return (
    <Dialog
      open={open && category != null}
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
            {category?.name}
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
                      View category
                    </>
                  ) : (
                    <>
                      <AiOutlineEdit className="inline-block w-5 h-5 mr-2" />
                      Edit category
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
                      Delete category
                    </Button>
                  </MenuItem>
                </MenuHandler>
                <MenuList className="z-[10000]">
                  <MenuItem className="!p-0">
                    <Button
                      className={`!normal-case btn-del !text-sm flex items-center`}
                      onClick={() => handleDelete({ id: category!.id })}
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
          <div className="flex items-start gap-5">
            <Typography
              variant="paragraph"
              className={`${
                isEdit ? "font-semibold" : "font-normal text-sm"
              } text-fav-500 mb-2 flex justify-between items-center`}
            >
              {isEdit ? "1. Choose icon:" : "Icon:"}
            </Typography>
            <IconPicker
              value={formik.values.cover}
              onChange={(value: any) => formik.setFieldValue("cover", value)}
              containerStyles={{
                width: "20rem",
                zIndex: 10000,
                position: "absolute",
                display: isEdit ? "absolute" : "hidden"
              }}
              buttonStyles={{
                border:
                  isEdit && formik.errors.cover && formik.touched.cover
                    ? "1px solid #E53935"
                    : "1px solid #B0BEC5",
                pointerEvents: isEdit ? "auto" : "none"
              }}
              buttonIconStyles={{
                color: "#383838"
              }}
              pickerIconStyles={{
                color: "#383838"
              }}
              searchInputStyles={{
                marginBottom: "0.5rem",
                padding: "0.5rem"
              }}
            />
          </div>

          {isEdit && formik.errors.cover && formik.touched.cover && (
            <div className="error-msg">{formik.errors.cover}</div>
          )}

          <Typography
            variant="paragraph"
            className={`font-semibold text-fav-500 mb-2 flex justify-between mt-5 items-center ${
              isEdit ? "" : "hidden"
            }`}
          >
            2. Information about category: <span className="text-red-300 text-xs">Required(*)</span>
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
              placeholder="/your-category"
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
              label="Color"
              color="light-green"
              className="text-base"
              name="color"
              onChange={formik.handleChange}
              value={formik.values.color}
              error={formik.errors.color != null && formik.touched.color != null}
              success={formik.errors.color == null && formik.touched.color != null}
              readOnly={!isEdit}
            />
            {isEdit && formik.errors.color && formik.touched.color && (
              <div className="error-msg">{formik.errors.color}</div>
            )}
          </div>
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
            disabled={formik.isSubmitting || isLoading}
          >
            {isLoading ? <Loader /> : <AiOutlineEdit className="w-6 h-6 mr-1" />}
            <span>Edit Category</span>
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

export default CategoryDetailDialog;
