import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const CreateLinkForm = dynamic(() => import("../components/CreateLinkFrom"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <main className="w-full flex items-center justify-center h-screen bg-gray-950 text-white">
      <div className="px-10 w-full lg:w-3/4 2xl:w-1/2 3xl:w-2/5">
        <h1 className="text-3xl sm:text-4xl tracking-tight font-normal">Link shortener:</h1>
        <p className="text-gray-650 text-lg mt-3 mb-20">
          Your shortened URLs can be used in publications, documents,
          advertisements, blogs, forums, instant messages, and other locations.
          Track statistics for your business and projects by monitoring the
          number of hits from your URL with the click counter, you do not have
          to register.
        </p>
        <Suspense>
          <CreateLinkForm />
        </Suspense>
      </div>
    </main>
  );
};

export default Home;
