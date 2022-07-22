import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const CreateLinkForm = dynamic(() => import("../components/CreateLinkFrom"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <div className="flex flex-col gap-10 justify-center items-center h-screen bg-gray-950 text-white">
      <h1 className="text-3xl tracking-tight font-normal">Link shortener:</h1>
      <Suspense>
        <CreateLinkForm />
      </Suspense>
    </div>
  );
};

export default Home;