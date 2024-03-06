import React from 'react'
import OrderTable from './components/OrderTable'    
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import { Order, Comment, User, Status } from "@prisma/client";

//TODO: make page accessable only to admins

type OrderWithCommentsAndUser = Order & { comments: (Comment & {user: User})[]; user: User };

const johnDoe = {
    id: "asdqwe",
    name: "John Doe",
    email: null,
    emailVerified: null,
    image: null,
    location: null,
};
const orders: OrderWithCommentsAndUser[] = [
    {
      id: "ashgdjhfkjafhkj",
      userId: johnDoe.id,
      user: johnDoe,
      date: new Date(1),
      status: "In_Progress",
      comments: [
        {
            id: "asdfw",
            contents: "Here Have a Comment",
            orderId: "ashgdjhfkjafhkj",
            userId: johnDoe.id,
            user: johnDoe
        },
        {
            id: "asddasd",
            contents: "Here Have another Comment",
            orderId: "ashgdjhfkjafhkj",
            userId: johnDoe.id,
            user: johnDoe
        }
      ],
      categories: "Chem, Lab",
      description: "Setup electrochem lab",
    },
  ];

export default function orderTable() {
    return <>
        <NavBar />
        <OrderTable orders={orders} />
        <Footer />
    </>;
}
