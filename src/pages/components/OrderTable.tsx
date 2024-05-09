"use client";

import type { Order, Comment, User, Status } from "@prisma/client";
import React, { useState } from "react";
import Image from "next/image";
import { Button, ClickAwayListener, TextareaAutosize } from "@mui/material";

interface DetailsJSON {
  [key: string]: SubQuestions;
}

interface SubQuestions {
  [key: string]: string;
}

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
  filters: ((e: OrderWithCommentsAndUser) => boolean)[];
  sortFunction: (
    a: OrderWithCommentsAndUser,
    b: OrderWithCommentsAndUser,
  ) => number;
}) {
  if (props.orders == undefined) {
    props.orders = [];
  }
  if (props.filters == undefined) {
    props.filters = [(e) => true];
  }
  return (
    <table className="m-auto w-3/4 table-auto border-collapse">
      <thead>
        <tr>
          <th className="border border-solid border-green-500 border-b-teal-500 text-lg">
            Requester
          </th>
          <th className="border border-solid border-green-500 border-b-teal-500 text-lg">
            Date
          </th>
          <th className="border border-solid border-green-500 border-b-teal-500 text-lg">
            Category
          </th>
          <th className="border border-solid border-green-500 border-b-teal-500 text-lg">
            Details
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
        {props.orders
          .filter((order: OrderWithCommentsAndUser) => {
            for (const f of props.filters) {
              if (!f(order)) {
                return false;
              }
            }
            return true;
          })
          .sort(props.sortFunction)
          .map((e) => (
            <tr key={e.id}>
              <td className="border border-solid border-blue-500 p-2 text-lg">
                {e.user?.name}
              </td>
              <td className="border border-solid border-blue-500 p-2 text-lg">
                {e.date.toDateString()}
              </td>
              <td className="border border-solid border-blue-500 p-2 text-lg">

                {e.categories}
              </td>
              <td className="border border-solid border-blue-500 p-2 text-lg">
                {
                  // console.log(Object.keys(JSON.parse(e.details)))
                  Object.keys(JSON.parse(e.details)).map((questionType) => {
                    const detailsJSON: DetailsJSON = JSON.parse(e.details);
                    let subQuestions: SubQuestions | undefined = {};

                    if (detailsJSON[questionType] === undefined || detailsJSON[questionType] == null) {
                      return;
                    }
                    
                    if (questionType === "period" || questionType === "date") {
                      console.log("questiontype: "+questionType)
                      return (
                        <div key={questionType} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                          <p style={{ margin: 0 }}><strong>{questionType}</strong> {Object.values(detailsJSON[questionType])}</p>
                        </div>
                      );
                      // subQuestions = {[questionType]: detailsJSON[questionType]} as SubQuestions; 
                    } else {
                      subQuestions = detailsJSON[questionType];
                    }
                    console.log(Object.keys(detailsJSON))
                    // return <></>
                    // const subQuestionArr: SubQuestions[] = detailsJSON[questionType];
                    const subQuestionElements = Object.keys(subQuestions).map((questionKey) => {
                      const answer = subQuestions[questionKey];
                      return (
                        <div key={questionKey} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                          <p style={{ margin: 0 }}><strong>{questionKey}</strong> {answer}</p>
                        </div>
                      );

                    })
                   return <React.Fragment key={questionType}>{subQuestionElements}</React.Fragment>;
                  })
                // fix
                }
       {/* Object.keys(subQuestionArr).map((question) => { */}
                    {/* //   return (
                    //     <div>
                    //       <p key={question}>{question}</p>
                    //       <p key={question}>{subQuestionArr[question]}</p>
                    //     </div>
                    //   )
                    // }
                    // )
                    // console.log(json[questionType], "    ", questionType, "    ", e.details)
                  // return JSON.stringify(e.details) */}
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

function CommentBox(data: {
  comments: (Comment & { user: User })[] | undefined;
}) {
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
          <div className="absolute z-10 rounded-lg border-[2px] border-solid border-blue-500 bg-slate-50">
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
                className="m-2 flex-grow resize-none"
                placeholder="Enter a comment..."
              />
              <Button
                type="submit"
                className="m-2 border-[1px] border-solid border-blue-200"
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
