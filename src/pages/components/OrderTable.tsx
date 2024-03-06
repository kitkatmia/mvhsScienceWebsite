"use client";

import type { Order, Comment, User, Status } from "@prisma/client";
import { useState } from "react";
import Image from "next/image";

const statusMap: Record<Status, string> = {
  Complete: "Complete",
  Not_Started: "Not Started",
  In_Progress: "In Progress",
};

//testing order table
type OrderWithCommentsAndUser = Order & {
  comments: (Comment & { user: User })[];
  user: User;
};

export default function OrderTable(props: {
  orders: OrderWithCommentsAndUser[];
}) {
    if(props.orders == undefined) {
        props.orders = []
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
              {e.user.name}
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

function CommentBox(data: { comments: (Comment & { user: User })[] }) {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <span
        className="cursor-pointer rounded-md bg-blue-500 p-1"
        onClick={() => setOpened(!opened)}
      >
        {data.comments.length + " Comments"}
      </span>
      {opened && (
        <div className="absolute rounded-lg border-[2px] border-solid border-blue-500 bg-slate-900">
          {data.comments.map((e) => (
            <div key={e.id}>
              {e.user.image && <Image src={e.user.image} alt="user image" width={100} height={100}/>}{e.user.name + ": "} <span className="text-sm">{e.contents}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
