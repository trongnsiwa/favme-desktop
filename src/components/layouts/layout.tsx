import Sidebar from "@components/common/sidebar";
import { IconButton, Tooltip } from "@material-tailwind/react";
import { useStore } from "src/store/store";
import Navbar from "../common/navbar";
import { RiHeartAddLine } from "react-icons/ri";
import { useBoolean } from "usehooks-ts";
import AddNewDialog from "@components/dialogs/add-new-fav";
import FavDetailDialog from "@components/dialogs/fav-detail";

type LayoutProps = { children: React.ReactNode };

function Layout({ children }: LayoutProps) {
  const openSidebar = useStore((state) => state.openSidebar);
  const manageCategory = useStore((state) => state.manageCategory);

  const { toggle, value: isAdd } = useBoolean(false);

  return (
    <div
      className={`bg-fav-400 fixed h-screen right-0 ${
        openSidebar ? "w-[calc(100vw-280px)]" : "w-full"
      }`}
    >
      <Sidebar />
      <Navbar />
      <div
        className={`${
          manageCategory ? "h-screen w-[calc(100vw-280px)] fixed bg-black/50 z-50" : ""
        }`}
      ></div>
      <main
        className={`bg-fav-400 overflow-auto h-[calc(100%-80px)] ${
          openSidebar ? "w-[calc(100vw-280px)]" : "w-full"
        } right-0 bottom-0 fixed p-10 transition-all ${
          openSidebar ? "duration-400" : "duration-500"
        }`}
      >
        {children}
      </main>
      <div className="absolute z-10 bottom-10 left-1/2 -translate-x-1/2">
        <Tooltip
          content="Create New"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 }
          }}
        >
          <IconButton
            size="lg"
            className="!rounded-full bg-fav-200 !opacity-100 !w-16 !h-16 !max-w-none !max-h-fit shadow-fav-200/20 hover:!shadow-fav-200/40"
            onClick={toggle}
          >
            <RiHeartAddLine className="!w-8 !h-8 text-white" />
          </IconButton>
        </Tooltip>
      </div>
      <AddNewDialog open={isAdd} handleOpen={toggle} />
      <FavDetailDialog />
    </div>
  );
}

export default Layout;
