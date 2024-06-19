import Navbar from "@/components/Navbar/Navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStoreContext } from "@/store/StoreProvider";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import AxiosInstance from "@/utils/AxiosInstance";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { REACT_QUERY } from "@/constants/reactQuery";
import { useNavigate } from "react-router-dom";
const ACCEPTED_FILE_TYPE = ["image/png", "image/jpg", "image/jpeg"];
const PHONE_REGEX = /^[6-9]\d{9}$/;
const schema = yup.object().shape({
  name: yup.string().required(),
  file: yup
    .mixed()
    .test("required", "Please select an image", (value) => {
      if (typeof value == "string") {
        return value?.length > 0;
      }
      return value;
    })
    .test("fileType", "Only png, jpg, jpeg files are allowed", (value) => {
      if (typeof value == "string") {
        return value?.length > 0;
      }
      const file = value;
      return ACCEPTED_FILE_TYPE.includes(file?.type);
    }),

  phone: yup
    .string()
    .required()
    .matches(PHONE_REGEX, "Phone number is not valid"),
  address: yup.string().required(),
});
export default function EditProfile() {
  const queryClient = useQueryClient(); 
  const { user_data } = useStoreContext();
  const navigate = useNavigate();
  const { isPending, mutate } = useMutation({
    mutationKey: [REACT_QUERY.UPDATE_PROFILE],
    mutationFn: async (data) => {
      const formData = new FormData();
      for (var key in data) {
        formData.append(key, data[key]);
      }
      return (
        await AxiosInstance.post("/update", formData, {
          headers: {
            ...AxiosInstance.defaults.headers,
            "Content-Type": "multipart/form-data",
          },
        })
      ).data;
    },
    onSuccess: async (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY.PROFILE],
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/profile");
    },
    onError: (error) => {
      return toast.error(
        error?.response?.data?.message || error?.data?.message
      );
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    values: {
      address: user_data?.address,
      name: user_data?.name,
      phone: user_data?.phone,
      file: user_data?.avatar,
    },
  });

  return (
    <section className="container">
      <Navbar />
      <h1 className="text-center mt-10 font-semibold text-xl ">
        Update you profile
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 flex flex-col gap-5 items-center "
      >
        <AvatarUpdateField
          control={control}
          name={"file"}
          errors={errors}
          watch={watch}
        />
        <InputField name={"name"} register={register} errors={errors} />
        <InputField name={"phone"} register={register} errors={errors} />
        <InputField name={"address"} register={register} errors={errors} />
        {isPending ? (
          <button
            disabled
            type="button"
            className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-pink-500 hover:bg-pink-400 transition ease-in-out duration-150 cursor-not-allowed"
          >
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </button>
        ) : (
          <Button className="" type="submit">
            Update
          </Button>
        )}
      </form>
    </section>
  );
}

function InputField({ name, register, errors }) {
  return (
    <div className="space-y-2 w-full md:w-auto  ">
      <Label className="capitalize">{name}</Label>
      <Input name={name} {...register(name)} className="max-w- md:w-96" />
      <span className="text-red-500 text-sm">
        {errors[name] && errors[name].message}
      </span>
    </div>
  );
}
function AvatarUpdateField({ name, errors, watch, control }) {
  const avatar = watch("file");
  const { user_data } = useStoreContext();
  return (
    <div className="space-y-2 w-full md:w-auto  ">
      <div className="flex items-center gap-5">
        <Avatar className="w-24 h-24">
          <AvatarImage
            src={
              typeof avatar == "object"
                ? ACCEPTED_FILE_TYPE.includes(avatar?.type)
                  ? URL.createObjectURL(avatar)
                  : user_data?.avatar
                : user_data?.avatar
            }
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange } }) => (
            <Input
              type="file"
              onChange={(e) => {
                const files = e.target.files;
                if (files.length == 0) return onChange(user_data?.avatar);
                return onChange(e.target.files[0]);
              }}
            />
          )}
        />
      </div>
      <span className="text-red-500 text-sm">
        {errors[name] && errors[name].message}
      </span>
    </div>
  );
}
