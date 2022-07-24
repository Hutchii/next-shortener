import type { NextPage } from "next";
import { useMemo, useState } from "react";
import { nanoid } from "nanoid";
import debounce from "lodash/debounce";
import { trpc } from "../utils/trpc";
import copy from "copy-to-clipboard";
import { slugValidator, urlValidator } from "../utils/validationRules";

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
    slug: {
      value: "",
      isTouched: false,
      error: "",
      validationRule: slugValidator,
    },
    url: {
      value: "",
      isTouched: false,
      error: "",
      validationRule: urlValidator,
    },
  });
  // const url = window.location.origin.split("//")[1];

  const slugCheck = trpc.useQuery(["slugCheck", { slug: form.slug.value }], {
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!form.slug.value && form.slug.isTouched,
  });
  const createSlug = trpc.useMutation(["createSlug"]);

  const input =
    "my-2 text-lg text-gray-650 px-3 bg-gray-850 border shadow-sm border-gray-750 placeholder-gray-650 focus:outline-none focus:border-lime-450 block w-full h-10";

  if (createSlug.status === "success") {
    return (
      <div className="animate-fade-in h-80 md:h-56">
        <h1 className="text-xl sm:text-2xl mb-2">Your shortened URL:</h1>
        <p className="font-normal text-xl mb-8">
          {process.env.NEXT_PUBLIC_URL + form.slug.value}
        </p>
        <button
          type="button"
          className="text-md font-medium border border-lime-450 px-5 cursor-pointer text-white h-10 hover:opacity-95 transition ease-in duration-75 mr-4"
          onClick={() => {
            setForm({
              slug: { ...form.slug, value: "", error: "", isTouched: false },
              url: { ...form.url, value: "", error: "", isTouched: false },
            });
            createSlug.reset(); //Resetting createSlug status to "idle"
          }}
        >
          Go back
        </button>
        <button
          type="button"
          className="text-md bg-lime-450 px-5 font-semibold cursor-pointer text-gray-750 h-10 hover:bg-lime-550 transition ease-in duration-75"
          onClick={() => {
            copy(process.env.NEXT_PUBLIC_URL + form.slug.value);
          }}
        >
          Copy link
        </button>
      </div>
    );
  }
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
        if (!form.slug.error && !form.url.error) {
          createSlug.mutate({ ...form });
        }
      }}
      className="md:flex md:flex-col w-full animate-fade-in h-80 md:h-56"
    >
      <div>
        <div className="md:flex md:items-center md:gap-2">
          <span className="font-normal text-xl whitespace-nowrap">
            {process.env.NEXT_PUBLIC_URL}
          </span>
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
              // debounce(slugCheck.refetch, 100);
              slugCheck.refetch;
            }}
            placeholder="short name"
            className={`${input} ${
              ((form.slug.error && form.slug.isTouched) ||
                (slugCheck.isFetched && slugCheck.data!.used)) &&
              "border-red-500 focus:border-red-500"
            }`}
            value={form.slug.value}
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
              slugCheck.refetch;
            }}
          >
            Random
          </button>
        </div>
        <span className="font-medium text-red-500 mt-1 md:-mt-1 h-[28px] md:h-6 block">
          {form.slug.isTouched && form.slug.error}
          {form.slug.value !== "" && slugCheck.data?.used
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
              form.url.error &&
              form.url.isTouched &&
              "border-red-500 focus:border-red-500"
            }`}
          />
        </div>
        <span className="font-medium text-red-500 h-6 block">
          {form.url.isTouched && form.url.error}
        </span>
      </div>
      <button
        type="submit"
        className="text-md bg-lime-450 px-5 font-semibold cursor-pointer text-gray-750 h-10 hover:bg-lime-550 transition ease-in duration-75 mt-2 md:mt-3 w-full relative"
        disabled={
          (slugCheck.isFetched && slugCheck.data!.used) ||
          (Boolean(form.slug.error) && form.slug.isTouched) ||
          (Boolean(form.url.error) && form.url.isTouched)
        }
      >
        {createSlug.status === "idle" && "Create"}
        {createSlug.status === "loading" && (
          <svg
            width="120"
            height="16"
            viewBox="0 0 120 30"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-gray-950 absolute top-3 left-1/2 bottom-2/4 translate-x-[-50%] animate-fade-in"
          >
            <circle cx="15" cy="15" r="15">
              <animate
                attributeName="r"
                from="15"
                to="15"
                begin="0s"
                dur="0.8s"
                values="15;9;15"
                calcMode="linear"
                repeatCount="indefinite"
              />
              <animate
                attributeName="fill-opacity"
                from="1"
                to="1"
                begin="0s"
                dur="0.8s"
                values="1;.5;1"
                calcMode="linear"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="60" cy="15" r="9" fillOpacity="0.3">
              <animate
                attributeName="r"
                from="9"
                to="9"
                begin="0s"
                dur="0.8s"
                values="9;15;9"
                calcMode="linear"
                repeatCount="indefinite"
              />
              <animate
                attributeName="fill-opacity"
                from="0.5"
                to="0.5"
                begin="0s"
                dur="0.8s"
                values=".5;1;.5"
                calcMode="linear"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="105" cy="15" r="15">
              <animate
                attributeName="r"
                from="15"
                to="15"
                begin="0s"
                dur="0.8s"
                values="15;9;15"
                calcMode="linear"
                repeatCount="indefinite"
              />
              <animate
                attributeName="fill-opacity"
                from="1"
                to="1"
                begin="0s"
                dur="0.8s"
                values="1;.5;1"
                calcMode="linear"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        )}
      </button>
    </form>
  );
};

export default CreateLinkForm;
