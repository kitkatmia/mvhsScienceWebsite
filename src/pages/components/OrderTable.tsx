"use client";

import { Order, Comment, User, Status } from "@prisma/client";
import { useState } from "react";

const statusMap: Record<Status, string> = {
  Complete: "Complete",
  Not_Started: "Not Started",
  In_Progress: "In Progress",
};

//testing order table
type OrderWithCommentsAndUser = Order & { comments: (Comment & {user: User})[]; user: User };

export default function OrderTable(data: {
  orders: OrderWithCommentsAndUser[];
}) {
  return (
    <table className="w-full table-auto border-collapse">
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
      {data.orders.map((e) => (
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
    </table>
  );
}

function CommentBox(data: { comments: (Comment & {user: User})[] }) {
    var [opened, setOpened] = useState(false);

  return (<>
    <span className="rounded-md bg-blue-500 p-1 cursor-pointer" onClick={() => setOpened(!opened)}>
      {data.comments.length + " Comments"}
    </span>
    {opened && <div className="absolute bg-slate-900 rounded-lg border-blue-500 border-solid border-[2px]">
        {data.comments.map(e => <div className="divide-y-2 divide-solid divide-green-500">
            {e.user.name + ": "} <span className="text-sm">{e.contents}</span>
        </div>)}
    </div>}
    </>
  );
}