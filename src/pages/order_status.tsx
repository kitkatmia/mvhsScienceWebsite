import React, { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import PageTitle from "./components/PageTitle";
import OrderTable from "./components/OrderTable";
import { useSession } from "next-auth/react";
import type { Order, User, Comment } from "@prisma/client";
import { api } from "~/utils/api";

type OrderWithCommentsAndUser = Order & {
  comments: (Comment & { user: User })[] | undefined;
  user: User | undefined;
};


export default function OrderStatus() {
  const { data: sessionData } = useSession();
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
