import { Button, Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { HiOutlineTrash } from "react-icons/hi";
import { trpc } from "src/utils/trpc";
import { useBoolean } from "usehooks-ts";
import Loader from "./loader";

function LabelDelete({ id }: { id: string }) {
  const {
    value: openDelLabel,
    setFalse: closeDelLabel,
    toggle: toggleDelLabel
  } = useBoolean(false);

  const { mutate, isLoading: loadingDel } = trpc.useMutation(["labels.delete-label"], {
    onSuccess: () => {
      closeDelLabel();
    }
  });

  return (
    <Menu placement="bottom-end" open={openDelLabel} handler={toggleDelLabel}>
      <MenuHandler>
        <button onClick={() => toggleDelLabel()}>
          <HiOutlineTrash className="w-9 h-9 rounded-full p-1.5 hover:bg-red-100 hover:text-red-600 cursor-pointer relative" />
        </button>
      </MenuHandler>
      <MenuList className="z-[10000]">
        <MenuItem className="!p-0">
          <Button
            className={`!normal-case btn-del !text-sm flex items-center `}
            onClick={() => mutate({ id: id })}
            disabled={loadingDel}
          >
            {loadingDel ? <Loader /> : <AiOutlineDelete className="w-5 h-5 mr-2" />}
            <span>Confirm Delete</span>
          </Button>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default LabelDelete;
