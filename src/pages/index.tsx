import type { NextPage } from "next";
import CreateLinkForm from "../components/CreateLinkFrom";

// const CreateLinkForm = dynamic(() => import("../components/CreateLinkFrom"), {
//   ssr: false,
// });

const Home: NextPage = () => {
  return (
    <main className="w-full flex items-center justify-center h-screen bg-gray-950 text-white">
      <div className="px-10 w-full lg:w-3/4 2xl:w-1/2 3xl:w-2/5">
        <h1 className="text-3xl sm:text-4xl tracking-tight font-normal animate-fade-in">
          Link shortener
        </h1>
        <p className="text-gray-650 text-lg mt-3 mb-14 animate-fade-in">
          Tool to shorten a URL or reduce a link. Made using Next.js, Tailwind,
          Prisma and trpc. Uses Next.js middleware and API Routes.
        </p>
        {/* <Suspense> */}
        <CreateLinkForm />
        {/* </Suspense> */}
      </div>
    </main>
  );
};

export default Home;
