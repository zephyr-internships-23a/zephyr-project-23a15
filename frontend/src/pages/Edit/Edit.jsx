import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { REACT_QUERY } from "@/constants/reactQuery";
import { CircleX } from "lucide-react";
import AxiosInstance from "@/utils/AxiosInstance";
import { useState } from "react";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
const ACCEPTED_FILE_TYPE = ["image/png", "image/jpg", "image/jpeg"];
const schema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),
    price: yup.number().typeError("price must be a number").required(),
    location: yup.string().required(),
    age: yup.number().typeError("age must be a number").required(),
});
export default function EditPropertyModal({
    title, description, price, location, age, images , id 
}) {
    const [files, setFiles] = useState([]);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [existingImages, setExistingImages] = useState(images);
    const [fileErr, setFileErr] = useState("");
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
        values: {
            title,
            description,
            price,
            location,
            age,
        }
    });
    const { mutate } = useMutation({
        mutationKey: [REACT_QUERY.UPLOAD_PROPERTY],
        mutationFn: async (data) => {
            console.log(data);
            const formData = new FormData();
            for (var key in data) {
                formData.append(key, data[key]);
            } 
            existingImages.forEach((image) => {
                formData.append("existingImages", image);
            })
            uploadFiles.forEach((file) => {
                formData.append("files", file);
            });
            const response = await AxiosInstance.patch(`/property/${id}`, formData, {
                headers: {
                    ...AxiosInstance.defaults.headers,
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        },
        onSuccess: async (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({
                queryKey: [REACT_QUERY.PROPERTY],
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || error?.message);
        },
    });
    console.log(uploadFiles);
    const onSubmit = (data) => {
        mutate(data);
    };
    return (
        <Dialog>
            <DialogTrigger>
                <Button>Edit property</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Upload a new Property</DialogTitle>
                </DialogHeader>
                <form className="space-y-1" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-1">
                        <Label>Property title</Label>
                        <Input {...register("title")} />
                        <span className="text-red-500 text-xs">
                            {errors?.title?.message}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <Label>Property description</Label>
                        <Textarea className="resize-none" {...register("description")} />
                        <span className="text-red-500 text-xs">
                            {errors?.description?.message}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <Label>Property price</Label>
                        <Input type="number" {...register("price")} />
                        <span className="text-red-500 text-xs">
                            {errors?.price?.message}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <Label>Property location</Label>
                        <Input {...register("location")} />
                        <span className="text-red-500 text-xs">
                            {errors?.location?.message}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <Label>Property age</Label>
                        <Input {...register("age")} type="number" />
                        <span className="text-red-500 text-xs">{errors?.age?.message}</span>
                    </div>
                    <div className="space-y-1">
                        <Label>
                            Property pictures{" "}
                            <span className="text-gray-400 text-xs">(multiple)</span>
                        </Label>
                        <Input
                            type="file"
                            multiple
                            onChange={(e) => {
                                const files = e.target.files;
                                const tempFiles = [];
                                if (files.length == 0 && uploadFiles.length == 0) {
                                    return setFileErr("please seclect a file");
                                }
                                for (const key in files) {
                                    const file = files[key];
                                    if (
                                        file instanceof File &&
                                        !ACCEPTED_FILE_TYPE.includes(file.type)
                                    ) {
                                        return setFileErr("Only png, jpg, jpeg files are allowed");
                                    }
                                    if (file instanceof File) tempFiles.push(file);
                                }
                                setFileErr("");
                                setFiles(tempFiles);
                                setUploadFiles((prev) => {
                                    const updatedFile = [];
                                    tempFiles.forEach((file) => {
                                        const alreadyExist = prev.some(
                                            (prevFile) => prevFile.name == file.name
                                        );
                                        if (!alreadyExist) {
                                            updatedFile.push(file);
                                        }
                                    });
                                    return [...prev, ...updatedFile];
                                });
                            }}
                        />
                        <span className="text-red-500 text-xs">{fileErr}</span>
                        <div className="w-[460px] flex gap-5 overflow-x-auto  ">
                            {
                                existingImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className=" flex-none relative h-60 bg-red-400 w-[300px]"
                                    >
                                        <img
                                            src={image}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            onClick={() =>
                                                setExistingImages(existingImages.filter((_, i) => i != index))
                                            }
                                            type="button"
                                            className="absolute top-2 right-2 bg-gray-100 p-1 rounded-md"
                                        >
                                            <CircleX />
                                        </button>
                                    </div>
                                ))
                            }
                            {uploadFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className=" flex-none relative h-60 bg-red-400 w-[300px]"
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() =>
                                            setUploadFiles(uploadFiles.filter((_, i) => i != index))
                                        }
                                        type="button"
                                        className="absolute top-2 right-2 bg-gray-100 p-1 rounded-md"
                                    >
                                        <CircleX />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center pt-5">
                        <Button>Upload</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
