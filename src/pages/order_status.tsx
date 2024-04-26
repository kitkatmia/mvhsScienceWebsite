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

const generateSearchFilter = (searchTerm: string) => (e: OrderWithCommentsAndUser) => {
  if(searchTerm.length == 0) {
    return true;
  }
  console.log("matching");
    if(e.categories.includes(searchTerm)) {
      console.log(e.categories + " includes " + searchTerm);
      return true;
    }
    if(e.comments?.filter((comment) => (comment.contents.includes(searchTerm))) && e.comments?.filter((comment) => (comment.contents.includes(searchTerm))).length > 0) {
      console.log(e.comments + " inncludes " + searchTerm);
      return true;
    }
    if(e.description.includes(searchTerm)) {
      console.log(e.description + " includes " + searchTerm);
      return true;
    }
    if(JSON.stringify(e.details).includes(searchTerm)) {
      console.log("Details contain " + searchTerm);
      return true;
    }
    console.log("matchless");
    return false;
}

export default function OrderStatus() {
  const { data: sessionData } = useSession();
  const [orders, setOrders] = useState<OrderWithCommentsAndUser[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<((e: OrderWithCommentsAndUser) => boolean)[]>([generateSearchFilter(search)]);

  const orderQuery = api.order.getOrders.useQuery();
  useEffect(() => {
    setOrders(orderQuery.data? orderQuery.data : []);
  });
  
  return (
    <>
      <NavBar />
      <PageTitle title="Order Status" />
      <TextField fullWidth className="m-4" label="Search" value={search} onChange={(e) => {
        setSearch(e.target.value)
        setFilters([generateSearchFilter(search)]);
      }}/>
      {(sessionData?.user.role == 1) ? "user view": <OrderTable orders={orders} filters={filters} />}
      <Footer />
    </>
  );
}
