import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
// import Link from "next/link";
// import { api } from "~/utils/api";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { Button } from "@mui/material";

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" }); // use useMutation to upload / change data in backend

  return (
    <>
      <Head>
        <title>MVLA Science Support</title>
        <meta name="description" content="MVLA and LAHS Science Suport Website" />
        <link rel="icon" href="/mvla_favicon.jpeg" />
      </Head>
      <NavBar/>
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#ffffff] to-[#96bcff]">
        <div className="flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-black sm:text-[5rem]">
            MVLA Lab Support
          </h1>
          <div className="flex flex-col items-center">
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
