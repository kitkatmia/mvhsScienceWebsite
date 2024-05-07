import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
// import Link from "next/link";
// import { api } from "~/utils/api";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { Button } from "@mui/material";

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" }); // use useMutation to upload / change data in backend
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>MVLA Science Support</title>
        <meta name="description" content="MVLA and LAHS Science Suport Website" />
        <link rel="icon" href="/mvla_favicon.jpeg" />
      </Head>
      <NavBar/>
      <main className="flex justify-center bg-gradient-to-b h-screen from-[#ffffff] to-[#96bcff] pb-40">
        {/* DEBUG: lowkey looks bad centered vertically */}
        <div className="flex flex-col items-center justify-center px-4 pb-8">
          <h1 className="text-5xl font-extrabold tracking-tight text-black sm:text-[5rem] pb-8">
            MVLA Lab Support
          </h1>
          <div className="flex flex-col items-center">
            <div className="pb-10">
              {
                session ? (
                  <div className="flex justify-between gap-20">
                    <Button variant="outlined" component="a" href="/order" className="px-10" style={{maxWidth: '800px', maxHeight: '100px', minWidth: '30vw', minHeight: '10vh', fontSize: "18px"}}>
                      Order
                    </Button>
                    <Button variant="outlined" component="a" href="/order_status" style={{maxWidth: '800px', maxHeight: '100px', minWidth: '30vw', minHeight: '10vh', fontSize: "18px"}}>
                      Order Status
                    </Button>
                  </div>
                  )
                      : (
                          <div></div>
                      )
              }
              {/* <Button >Order</Button>
              <Button>Order Status</Button> */}
            </div>
            {/* <p className="text-2xl text-black">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p> */}
            <AuthShowcase />
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  // const { data: secretMessage } = api.example.getSecretMessage.useQuery(
  //   undefined, // no input
  //   { enabled: sessionData?.user !== undefined }
  // );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-black">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {/* {secretMessage && <span> - {secretMessage}</span>} */}
      </p>
      <Button
        variant="outlined"
        color="success"
        // className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </div>
  );
}
