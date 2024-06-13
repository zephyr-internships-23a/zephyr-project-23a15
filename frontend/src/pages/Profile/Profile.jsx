import Navbar from "@/components/Navbar/Navbar";
import { Button } from "@/components/ui/button";
import { useStoreContext } from "@/store/StoreProvider";
import { Link } from "react-router-dom";
import { Edit2Icon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MapPinIcon } from "lucide-react";
import UploadPropertyModal from "@/components/UploadProperty/UploadPropertyModal";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
export default function Profile() {
  const { user_data, user } = useStoreContext();
  console.log(user_data)
  return (
    <section className="container relative min-h-screen">
      <Navbar />
      <main className="mt-10">
        <div className="flex justify-center gap-4 md:gap-10">
          <img
            className="h-20 w-20 object-cover  rounded-full"
            src={user_data?.avatar}
          />
          <div className="space-y-2">
            <h1 className="text-gray-500 font-semibold">{user_data?.name}</h1>
            <p className="text-gray-500 border px-2 pb-1 rounded-md">
              {user_data?.email}
            </p>
            <span className="bg-gray-200 px-3 pb-1 text-gray-500 inline-block rounded-md">
              {user_data?.account_type}
            </span>
            <p className="text-slate-500 text-sm font-semibold">
              {user_data?.phone}
            </p>

            <p className="text-slate-500 flex gap-2 text-sm font-semibold capitalize">
              <MapPinIcon />
              {user_data?.address}
            </p>
          </div>
          <Link to="/edit/profile">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="outline">
                    <Edit2Icon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
        </div>
        {/* if it is an user account show previous contacted agents */}
        <table className="table-auto w-full rounded-lg shadow-md mt-10">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm font-medium">
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Payment Id</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              user_data?.transactions?.map((transaction, index) => (
                <tr key={transaction?._id}>
                  <td className="px-6 py-4 border-b text-center border-gray-200">{index + 1}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-center">₹{transaction?.price}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-center">{transaction?.property?.title}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-center">{transaction?.property?.location}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-center">{transaction?.payment_id}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-center">
                    <Link to={`/property/${transaction?.property?._id}`} className="text-indigo-500 hover:text-indigo-700 text-centerF">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>


        {user_data.account_type == "agent" && (
          <>
            {
              user_data?.properties?.length !== 0 && (
                <h1 className="my-10">Your uploaded properties</h1>
              )}
            <div className="grid grid-cols-3 ">

              {user_data?.properties?.map((d) => (
                <Link key={d.id} to={`/property/${d._id}`} >
                  <Card className="w-full max-h-[400px] ">
                    <CardHeader>
                      <CardTitle className="text-lg text-slate-500">
                        {d.title}
                      </CardTitle>
                      <CardDescription className='truncate'>{d.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img
                        src={d.images[0]}
                        className="h-52 object-cover
                 w-full"
                      />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex text-xs font-semibold text-slate-400 items-center">
                        <MapPinIcon size={15} />
                        {d.location}
                      </div>
                      <div className="text-xs text-slate-400 font-semibold ">
                        by {d.user_id.name}
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}


        {/* if it is an agent acount show list of all properties uploaded by him */}
        {user_data.account_type == "agent" && (
          <div className="flex justify-center mt-10">
            <UploadPropertyModal />
          </div>
        )}
      </main>
      {user_data.account_type == "user" && (
        <div className="float-right absolute bottom-2 right-2 ">
          <Link to="/become/agent">
            <Button variant="outline">Become an agent?</Button>
          </Link>
        </div>
      )}
    </section>
  );
}
