import z from "zod";

export const createCategorySchema = z.object({
  name: z.string(),
  description: z.string(),
  slug: z.string(),
  cover: z.string(),
  color: z.string()
});

export type CreateCategoryInput = z.TypeOf<typeof createCategorySchema>;

export const defaultCategories: CreateCategoryInput[] = [
  {
    name: "Styling",
    description: "Styling",
    cover: "FaPaintBrush",
    color: "#FFFBA4",
    slug: "/styling"
  },
  {
    name: "Animation",
    description: "Animation",
    cover: "FaBolt",
    color: "#A6D4FF",
    slug: "/animation"
  },
  {
    name: "Icon",
    description: "Icon",
    cover: "FaHandHoldingHeart",
    color: "#FFA3CF",
    slug: "/icon"
  },
  {
    name: "Illustration",
    description: "Illustration",
    cover: "FaGrinBeam",
    color: "#A8FFB1",
    slug: "/illustration"
  },
  {
    name: "Library",
    description: "Library",
    cover: "FaBook",
    color: "#FFBA93",
    slug: "/library"
  },
  {
    name: "Framework",
    description: "Framework",
    cover: "FaPuzzlePiece",
    color: "#CBA3FF",
    slug: "/framework"
  },
  {
    name: "Idea",
    description: "Idea",
    cover: "FaRegLightbulb",
    color: "#E2FFB2",
    slug: "/idea"
  },
  {
    name: "Deployment",
    description: "Deployment",
    cover: "FaPaperPlane",
    color: "#FFA9A9",
    slug: "/deployment"
  },
  {
    name: "Trick",
    description: "Trick",
    cover: "FaMagic",
    color: "#F797FF",
    slug: "/trick"
  },
  {
    name: "Database",
    description: "Database",
    cover: "hFaDatabase",
    color: "#FFE896",
    slug: "/database"
  },
  {
    name: "Cloud",
    description: "Cloud",
    cover: "FaCloudUploadAlt",
    color: "#96F2FF",
    slug: "/cloud"
  },
  {
    name: "Testing",
    description: "Testing",
    cover: "FaFlag",
    color: "#AE92FF",
    slug: "/testing"
  },
  {
    name: "Authentication",
    description: "Authentication",
    cover: "FaIdCardAlt",
    color: "#FF9393",
    slug: "/authentication"
  },
  {
    name: "CMS",
    description: "CMS",
    cover: "FaIgloo",
    color: "#FDFF9C",
    slug: "/cms"
  },
  {
    name: "Mobile",
    description: "Mobile",
    cover: "FaMobileAlt",
    color: "#94FFE5",
    slug: "/mobile"
  },
  {
    name: "Markdown",
    description: "Markdown",
    cover: "FaMarkdown",
    color: "#E6A0FF",
    slug: "/markdown"
  }
];

export const editCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  slug: z.string(),
  cover: z.string(),
  color: z.string()
});

export type EditCategoryInput = z.TypeOf<typeof editCategorySchema>;

export const deleteCategorySchema = z.object({
  id: z.string()
});

export const getCategoriesSchema = z.object({
  searchBy: z.string().optional()
});
