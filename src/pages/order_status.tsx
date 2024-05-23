import React, { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import PageTitle from "./components/PageTitle";
import OrderTable from "./components/OrderTable";
import { useSession } from "next-auth/react";
import type { Order, User, Comment } from "@prisma/client";
import { api } from "~/utils/api";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

type OrderWithCommentsAndUser = Order & {
  comments: (Comment & { user: User })[] | undefined;
  user: User | undefined;
};

const generateSearchFilter =
  (searchTerm: string) => (e: OrderWithCommentsAndUser) => {
    if (searchTerm.length == 0) {
      return true;
    }
    searchTerm = searchTerm.toLowerCase();
    if (e.categories.toLowerCase().includes(searchTerm)) {
      return true;
    }
    if (
      e.comments?.filter((comment) => comment.contents.toLowerCase().includes(searchTerm)) &&
      e.comments?.filter((comment) => comment.contents.toLowerCase().includes(searchTerm))
        .length > 0
    ) {
      return true;
    }
    if (e.description.toLowerCase().includes(searchTerm)) {
      return true;
    }
    if (JSON.stringify(e.details).toLowerCase().includes(searchTerm)) {
      return true;
    }
    if(e.user?.name?.toLowerCase().includes(searchTerm)) {
      return true;
    }
    return false;
  };

export default function OrderStatus() {
  const { data: sessionData } = useSession({
    required: true,
    onUnauthenticated() {
      console.log("uh oh - unauthetnicated");
    }
  });
  const [orders, setOrders] = useState<OrderWithCommentsAndUser[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<
    ((e: OrderWithCommentsAndUser) => boolean)[]
  >([generateSearchFilter(search)]);
  const [sortOrder, setSortOrder] = useState('');
  const orderQuery = api.order.getOrders.useQuery({role: (sessionData?.user.role ?? 0)});

  useEffect(() => {
    setOrders(orderQuery.data ? orderQuery.data : []);
  }, [orderQuery]);

  const sortFunction = function(a: OrderWithCommentsAndUser, b: OrderWithCommentsAndUser) {
    if(sortOrder == "categories") {
      return a.categories.localeCompare(b.categories);
    }
    if(sortOrder == "date") {
      return a.date > b.date ? 1 : a.date == b.date ? 0 : -1;
    }
    if(sortOrder == "user") {
      if(a.user && b.user && a.user.name && b.user.name) {
        return a.user.name.localeCompare(b.user.name);
      }
    }
    return 0;
  }

  return (
    <>
      <NavBar />
      <PageTitle title="Order Status" />
        {/* <TextField fullWidth className="m-4" label="Search" value={search} onChange={(e) => {
          setSearch(e.target.value)
          setFilters([generateSearchFilter(search)]);
        }}/> */}
      <div className="w-3/4 m-auto">
        <FormControl className="flex flex-row">
        <TextField
          className="my-4 w-1/2"
          label="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setFilters([generateSearchFilter(search)]);
          }}
        />
        <Button className="my-4 w-1/6 ml-4" onClick={() => setFilters([generateSearchFilter(search)])}>
          Search
        </Button>
        <Button className="my-4 w-1/6 ml-4"
          onClick={() => {
            setSearch("");
            setFilters([generateSearchFilter("")]);
          }}
        >
          Clear Search
        </Button>
        <Select className="w-1/3 ml-10 my-4" value={sortOrder} label="Sort by" onChange={e => {
          setSortOrder(e.target.value);
        }}>
          <MenuItem value="categories">Category</MenuItem>
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="user">Username</MenuItem>
        </Select>
        </FormControl>
      </div>
      <OrderTable orders={orders} filters={filters} sortFunction={sortFunction} />
      <Footer />
    </>
  );
}
