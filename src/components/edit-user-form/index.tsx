"use client";

import { InputTypes, Routes } from "@/constants/enums";
import useFormFields from "@/hooks/useFormFields";
import { IFormField } from "@/types/app";
import { Translations } from "@/types/translations";
import { Session } from "next-auth";
import Image from "next/image";
import FormFields from "../form-fields/form-fields";
import { Button } from "../ui/button";
import { UserRole } from "@prisma/client";
import Checkbox from "../form-fields/checkbox";
import { useActionState, useEffect, useState } from "react";
import { ValidationErrors } from "@/validations/auth";
import { updateProfile } from "./_actions/profile";
import Loader from "../ui/loader";
import { CameraIcon, UserRound, ShieldCheck, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

function EditUserForm({
  translations,
  user,
}: {
  translations: Translations;
  user: Session["user"];
}) {
  const { locale } = useParams();
  const router = useRouter();
  const session = useSession();
  const formData = new FormData();

  Object.entries(user).forEach(([key, value]) => {
    if (value !== null && value !== undefined && key !== "image") {
      formData.append(key, value.toString());
    }
  });

  const initialState: {
    message?: string;
    error?: ValidationErrors;
    status?: number | null;
    formData?: FormData | null;
  } = {
    message: "",
    error: {},
    status: null,
    formData,
  };

  const [selectedImage, setSelectedImage] = useState(user.image ?? "");
  const [isAdmin, setIsAdmin] = useState(user.role === UserRole.ADMIN);
  const [state, action, pending] = useActionState(
    updateProfile.bind(null, isAdmin),
    initialState,
  );
  const { getFormFields } = useFormFields({
    slug: Routes.PROFILE,
    translations,
  });

  useEffect(() => {
    if (state.message && state.status && !pending) {
      toast({
        title: state.message,
        className: state.status === 200 ? "text-green-400" : "text-destructive",
      });

      if (state.status === 200) {
        router.replace(`/${locale}/${Routes.ROOT}`);
      }
    }
  }, [locale, pending, router, state.message, state.status]);

  return (
    <form
      action={action}
      className="grid gap-5 lg:grid-cols-[minmax(230px,0.72fr)_minmax(0,1.7fr)]"
    >
      <aside className="rounded-[1.75rem] border border-border/80 bg-linear-to-b from-secondary/90 via-card to-card p-6 shadow-[0_14px_38px_rgba(52,35,22,0.05)] sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-5 size-36 overflow-hidden rounded-full border-[5px] border-white bg-[#f5e7d8] shadow-[0_12px_28px_rgba(75,48,30,0.12)] sm:size-40">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={user.name || "Profile"}
                width={200}
                height={200}
                unoptimized
                className="size-full object-cover"
              />
            ) : (
              <div className="element-center size-full text-primary/70">
                <UserRound className="size-16" strokeWidth={1.25} />
              </div>
            )}
            <UploadImage setSelectedImage={setSelectedImage} />
          </div>
          <h2 className="max-w-full wrap-break-word text-xl font-extrabold tracking-tight text-foreground">
            {user.name || "—"}
          </h2>
          <p className="mt-2 flex max-w-full items-center justify-center gap-2 break-all text-sm text-muted-foreground">
            <Mail className="size-4 shrink-0" />
            {user.email}
          </p>
          {user.role === UserRole.ADMIN && (
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
              <ShieldCheck className="size-4" />
              Admin
            </span>
          )}
        </div>
      </aside>

      <div className="form-surface min-w-0 p-5 sm:p-8">
        <div className="mb-6 border-b border-border/70 pb-5">
          <h2 className="text-xl font-extrabold tracking-tight text-foreground">
            {translations.profile.title}
          </h2>
        </div>

        <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
          {getFormFields().map((field: IFormField) => {
            const fieldValue =
              state?.formData?.get(field.name) ?? formData.get(field.name);
            const isWideField = field.name === "streetAddress";

            return (
              <div
                key={field.name}
                className={isWideField ? "sm:col-span-2" : "min-w-0"}
              >
                <FormFields
                  {...field}
                  defaultValue={fieldValue as string}
                  error={state?.error}
                  readOnly={field.type === InputTypes.EMAIL}
                />
              </div>
            );
          })}
        </div>

        {session.data?.user.role === UserRole.ADMIN && (
          <div className="my-6 flex items-center gap-3 rounded-2xl border border-border bg-secondary/45 p-4">
            <Checkbox
              name="admin"
              checked={isAdmin}
              onClick={() => setIsAdmin(!isAdmin)}
              label="Admin"
            />
          </div>
        )}

        <div className="mt-7 border-t border-border/70 pt-6">
          <Button
            type="submit"
            className="h-12 w-full rounded-xl font-bold shadow-lg shadow-primary/15 sm:w-auto sm:min-w-48"
          >
            {pending ? <Loader /> : translations.save}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default EditUserForm;

const UploadImage = ({
  setSelectedImage,
}: {
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="image-upload"
        onChange={handleImageChange}
        name="image"
      />
      <label
        htmlFor="image-upload"
        aria-label="Upload profile image"
        className="absolute bottom-1 inset-e-1 element-center size-10 cursor-pointer rounded-full border-[3px] border-white bg-primary text-primary-foreground shadow-lg transition hover:scale-105 hover:bg-primary/90"
      >
        <CameraIcon className="size-4" />
      </label>
    </>
  );
};
