"use client";

import type { Order, Comment, User, Status } from "@prisma/client";
import React, { useState } from "react";
import Image from "next/image";
import { Button, ClickAwayListener, TextareaAutosize } from "@mui/material";
import SwitchAccessShortcutIcon from '@mui/icons-material/SwitchAccessShortcut';
import IconButton from '@mui/material/IconButton';
import { api } from "~/utils/api";
import { useSession } from 'next-auth/react';

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
  const { data: session } = useSession();
  const progressMutation = api.order.changeOrderStatus.useMutation();

  if (props.orders == undefined) {
    props.orders = [];
  }
  if (props.filters == undefined) {
    props.filters = [(e) => true];
  }

  const handleUpdateStatus = (orderId: string) => {
      progressMutation.mutate({orderId: orderId}, {
        onSuccess: (data) => {
          console.log('Updated order successfully!', data);
        },
        onError: (error) => {
          console.error('Failed to update order', error);
        }
      });
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
                      return (
                        <div key={questionType} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                          <p style={{ margin: 0 }}><strong>{questionType}</strong> {Object.values(detailsJSON[questionType])}</p>
                        </div>
                      );
                    } else {
                      subQuestions = detailsJSON[questionType];
                    }
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
                  {/* DEBUG: to see update, you have to update everything (reload); should be automatic*/}
                  {
                    session?.user.role === 1 ? (<>{statusMap[e.status]}<IconButton aria-label="update" onClick={() => handleUpdateStatus(e.id)}>
                    <SwitchAccessShortcutIcon />
                  </IconButton></>) : statusMap[e.status]
                  }
              </td>
              <td className="border border-solid border-blue-500 p-2 text-lg">
                <CommentBox comments={e.comments} orderId={e.id} />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

interface OrderCommentInformation {
  comment: string,
  orderId: string
}
function CommentBox(
  data: { comments: (Comment & { user: User })[] | undefined; orderId: string}
) {
  const mutation = api.order.addOrderComment.useMutation();

  const [opened, setOpened] = useState(false);
  const [comment, setComment] = useState('');

  if (data.comments == undefined) {
    data.comments = [];
  }

  const handleCommentChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setComment(event.target.value); 
  };

  const handleSubmit = () => {
    const newComment = {comment: comment, orderId: data.orderId} as OrderCommentInformation
    mutation.mutate(newComment, {
      onSuccess: (newComment) => {
        console.log('Comment created successfully!', newComment);
      },
      onError: (error) => {
        console.error('Failed to create order', error);
      }
    });
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
          <div className="absolute z-10 rounded-lg border-[2px] border-solid border-blue-500 bg-slate-50 p-1">
            {data.comments.map((e) => (
              <div key={e.id} className="flex items-center space-x-2 my-2">
                {e.user.image && (
                  <Image
                    src={e.user.image}
                    alt="user image"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                )}
                <span className="font-bold text-sm">{e.user.name}:</span>
                {/* {e.user.name + ": "}{" "} */}
                <span className="text-sm">{e.contents}</span>
              </div>
            ))}
            <div className="flex items-center mt-4">
              <TextareaAutosize
                className="m-2 flex-grow resize-none"
                placeholder="Enter a comment..."
                value={comment}
                onChange={handleCommentChange}
              />
              <Button
                type="submit"
                className="m-2 border-[1px] border-solid border-blue-200"
                onClick={handleSubmit}
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
