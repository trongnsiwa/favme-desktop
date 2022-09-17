import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Textarea,
  Typography
} from "@material-tailwind/react";
import Image from "next/image";
import React, { useEffect } from "react";
import addIcon from "@public/add.png";
import { IoAddOutline } from "react-icons/io5";
import { useFormik } from "formik";
import * as Yup from "yup";
import slugify from "slugify";
import { trpc } from "src/utils/trpc";
import Loader from "@components/loader";
import { toast } from "react-toastify";
import { IconPicker } from "react-fa-icon-picker";

type AddNewDialogProps = {
  open: boolean;
  handleOpen: () => void;
  refetch: () => void;
};

interface AddNewValues {
  name: string;
  description: string;
  slug: string;
  cover: string;
  color: string;
}

function AddCategoryDialog({ open, handleOpen, refetch }: AddNewDialogProps) {
  const { mutate, isLoading } = trpc.useMutation(["categories.create-category"], {
    onSuccess: () => {
      formik.resetForm();
      handleOpen();
      refetch();
      toast.success("Create category successfully!");
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const initialValues: AddNewValues = {
    name: "",
    description: "",
    slug: "",
    cover: "",
    color: ""
  };

  const addNewSchema = Yup.object().shape({
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

  const handleSubmit = (values: AddNewValues) => {
    mutate(values);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: addNewSchema,
    onSubmit: handleSubmit
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 }
      }}
      className="p-5"
      size="lg"
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogHeader className="!font-bold !text-3xl text-fav-300">
          <Image
            src={addIcon}
            alt="Plus icons created by AB Design - Flaticon"
            width={45}
            height={45}
          />
          Add New Category
        </DialogHeader>
        <DialogBody className="block max-h-[60vh] overflow-y-auto">
          <div className="flex items-start gap-5">
            <Typography
              variant="paragraph"
              className="font-semibold text-fav-500 mb-2 flex justify-between items-center"
            >
              1. Choose icon:
            </Typography>
            <IconPicker
              value={formik.values.cover}
              onChange={(value: any) => formik.setFieldValue("cover", value)}
              containerStyles={{
                width: "20rem",
                zIndex: 10000,
                position: "absolute"
              }}
              buttonStyles={{
                border:
                  formik.errors.cover && formik.touched.cover
                    ? "1px solid #E53935"
                    : "1px solid #B0BEC5"
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

          {formik.errors.cover && formik.touched.cover && (
            <div className="error-msg">{formik.errors.cover}</div>
          )}

          <Typography
            variant="paragraph"
            className="font-semibold text-fav-500 mb-2 flex justify-between mt-5 items-center"
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
            />
            {formik.errors.name && formik.touched.name && (
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
            />
            {formik.errors.description && formik.touched.description && (
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
            />
            <Button
              variant="text"
              color="gray"
              type="button"
              className="!normal-case text-fav-500 text-sm hover:!bg-fav-100 hover:!text-black !text-center w-1/4"
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
          {formik.errors.slug && formik.touched.slug && (
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
            />
            {formik.errors.color && formik.touched.color && (
              <div className="error-msg">{formik.errors.color}</div>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={() => formik.resetForm}
            className="mr-1 !normal-case"
            size="lg"
          >
            <span>Reset</span>
          </Button>
          <Button
            className="!normal-case btn-add !bg-fav-200 hover:!bg-fav-300 hover:!text-white"
            type="submit"
            disabled={formik.isSubmitting || isLoading}
          >
            {isLoading ? <Loader /> : <IoAddOutline className="w-6 h-6 mr-1" />}
            <span>Add Category</span>
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

export default AddCategoryDialog;
