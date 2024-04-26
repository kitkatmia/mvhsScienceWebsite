import React, { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import PageTitle from "./components/PageTitle";
import OrderTable from "./components/OrderTable";
import { useSession } from "next-auth/react";
import type { Order, User, Comment } from "@prisma/client";
import { api } from "~/utils/api";
import { TextField } from "@mui/material";

type OrderWithCommentsAndUser = Order & {
  comments: (Comment & { user: User })[] | undefined;
  user: User | undefined;
};


export default function OrderStatus() {
  const { data: sessionData } = useSession();
  const [orders, setOrders] = useState<OrderWithCommentsAndUser[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<((e: OrderWithCommentsAndUser) => boolean)[]>([(e) => {
    if(e.categories.includes(search)) {
      return true;
    }
    if(e.comments?.filter((comment) => (comment.contents.includes(search)))) {
      return true;
    }
    if(e.description.includes(search)) {
      return true;
    }
    if(e.details && e.details?.toString().includes(search)) {
      return true;
    }
    return false;
  }]);

  const orderQuery = api.order.getOrders.useQuery();
  useEffect(() => {
    setOrders(orderQuery.data? orderQuery.data : []);
    console.log(orders);
  });
  
  return (
    <>
      <NavBar />
      <PageTitle title="Order Status" />
      <TextField fullWidth className="m-4" label="Search" value={search} onChange={(e) => {
        setSearch(e.target.value)
      }}/>
      {(sessionData?.user.role == 1) ? "user view": <OrderTable orders={orders} filters={[]} />}
      <Footer />
    </>
  );
}
