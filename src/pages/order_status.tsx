import React, { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import PageTitle from "./components/PageTitle";
import OrderTable from "./components/OrderTable";
import { useSession } from "next-auth/react";
import type { Order, User, Comment } from "@prisma/client";
import prismaClient from "~/utils/prismaClient";
import { api } from "~/utils/api";

type OrderWithCommentsAndUser = Order & {
  comments: (Comment & { user: User })[] | undefined;
  user: User | undefined;
};

// const johnDoe: User = {
//   id: "asdqwe",
//   name: "John Doe",
//   email: null,
//   emailVerified: null,
//   image:
//     "https://lh3.googleusercontent.com/a/ACg8ocKzngrO7d0VOOFnlqkAkP8YQ6I6yKsoFfG-7-ZQ9VVFWg=s96-c",
//   location: null,
//   role: null,
//   school: null,
// };
// const orders: OrderWithCommentsAndUser[] = [
//   {
//     id: "ashgdjhfkjafhkj",
//     userId: johnDoe.id,
//     user: johnDoe,
//     date: new Date(1),
//     status: "In_Progress",
//     comments: [
//       {
//         id: "asdfw",
//         contents: "Here Have a Comment",
//         orderId: "ashgdjhfkjafhkj",
//         userId: johnDoe.id,
//         user: johnDoe,
//       },
//       {
//         id: "asddasd",
//         contents: "Here Have another Comment",
//         orderId: "ashgdjhfkjafhkj",
//         userId: johnDoe.id,
//         user: johnDoe,
//       },
//     ],
//     categories: "Chem, Lab",
//     description: "Setup electrochem lab",
//   },
// ];

export default function OrderStatus() {
  
  const session = useSession();
  const emptyOrders: OrderWithCommentsAndUser[] = [];
  const [orders, setOrders] = useState(emptyOrders);

  return (
    <>
      <NavBar />
      <PageTitle title="Order Status" />
      {(sessionData?.user.role == 1) ? "user view": <OrderTable orders={orders} />}
      <Footer />
    </>
  );
}
