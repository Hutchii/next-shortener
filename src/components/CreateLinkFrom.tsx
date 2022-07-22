import type { NextPage } from "next";
import { useState } from "react";
import classNames from "classnames";
import { nanoid } from "nanoid";
import { debounce } from "lodash";
import { trpc } from "../utils/trpc";
import copy from "copy-to-clipboard";

type Form = {
  slug: string;
  url: string;
};

const CreateLinkForm: NextPage = () => {
  const [form, setForm] = useState<Form>({ slug: "", url: "" });
  const url = window.location.origin.split("//")[1];

  const slugCheck = trpc.useQuery(["slugCheck", { slug: form.slug }], {
    refetchOnReconnect: false, // replacement for enable: false which isn't respected.
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const createSlug = trpc.useMutation(["createSlug"]);

  const input =
    "my-2 text-lg text-gray-650 px-3 bg-gray-850 border shadow-sm border-gray-750 placeholder-gray-650 focus:outline-none focus:border-lime-450 block w-full h-10";

  const slugInput = classNames(input, {
    "border-red-500": slugCheck.isFetched && slugCheck.data!.used,
    "text-red-500": slugCheck.isFetched && slugCheck.data!.used,
  });

  if (createSlug.status === "success") {
    return (
      <>
        <div className="md:flex md:items-center md:gap-4 w-full md:w-[unset]">
          <h1 className="font-normal text-xl mb-2 md:mb-0">{`${window.location.origin}/${form.slug}`}</h1>
          <input
            type="button"
            value="Copy Link"
            className="text-md bg-lime-450 px-5 font-semibold cursor-pointer text-gray-750 h-10 hover:bg-lime-550 transition ease-in duration-75"
            onClick={() => {
              copy(`${url}/${form.slug}`);
            }}
          />
        </div>
        <input
          type="button"
          value="Go back"
          className="text-md bg-lime-450 px-5 font-semibold cursor-pointer text-gray-750 h-10 hover:bg-lime-550 transition ease-in duration-75 mr-auto md:mr-0"
          onClick={() => {
            createSlug.reset();
            setForm({ slug: "", url: "" });
          }}
        />
      </>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createSlug.mutate({ ...form });
      }}
      className="md:flex md:flex-col md:gap-3 w-full lg:w-3/4 2xl:w-1/2 3xl:w-2/5"
    >
      <div className="md:flex md:items-center md:gap-2">
        <span className="font-normal text-xl">{url}/</span>
        <input
          type="text"
          onChange={(e) => {
            setForm({
              ...form,
              slug: e.target.value,
            });
            debounce(slugCheck.refetch, 100);
          }}
          minLength={1}
          placeholder="short name"
          className={slugInput}
          value={form.slug}
          pattern={"^[-a-zA-Z0-9]+$"}
          title="Only alphanumeric characters and hypens are allowed. No spaces."
          required
        />
        <input
          type="button"
          value="Random"
          className="text-md bg-lime-450 px-5 font-semibold cursor-pointer text-gray-750 h-10 hover:bg-lime-550 transition ease-in duration-75"
          onClick={() => {
            const slug = nanoid();
            setForm({
              ...form,
              slug,
            });
            slugCheck.refetch();
          }}
        />
      </div>
      <div className="md:flex md:items-center md:gap-2">
        <span className="font-normal text-xl">Link:</span>
        <input
          type="url"
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          placeholder="https://example.com"
          className={input}
          required
        />
      </div>
      <input
        type="submit"
        value="Create"
        className="text-md bg-lime-450 px-5 font-semibold cursor-pointer text-gray-750 h-10 hover:bg-lime-550 transition ease-in duration-75"
        disabled={slugCheck.isFetched && slugCheck.data!.used}
      />
      <span className="font-medium text-red-500 h-6 block mt-2">
        {slugCheck.data?.used ? "Slug already in use." : null}
      </span>
    </form>
  );
};

export default CreateLinkForm;
