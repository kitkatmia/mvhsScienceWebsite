"use client";

import type { Order, Comment, User, Status } from "@prisma/client";
import { useState } from "react";
import Image from "next/image";
import {
  Button,
  ClickAwayListener,
  TextareaAutosize,
} from "@mui/material";

const statusMap: Record<Status, string> = {
  Complete: "Complete",
  Not_Started: "Not Started",
  In_Progress: "In Progress",
};

type OrderWithCommentsAndUser = Order & {
  comments: (Comment & { user: User })[] | undefined;
  user: User | undefined;
};

export default function OrderTable(props: {
  orders: OrderWithCommentsAndUser[];
}) {
  if (props.orders == undefined) {
    props.orders = [];
  }
  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr>
          <th className="border border-solid border-green-500 border-b-teal-500 text-lg">
            Requester
          </th>
          <th className="border border-solid border-green-500 border-b-teal-500 text-lg">
            Date
          </th>
          <th className="border border-solid border-green-500 border-b-teal-500 text-lg">
            Description
          </th>
          <th className="border border-solid border-green-500 border-b-teal-500 text-lg">
            Status
          </th>
          <th className="border border-solid border-green-500 border-b-teal-500 text-lg">
            Comments
          </th>
        </tr>
      </thead>
      <tbody>
        {props.orders.map((e) => (
          <tr key={e.id}>
            <td className="border border-solid border-blue-500 p-2 text-lg">
              {e.user?.name}
            </td>
            <td className="border border-solid border-blue-500 p-2 text-lg">
              {e.date.toDateString()}
            </td>
            <td className="border border-solid border-blue-500 p-2 text-lg">
              {e.description}
            </td>
            <td className="border border-solid border-blue-500 p-2 text-lg">
              {statusMap[e.status]}
            </td>
            <td className="border border-solid border-blue-500 p-2 text-lg">
              <CommentBox comments={e.comments} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CommentBox(data: { comments: (Comment & { user: User })[] | undefined }) {
  const [opened, setOpened] = useState(false);
  if (data.comments == undefined) {
    data.comments = [];
  }
  return (
    <>
      <Button
        className="cursor-pointer rounded-md border border-solid border-blue-200 p-2"
        onClick={() => setTimeout(() => setOpened(!opened), 1)}
      >
        {data.comments.length + " Comments"}
      </Button>
      <ClickAwayListener onClickAway={() => setOpened(false)}>
        {opened ? (
          <div className="absolute z-10 rounded-lg border-[2px] border-solid border-blue-500 bg-slate-900">
            {data.comments.map((e) => (
              <div key={e.id}>
                {e.user.image && (
                  <Image
                    src={e.user.image}
                    alt="user image"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                )}
                {e.user.name + ": "}{" "}
                <span className="text-sm">{e.contents}</span>
              </div>
            ))}
            <div className="m-2 flex">
              <TextareaAutosize
                className="m-2 resize-none flex-grow"
                placeholder="Enter a comment..."
              />
              <Button
                type="submit"
                className="border-[1px] border-solid border-blue-200 m-2"
              >
                Post
              </Button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </ClickAwayListener>
    </>
  );
}
