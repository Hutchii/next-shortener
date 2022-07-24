import type { NextPage } from "next";
import { useState } from "react";
import classNames from "classnames";
import { nanoid } from "nanoid";
import { debounce } from "lodash";
import { trpc } from "../utils/trpc";
import copy from "copy-to-clipboard";
import { shortName, urlPath } from "../utils/validationRules";

type Form = {
  slug: {
    value: string;
    isTouched: boolean;
    error: string;
    validationRule: (value: string) => string;
  };
  url: {
    value: string;
    isTouched: boolean;
    error: string;
    validationRule: (value: string) => string;
  };
};

const CreateLinkForm: NextPage = () => {
  const [form, setForm] = useState<Form>({
    slug: { value: "", isTouched: false, error: "", validationRule: shortName },
    url: { value: "", isTouched: false, error: "", validationRule: urlPath },
  });
  // const url = window.location.origin.split("//")[1];

  const slugCheck = trpc.useQuery(["slugCheck", { slug: form.slug.value }], {
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!form.slug.value,
  });
  const createSlug = trpc.useMutation(["createSlug"]);

  const input =
    "my-2 text-lg text-gray-650 px-3 bg-gray-850 border shadow-sm border-gray-750 placeholder-gray-650 focus:outline-none focus:border-lime-450 block w-full h-10";

  // const slugInput = classNames(input, {
  //   "border-red-500": slugCheck.isFetched && slugCheck.data!.used,
  //   "text-red-500": slugCheck.isFetched && slugCheck.data!.used,
  // });

  // if (createSlug.status === "success") {
  //   // setForm({
  //   //   slug: {
  //   //     value: "",
  //   //     isTouched: false,
  //   //     error: "",
  //   //     validationRule: shortName,
  //   //   },
  //   //   url: { value: "", isTouched: false, error: "", validationRule: urlPath },
  //   // });
  //   return (
  //     <>
  //       <div className="md:flex md:items-center md:gap-4 w-full md:w-[unset]">
  //         <h1 className="font-normal text-xl mb-2 md:mb-0">{`${window.location.origin}/${form.slug}`}</h1>
  //         <input
  //           type="button"
  //           value="Copy Link"
  //           className="text-md bg-lime-450 px-5 font-semibold cursor-pointer text-gray-750 h-10 hover:bg-lime-550 transition ease-in duration-75"
  //           onClick={() => {
  //             copy(`${url}/${form.slug}`);
  //           }}
  //         />
  //       </div>
  //       <input
  //         type="button"
  //         value="Go back"
  //         className="text-md bg-lime-450 px-5 font-semibold cursor-pointer text-gray-750 h-10 hover:bg-lime-550 transition ease-in duration-75 mr-auto md:mr-0"
  //         // onClick={() => {
  //         //   createSlug.reset();
  //         //   setForm({ slug: "", url: "" });
  //         // }}
  //       />
  //     </>
  //   );
  // }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        for (const [key, value] of Object.entries(form)) {
          const formObj = form[key as keyof typeof form];
          formObj.error = value.validationRule(value.value);
          formObj.isTouched = true;
          setForm({ ...form, [key]: formObj });
        }
        createSlug.mutate({ ...form });
        console.log(createSlug.status);
      }}
      className="md:flex md:flex-col w-full"
    >
      <div>
        <div className="md:flex md:items-center md:gap-2">
          <span className="font-normal text-xl whitespace-nowrap">shortn-ten.vercel.app/</span>
          <input
            type="text"
            onBlur={() => {
              setForm({
                ...form,
                slug: { ...form.slug, isTouched: true },
              });
            }}
            onChange={(e) => {
              setForm({
                ...form,
                slug: {
                  ...form.slug,
                  value: e.target.value,
                  error: form.slug.validationRule(e.target.value),
                },
              });
              debounce(slugCheck.refetch, 100);
            }}
            placeholder="short name"
            className={`${input} ${
              (form.slug.error ||
                (slugCheck.isFetched && slugCheck.data!.used)) &&
              "border-red-500 focus:border-red-500"
            }`}
            value={form.slug.value}
            title="Only alphanumeric characters and hypens are allowed. No spaces."
          />
          <button
            type="button"
            className="text-md bg-lime-450 px-5 font-semibold cursor-pointer text-gray-750 h-10 hover:bg-lime-550 transition ease-in duration-75"
            onClick={() => {
              const slug = nanoid();
              setForm({
                ...form,
                slug: {
                  ...form.slug,
                  value: slug,
                  isTouched: true,
                  error: form.slug.validationRule(slug),
                },
              });
              debounce(slugCheck.refetch, 100);
            }}
          >
            Random
          </button>
        </div>
        <span className="font-medium text-red-500 mt-1 md:-mt-1 h-[28px] md:h-6 block">
          {form.slug.isTouched && form.slug.error}
          {form.slug.value !== "" && form.slug.isTouched && slugCheck.data?.used
            ? "Slug already in use"
            : ""}
        </span>
      </div>
      <div>
        <div className="md:flex md:items-center md:gap-2">
          <span className="font-normal text-xl">Link:</span>
          <input
            type="text"
            onBlur={() => {
              setForm({
                ...form,
                url: { ...form.url, isTouched: true },
              });
            }}
            onChange={(e) =>
              setForm({
                ...form,
                url: {
                  ...form.url,
                  value: e.target.value,
                  error: form.url.validationRule(e.target.value),
                },
              })
            }
            placeholder="https://example.com"
            className={`${input} ${
              form.url.error && "border-red-500 focus:border-red-500"
            }`}
          />
        </div>
        <span className="font-medium text-red-500 h-6 block">
          {form.url.isTouched && form.url.error}
        </span>
      </div>
      <button
        type="submit"
        className="text-md bg-lime-450 px-5 font-semibold cursor-pointer text-gray-750 h-10 hover:bg-lime-550 transition ease-in duration-75 mt-2 md:mt-3 w-full"
        // disabled={slugCheck.isFetched && slugCheck.data!.used}
      >
        Create
      </button>
    </form>
  );
};

export default CreateLinkForm;
