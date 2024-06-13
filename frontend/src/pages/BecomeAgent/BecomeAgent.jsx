import Navbar from "@/components/Navbar/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AxiosInstance from "@/utils/AxiosInstance";
const ACCEPTED_FILE_TYPE = 'application/pdf';
const schema = yup.object().shape({
    experience: yup.string().required(),
    sold: yup.string().typeError('sold must be a number').required(),
    file: yup.mixed().test('required', 'please select a file', (value) => {
        return value
    }).test('fileType', 'only pdf files are supported!', (value) => {
        let file = value[0]
        return ACCEPTED_FILE_TYPE == file.type
    }),
});
export default function BecomeAgent() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        console.log(data)

        const formData = new FormData();
        for (var key in data) {
            if (key == 'file') {
                formData.append(key, data[key][0]);
                console.log(data[key][0])
                continue;
            }
            formData.append(key, data[key]);
        }

        try {
            const response = await AxiosInstance.post("/apply/agent", formData, {
                headers: {
                    ...AxiosInstance.defaults.headers,
                    "Content-Type": "multipart/form-data",
                },
            })
            console.log(response)
            if (response.status == 200) {
                toast.success('Applied successfully wait for admin to approve');
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || error?.message);
        }
    }

    return (
        <section className="container">
            <Navbar />

            <form onSubmit={handleSubmit(onSubmit)} className=" flex mt-10 justify-center items-center gap-3 flex-col">
                <div className="">
                    <Label>Experience</Label>
                    <Input {...register("experience")} className='w-96' placeholder='...in years 0.3 means 3 months' />
                    <span className="text-red-500 text-sm">
                        {errors?.experience?.message}
                    </span>
                </div>
                <div className="">
                    <Label>How many properties sold</Label>
                    <Input className='w-96' {...register("sold")} placeholder='10' />
                    <span className="text-red-500 text-sm">
                        {errors?.sold?.message}
                    </span>
                </div>
                <div className="">
                    <Label>ID Proof <span className="text-xs text-slate-400">(only pdf files)</span></Label>
                    <Input {...register("file")} type='file' className='w-96' placeholder='...in years 0.3 means 3 months' />
                    <span className="text-red-500 text-sm">
                        {errors?.file?.message}
                    </span>
                </div>
                <div className="w-96">
                    <Button className='w-full'>Submit</Button>
                </div>
            </form>


        </section>
    )
}
